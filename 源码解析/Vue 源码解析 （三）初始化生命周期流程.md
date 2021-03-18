# Vue 源码解析 （三）初始化生命周期流程

先来看以下这个简单的生命周期例子：

```js
const vm = new Vue({
                el: "#app",
                components: {
                    "comp-a": compA
                },
                beforeCreate() {
                    console.log("beforeCreate")
                },
                created() {
                    console.log("created")
                },
                mounted() {
                    console.log("mounted")
                },
                beforeUpdate() {
                    console.log("beforeUpdate")
                },
                updated() {
                    console.log("updated")
                },
                beforeDestroy() {
                    console.log("beforeDestroy")
                },
                destroyed() {
                    console.log("destroyed")
                }
            })
```

可以看到先后执行了 beforeCreate, created, mounted, 为什么没有执行 updated, 是因为我们没有手动触发更新，我们可以尝试着触发手动更新下;

```js
mounted() {
   this.$forceUpdate();
   console.log("mounted")
},
```

同理我们也需要手动触发销毁动作：

```js
mounted() {
  this.$destroy();
  console.log("mounted")
},
```

# setActiveInstance

设置激活的组件实例对象，是因为存在 keep-alive 的情况，所以需要处理：
- 保存上一个激活对象
- 保存 vm 为当前激活对象
- 返回函数

```js
function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }
```

# initLifecycle

初始化生命周期，当前的 vm 对象出现以下几个属性：

```js

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
```
我们来看下例子：

```js
const compA = {
    template: "<div>我是compA</div>"
}
const vm = new Vue({
    el: "#app",
    components: {
        "comp-a": compA
    }
})
console.log(vm)
```

initLifecycle() 函数的具体代码如下:
```js
function initLifecycle(vm) {
    /*获取到options, options已经在mergeOptions中最终处理完毕*/
    var options = vm.$options;

    // locate first non-abstract parent
    /*获取当前实例的parent*/
    var parent = options.parent;
    /*parent存在, 并且不是非抽象组件*/
    if (parent && !options.abstract) {
        /*循环向上查找, 知道找到是第一个非抽象的组件的父级组件*/
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent;
        }
        /*将当前的组件加入到父组件的$children里面.  此时parent是非抽象组件 */
        parent.$children.push(vm);
    }
    /*设置当前的组件$parent指向父级组件*/
    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    /*设置vm的一些属性*/
    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}
```
从上面的 if 开始, 成立的条件是: 当前组件有 parent 属性, 并且是非抽象组件. 才进入 if 语句. 然后通过 while 循环.向上继续查到 第一个非抽象组件. 然后做了两件事:

将当前的 vm 添加到查找到的第一个非抽象父级组件 $children 中
```js
 parent.$children.push(vm);
```
将当前的组件的$parent,指向查找到的第一个非抽象组件
```js
vm.$parent = parent;
```
之后的代码给vm设置了一些属性

# Vue.prototype._update

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el // 拿到上一次更新元素
    const prevVnode = vm._vnode // 拿到上一次更新的虚拟节点
    const restoreActiveInstance = setActiveInstance(vm) // 缓存当前实例
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
    	// 如果上一次没有更新过，就直接与 vm.$el,vnode 对比更新
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      // 否则就跟上一个节点对比跟新
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```

# Vue.prototype.$forceUpdate

强制更新，刷新视图数据没有及时更新问题。
通知当前实例对象是否存在 _watcher, 如果存在就直接 update()

```js
Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }
```

# Vue.prototype.$destroy

- 判断是否开始销毁，是就直接放回
- callHook(vm, 'beforeDestroy') 调用 beforeDestroy
- 设置 `_isBeingDestroyed` 为 `true`
- 移除自身
- 销毁 `watcher`
- 移除 `data.__ob__`
- 设置 _isDestroyed  为 true
- callHook(vm, 'destroyed') 调用 destroyed
- 解绑所有监听事件
- 移除 vm.$el.__vue__ = null
- 移除 vm.$vnode.parent = null

源码如下：

```js
Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
}
```

# mountComponent

挂载组件

- 挂载之前会先调用 callHook(vm, 'beforeMount')
- 更新组件

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```
- 依赖收集监听
- 挂载

```js
export function mountComponent(
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

# updateChildComponent
更新子组件之前，我们需要做以下处理
- 拿到 parentVnode.data.scopedSlots
- 拿到 vm.$scopedSlots
- 判断是否具有动态 scopedSlots
- 处理强制刷新操作 needsForceUpdate
- 保存 parentVnode
- 更新 _vnode.parent
- 更新 attrs
- 更新 listeners
- 更新 props

源码如下：

```js
export function updateChildComponent(
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  const newScopedSlots = parentVnode.data.scopedSlots
  const oldScopedSlots = vm.$scopedSlots
  const hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  )

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  const needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  )

  vm.$options._parentVnode = parentVnode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  vm.$options._renderChildren = renderChildren

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject
  vm.$listeners = listeners || emptyObject

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }

  // update listeners
  listeners = listeners || emptyObject
  const oldListeners = vm.$options._parentListeners
  vm.$options._parentListeners = listeners
  updateComponentListeners(vm, listeners, oldListeners)

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false
  }
}
```

# activateChildComponent

激活子组件

- 判断是否直接激活
- 循环激活 vm.$children
- 调用 callHook(vm, 'activated')

```js
export function activateChildComponent(vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}
```
# deactivateChildComponent

不激活组件

- 判断是否是直接不激活
- 循环不激活 vm.$children
- 调用 callHook(vm, "deactivated")

```js
export function deactivateChildComponent(vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}
```

# callHook

通过看源码我发现子组件竟然可以这样写生命周期

```js
<com-a hook:updated="updatedEvent"></com-a>
```

- 先入栈操作
- 拿到 options.hook
- 处理错误问题
- vm.$emit('hook:' + hook)
- 出栈操作

```js
export function callHook(vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```
