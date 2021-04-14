- Vue3 中createApp初始化和更新流程
- Vue3 是如何使用新的 API 兼容 Vue2 组件配置的
- onMount、onUpdate等组合式接口是如何实现的

# 1. 初始化 createApp
一个基本的应用初始化代码如下所示

```js
    createApp({
      setup(){
        return {
          ...
        }
      },
      ...
    }).mount("#app")
```

那么就从createApp开始吧

```js
    // 暴露出来的createApp接口
    export const createApp = ((...args) => {
      // 初始化renderer
      const renderer = ensureRenderer()
      // 初始化app
      const app = renderer.createApp(...args)

      const { mount } = app
      app.mount = (containerOrSelector: Element | string): any => {
        const container = normalizeContainer(containerOrSelector)
        const component = app._component
        const proxy = mount(container) // 调用原本的mount方法
        container.removeAttribute('v-cloak')
        return proxy
      }

      return app
    }) as CreateAppFunction<Element>
```

顺腾摸瓜查看ensureRenderer

```js
let renderer: Renderer | HydrationRenderer;

const rendererOptions = {
  patchProp, // 处理如class、style、onXXX等节点属性
  ...nodeOps, // 封装如insert、remove、createElement、createText等DOM节点操作
};
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer < HostNode, HostElement > options;
}

function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  // 非常庞大的一个方法，vnode diff和patch均在这个方法中实现，后面再细看每个方法的作用
  // ...

  const render: RootRenderFunction = (vnode, container) => {
    // 暂时不追究unmount、patch的细节
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container);
    }
    // 上一篇分析了 flushPostFlushCbs会对postFlushCbs队列进行去重并依次执行
    flushPostFlushCbs();
    container._vnode = vnode;
  };

  return {
    render, // 浏览器渲染函数
    hydrate, // 脱水，用于SSR渲染
    createApp: createAppAPI(render, hydrate),
  };
}
```
从上面我们可以看见，ensureRenderer返回的renderer实际上是一个包含 render、hydrate 和createApp方法的对象，

```js
 export function createAppAPI<HostElement>(
      render: RootRenderFunction,
      hydrate?: RootHydrateFunction
    ): CreateAppFunction<HostElement> {
      // 真正的createApp方法，`rootComponent`实际上就是我们在业务代码中传入的`{setup(){},...}`这个对象
      return function createApp(rootComponent, rootProps = null) {
        const context = createAppContext()
        const installedPlugins = new Set()

        let isMounted = false
        // App对象包含use、mixin、component、directive、mount、unmount、provide等接口，相关接口实现来这里看就可以了
        const app: App = {
          // ...
          mount(rootContainer: HostElement, isHydrate?: boolean): any {
            if (!isMounted) {
              const vnode = createVNode(rootComponent as Component, rootProps)
              vnode.appContext = context
              // 调用外层 createAppAPI 传进来的hydrate和render方法
              if (isHydrate && hydrate) {
                hydrate(vnode as VNode<Node, Element>, rootContainer as any)
              } else {
                // 浏览器mount时走render
                render(vnode, rootContainer)
              }
              isMounted = true
              app._container = rootContainer
              return vnode.component!.proxy
            }
          },
        }
        return app
      }
    }
```

App 对象上包含众多 API,相关的源码都可以在这里查看。

至此，我们就完成了单组件应用构建的基本流程

初始化rootComponent，传入createApp
调用ensureRenderer，同时传入相关的 DOM 操作接口，构造渲染器，渲染器包括render、createApp等 API
renderer.render的主要作用是将vnode进行diff和patch操作并挂载到container上
renderer.createApp内初始化 context 和app对象，app 对象提供包括component、mount等多个方法
调用renderer.createApp方法，获取app实例，包装app.mount方法，
app.mount内部调用createVNode处理rootComponent，然后调用 render 渲染 vnode
用户调用mount("#app")，内部调用app.mount，完成整个应用的初始化
从这个步骤可以看见几个比较重要的接口

createVNode，根据配置参数生成 vnode 节点
renderer.render，对 vnode 进行 diff 和 patch 操作
没错，这就是大家都熟悉的虚拟 DOM 三板斧，come on~

# 2. 虚拟 DOM createVNode
返回一个VNode对象，用于描述某个具体的接口，通过node.type区分节点的类型，对于组件类型的节点(往往是应用的根节点)，通过createVNode返回的 vnode 大概包含下面属性



貌似跟 Vue2 的 VNode 节点属性有一些差异~


# 3. render 渲染 VNode
我们知道，Vue 的 diff 过程是边 diff 边更新 DOM 的，这个过程被统一称为patch

```js
render(vnode, rootContainer)
```

在renderer.render方法中传入了根节点 vnode，因此会走 patch 方法


```js
// 初始化时container._vnode为null，vnode为应用根节点
patch(container._vnode || null, vnode, container)
```

# 3.1. patch
在patch方法中就是被扒了很多遍的 diff 算法

```js
type PatchFn = (
  n1: VNode | null, // 旧节点，如果为空表示mount
  n2: VNode, // 新节点
  container: RendererElement,
  anchor?: RendererNode | null,
  parentComponent?: ComponentInternalInstance | null,
  parentSuspense?: SuspenseBoundary | null,
  isSVG?: boolean,
  optimized?: boolean
) => void;

const patch: PatchFn = (
  n1,
  n2,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  optimized = false
) => {
  // 旧节点与新节点类型不一致，卸载旧节点
  // ...isSameVNodeType(n1,n2)，需要n1.type===n2.type && n1.key === n2.key

  const { type, ref, shapeFlag } = n2;
  // 然后根据vnode.type做对应的处理
  //switch (type)
  // Text -> processText(n1, n2, container, anchor)，文本节点
  // Comment -> processCommentNode(n1, n2, container, anchor)
  // Static -> 只有当n1===null mount时才调用mountStaticNode，提升性能
  // Fragment ->processFragment(n1,n2,container,anchor,parentComponent,parentSuspense,isSVG,optimized)
  // shapeFlag & ShapeFlags.ELEMENT -> processElement，DOM元素节点
  // shapeFlag & ShapeFlags.COMPONENT -> processComponent，组件节点
  // shapeFlag & ShapeFlags.TELEPORT -> (type as typeof SuspenseImpl).process
  // __FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE -> (type as typeof SuspenseImpl).process

  // 最后调用setRef设置ref
  // set ref
};
```


可以看见新增的TELEPORT和SUSPENSE类型节点~目前不必深究每种类型具体的处理逻辑，按照经验，我们先弄懂processComponent组件处理逻辑即可。

在 diff 组件节点时，主要有三种情况

旧节点不存在，
keep-alive 组件，直接进行activate流程
否则进入mountComponent路程，初始化组件实例，处理 options，调用created、mounted等钩子函数等，初始化视图
旧节点存在，走updateComponent流程，调用updated等钩子函数，更新视图

# 3.2. mountComponent

```js
const mountComponent: MountComponentFn = (...args) => {
  // 初始化组件实例，将instance保存在vnode.component属性上面，在这一步中组件实例的大部分属性都没有被初始化
  const instance: ComponentInternalInstance = (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent,
    parentSuspense
  ));
  // 完善instance相关属性
  setupComponent(instance);

  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  );
};
```
可见，在mountComponent中主要做了三件事

createComponentInstance，初始化组件实例，组件实例包括 appContext、parent、root、props、attrs、slots、refs 等属性
setupComponent，完善 instance，
调用initProps、initSlots，初始化 instance 相关属性，
外还会通过setupStatefulComponent调用传入的setup方法，获取返回值setupResult，根据其数据类型
finishComponentSetup，
检测instance.render是否存在，不存在则调用compile(Component.template)编译渲染函数
在__FEATURE_OPTIONS__配置下调用applyOptions兼容 Vue2.x，合并配置项到 vue 组件实例，初始化watch、computed、methods等配置项，调用相关生命周期钩子等
setupRenderEffect，主要是实现instance.update方法，该方法等价于effect(function componentEffect(){...})，程序如何渲染和更新视图就在这里，这也是接下来阅读的重点

# 3.3. setupComponent 运行 Vue3 的 setup 方法

```js
    export function setupComponent(
      instance: ComponentInternalInstance,
      isSSR = false
    ) {
      isInSSRComponentSetup = isSSR

      const { props, children, shapeFlag } = instance.vnode
      const isStateful = shapeFlag & ShapeFlags.STATEFUL_COMPONENT
      initProps(instance, props, isStateful, isSSR) // 设置组件的props和attrs
      initSlots(instance, children) // 设置组件的slots


      const setupResult = isStateful
        ? setupStatefulComponent(instance, isSSR) // 调用setUp方法
        : undefined
      isInSSRComponentSetup = false
      return setupResult
    }

    function setupStatefulComponent(
      instance: ComponentInternalInstance,
      isSSR: boolean
    ) {
      const Component = instance.type as ComponentOptions
      const { setup } = Component
      if (setup) {
        // 处理setup第二个参数，是一个包含 { attrs: instance.attrs, slots: instance.slots,emit: instance.emit }的对象
        const setupContext = (instance.setupContext =
          setup.length > 1 ? createSetupContext(instance) : null)

        currentInstance = instance // 更新全局变量 currentInstance
        pauseTracking() // 暂停依赖收集，为什么在调用setUp的时候要暂停依赖收集呢？
        const setupResult = callWithErrorHandling(
          setup,
          instance,
          ErrorCodes.SETUP_FUNCTION,
          [instance.props, setupContext]
        )
        resetTracking() // 恢复依赖收集
        currentInstance = null

        handleSetupResult(instance, setupResult, isSSR)
      }

      finishComponentSetup(instance, isSSR)
    }
```

如果传入了setup配置，则会运行并通过handleSetupResult处理 setupResult 返回值

如果是 Promise 对象，则放入instance.asyncDep
如果是函数，则用来替换instance.render
如果是字面量对象，则赋值给instance.setupState，参与后续 render，模板中使用到的变量、方法等，均是通过访问 setupState 得到的
其他情况，如果不为 undefined，则会抛出异常提示
# 3.4. finishComponentSetup 兼容 Vue2 配置项
finishComponentSetup 主要的工作包括

在 instance.render 方法不存在的情况下，通过compile(Component.template)在运行时编译获得 render 方法
在向后兼容的情况下 通过applyOptions解析 Vue2 类型的配置
在文档里面提到，Vue3 是兼容 Vue2 的组件配置项的，也就是说我们可以向createApp方法传入类似于 Vue2 的 options 配置

```js
<div id="app">
  <h1 @click="clickHandler">{{msg}}</h1>
  <p @click="clickHandler2">{{name}}</p>
</div>
<script>
  const { createApp, reactive, computed, watchEffect } = Vue;
  let setup = () => {
    return {
      msg: "setup hello",
      clickHandler() {
        console.log("setup clickHandler");
      },
    };
  };
  createApp({
    data() {
      return {
        msg: "data hello", // 会被setup返回值的msg覆盖掉
        name: "shymean", // 不再setup返回值中的数据可以继续访问
      };
    },
    setup,
    // methods 等配置同理
    methods: {
      clickHandler() {
        console.log("methods clickHandler");
      },
      clickHandler2() {
        console.log("methods clickHandler2");
      },
    },
  }).mount("#app");
</script>
```
在createApp参数同时传入了setup和其他 Vue2 配置项的时候，会在finishComponentSetup中通过applyOptions解析其他 vue2 配置项，包括调用相关的声明周期函数，然后将相关的配置与 setup 返回值进行合并。

换句话说，如果不传入 setup 参数，那么现有的 Vue2 组件配置理论上也是可以在 Vue3 中正常运行的。那么，我们可以在尽量不改变现有组件配置的基础上实现平滑升级吗？这一点待我继续研究一下，然后拿个项目试试水先。

# 3.5. setupRenderEffect
Vue3 中的 effect 与 Vue2 中的 Wather 是比较相似的，主要用于抽象一些当数据发生变化时对应的处理逻辑，可以包括watchEffect等回调，当然最重要的视图更新逻辑也可以使用 effec 对象来承载。接下来看看setupRenderEffect方法

```js
 const setupRenderEffect = () => {
      instance.update = effect(function componentEffect() {
        if (!instance.isMounted) {
          const { bm, m, a, parent } = instance
          // beforemount 钩子
          if (bm) {
            invokeArrayFns(bm)
          }
          // 首次渲染 解析组件节点，获取vnode子树
          const subTree = (instance.subTree = renderComponentRoot(instance))
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG) // 递归处理子节点
          initialVNode.el = subTree.el
          // mounted 钩子
          if (m) {
            queuePostRenderEffect(m, parentSuspense)
          }
          // ...
        }else {
          // 页面更新
          let { next, bu, u, parent, vnode } = instance
          if (next) {
            updateComponentPreRender(instance, next, optimized)
          } else {
            next = vnode
          }
          // beforeUpdate hook
          if (bu) {
            invokeArrayFns(bu)
          }
          // 重新获取vnode子树
          const nextTree = renderComponentRoot(instance)
          const prevTree = instance.subTree
          instance.subTree = nextTree
          next.el = vnode.el
          patch(prevTree, nextTree, hostParentNode(prevTree.el!)!, getNextHostNode(prevTree), instance, parentSuspense, isSVG)
          next.el = nextTree.el
          // ...
          // updated hook
          if (u) {
            queuePostRenderEffect(u, parentSuspense)
          }
        }
      }, {
        scheduler: queueJob
        // 此处没有传option.lazy = true
      })
    }
```

可以看见instance.update实际上是一个 effect 函数对象

由于没有传入option.lazy配置，在effect(componentEffect)初始化时会调用一次componentEffect，这样就可以执行 effect，从而完成页面的初始化 mount
在patch的时候，会运行 render 函数渲染视图，从而触发相关数据的 get，然后 track 当前的componentEffect；当状态变化时，会重新 trigger componentEffect
其配置的 scheduler 为queueJob，因此每次 trigger 触发 effect run 时，会通过 queueJob 将 effect 放入 queue 全局队列中等待 nextTick 运行，因此多个状态的改变会合并在一起进行视图更新
在componentEffect中有几个比较关键的函数

renderComponentRoot，
根据组件类型调用instance.render(STATEFUL_COMPONENT 组件)或instance.type(FunctionalComponent 组件)获取组件子节点，
将组件的ScopeId通过 props 的形式传入
处理vnode.dirs、vnode.transition等继承 props
调用patch递归处理子节点，这里就可以知道为啥组件 template 必须返回的是单个根节点了
在 patch 中，重复前面根据节点类型调用对应的 process 方法
对于更新的时候，除了调用renderComponentRoot获取新的子树之外，还有一些额外的处理

updateComponentPreRender，调用updateProps、updateSlots等方法更新相关数据
看起来整体流程跟 Vue2 变化并不是很大，上面的流程忽略了很多细节内容，包括

如何将template通过compile方法编译成render函数
patch 方法中的 diff 细节，除了Component之外其他节点（如Static）的处理逻辑。之前的直播中提到重写了 Virtual DOM，性能貌似有不少提升，这里后面分析
# 4. 组合式 API
在剩下的篇幅中，打算探究一下其他的组合 API，包括onMount、onUpdate等新的方法

```js
    export const createHook = <T extends Function = () => any>(
      lifecycle: LifecycleHooks
    ) => (hook: T, target: ComponentInternalInstance | null = currentInstance) =>
      // target 默认为 当前组件实例，在调用setup之前，会设置为当前正要运行setup的组件实例
      !isInSSRComponentSetup && injectHook(lifecycle, hook, target)

    export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT)
    export const onMounted = createHook(LifecycleHooks.MOUNTED)
    export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE)
    export const onUpdated = createHook(LifecycleHooks.UPDATED)
    export const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT)
    export const onUnmounted = createHook(LifecycleHooks.UNMOUNTED)
```


然后来看一下injectHook

```js
export let currentInstance: ComponentInternalInstance | null = null;

export function injectHook(
  type: LifecycleHooks,
  hook: Function & { __weh?: Function },
  target: ComponentInternalInstance | null = currentInstance,
  prepend: boolean = false
) {
  if (target) {
    // 每种钩子注册的回调函数都会放在一个数组中
    const hooks = target[type] || (target[type] = []);
    const wrappedHook =
      hook.__weh ||
      (hook.__weh = (...args: unknown[]) => {
        if (target.isUnmounted) {
          return;
        }
        // 由于钩子函数可以在setup方法内被其他的effect触发，因此在运行钩子函数时，需要要先暂停依赖手机
        pauseTracking();
        // 需要保证在钩子函数内不会触发其他钩子函数，因此强制设置一下 currentInstance = target
        setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        setCurrentInstance(null);
        resetTracking();
        return res;
      });
    // 控制多个同名钩子的运行顺序
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
  }
}
```
可以看见，相关的生命周期函数都是通过injectHook注册的。然后在前面的componentEffect的我们看到了各种钩子的调用

```js
const { bm, m, a, parent } = instance;
// beforemount 钩子
if (bm) {
  invokeArrayFns(bm);
}
// mounted 钩子
if (m) {
  queuePostRenderEffect(m, parentSuspense);
}
```
兼容 Vue2 的各种钩子，也是直接在applyOptions中兼容的

```js
// 判断配置项中是否传入相关的钩子函数，如果有，则调用onXXX将回调注册在instance实例上
if (beforeMount) {
  onBeforeMount(beforeMount.bind(publicThis));
}
if (mounted) {
  onMounted(mounted.bind(publicThis));
}
if (beforeUpdate) {
  onBeforeUpdate(beforeUpdate.bind(publicThis));
}
if (updated) {
  onUpdated(updated.bind(publicThis));
}
```



有了这些组合式 API，我们就可以更自由地封装组件逻辑啦。理解了上一篇文章的 effect 和前面的构造流程，理解组合式 API 的实现就比较简单了

#  5. 小结
到目前为止，我们就梳理了从createApp开始到mount渲染应用的整个流程，总结一下

首先通过baseCreateRenderer初始化render方法，通过createAppAPI将相关接口挂载到 app 实例上
render 方法内部会封装patch(vnode, container)相关逻辑，
调用app.mount时会调用 render 方法
patch方法封装了 diff 算法，根据节点类型 type 执行相关操作，根节点会使用传入createApp的配置项作为 type，然后调用processComponent
对于 mount 阶段而言，会使用mountComponent，初始化组件实例，具体内容包括
调用传入的setup方法，获得返回值 setupRestult，同时向下兼容 Vue2 的其他配置项
通过setupRenderEffect实现组件实例的 update 方法，该方法会在运行时设置 activeEffect，然后被其他 reactive 属性的 get 钩子进行收集；当依赖属性发生变化时，将通知 effect 重新运行，更新视图


























