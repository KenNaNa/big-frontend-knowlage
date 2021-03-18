# big-frontend-knowlage
大前端知识

# 对大前端学习的整体规划

### js 各大重要知识点


### CSS 各大重要知识点


### HTML 各大重要知识点


### 每天一个 MDN API 学习


### Vue 学习


### 源码解析



### 计算机专业知识
因为小编是非专业出生的，这些都是要狠狠的补回来的，迟早的事情，现在不做更待何时



### nodejs 各大重要知识点




### 数据库 各大知识点




### 前端各大算法知识





### 最后做成一个社区，拥有自己的网站



dsdsddsdsdd




# 写这份初衷
我不想再只是看别人的知识总结了，实在是太多了，而且每个人的理解，成长方式不同，必须要按照自己的步骤来实现，不能被别人带着走，或许别人能够告诉你一些前沿的东西，更多的是自己勇敢的去探索，在这里立下誓言，写这份文档，拒绝抄袭，拒绝抄袭，拒绝抄袭，必须坚持原创，希望后面有更多的人参与进来





# Vue 源码解析 （三）初始化生命周期流程

![eb131cfce809d59e1cc28de1b2cc5c9d_1742x492.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/eb131cfce809d59e1cc28de1b2cc5c9d_1742x492.png@900-0-90-f.png)

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

![image.png](http://image.huawei.com/tiny-lts/v1/images/b9282ec5b1df9e85a2e01d4519b3ed15_593x171.png@900-0-90-f.png)

可以看到先后执行了 beforeCreate, created, mounted, 为什么没有执行 updated, 是因为我们没有手动触发更新，我们可以尝试着触发手动更新下;

```js
mounted() {
   this.$forceUpdate();
   console.log("mounted")
},
```
![image.png](http://image.huawei.com/tiny-lts/v1/images/b6cc186e249c1222c92b7ceeffb7273b_734x204.png@900-0-90-f.png)

同理我们也需要手动触发销毁动作：

```js
mounted() {
  this.$destroy();
  console.log("mounted")
},
```
![image.png](http://image.huawei.com/tiny-lts/v1/images/ae4beb3dc8d823813fd85ecbc2251e78_736x215.png@900-0-90-f.png)

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
![image.png](http://image.huawei.com/tiny-lts/v1/images/6b98cbf6bb3cb9c1a6115e10a4e32b00_921x694.png@900-0-90-f.png)

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
![image.png](http://image.huawei.com/tiny-lts/v1/images/1f6a090d1bb2d5ad15de85e48e2f925f_1009x310.png@900-0-90-f.png)

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

# Vue 源码解析 （四）初始化事件流程

![92186e6cea98981be2f0d607bb5f38a0_1372x502.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/92186e6cea98981be2f0d607bb5f38a0_1372x502.png@900-0-90-f.png)

# initEvents

- vm 出现 _events 对象
- vm 出现 _hasHookEvent 表示是否存在 hook 事件
- 初始化 updateComponentListeners

```js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```

# add

添加事件，内部使用 $on 监听绑定事件

```js
function add (event, fn) {
  target.$on(event, fn)
}
```

# remove

解绑事件，内部使用 $off 解绑事件

```js
function remove (event, fn) {
  target.$off(event, fn)
}
```

# createOnceHandler

创建只执行一次的 once 事件，返回一个函数体

```js
function createOnceHandler (event, fn) {
  const _target = target
  return function onceHandler () {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}
```
# updateComponentListeners

- 更新前 target = vm
- 更新事件
- 更新后 target = null

```js
export function updateComponentListeners (
  vm: Component,
  listeners: Object,
  oldListeners: ?Object
) {
  target = vm
  updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm)
  target = undefined
}
```
# eventsMixin

### Vue.prototype.$on

- 判断要监听的事件是不是数组，如果是，逐个监听
- 否则，vm._events 保存事件
- 检测到魔板存在 hook 事件，则把 _hasHookEvent 设置为 true

```js
Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }
```


以下代码会执行上面的代码:

```html
<keep-alive>
   <comp-a @hook:updated="hookUpdated" 										@hook:mounted="hookUpdated" />
</keep-alive>
```
![image.png](http://image.huawei.com/tiny-lts/v1/images/d3819591b21ebfc84004a4f0ba2f2289_902x287.png@900-0-90-f.png)

### Vue.prototype.$once

不知道这个事件是干嘛用的

```js
Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }
```

### Vue.prototype.$off

用于解绑事件监听
- 判断参数是否存在，不存在直接返回
- 判断事件参数是不是数组，逐个解绑事件
- 

```js
  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // all
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        vm.$off(event[i], fn)
      }
      return vm
    }
    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return vm
  }
```

### ue.prototype.$emit

事件派发

![image.png](http://image.huawei.com/tiny-lts/v1/images/a0383f076042b41d634431edd4de8912_902x417.png@900-0-90-f.png)


```js
 Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    if (process.env.NODE_ENV !== 'production') {
      const lowerCaseEvent = event.toLowerCase()
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
        )
      }
    }
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }
    return vm
  }
```

从源码阅读过程中，我还发现 hook 可以这样写：

```js
beforeCreate: [
                    function a() { console.log("beforeCreate")},
                    function b() { console.log("beforeCreate")}
],
```

![image.png](http://image.huawei.com/tiny-lts/v1/images/6d44256be984eb5f52805ae3106a0c12_1233x335.png@900-0-90-f.png)



# Vue 源码解析 （五）初始化注入流程

![146e3b593e47e84b9a3d7728bf2aa6f6_752x432.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/146e3b593e47e84b9a3d7728bf2aa6f6_752x432.png@900-0-90-f.png)

# hasSymbol 

先来看看 Vue 是如何实现这个方法的

```js
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)
```

# resolveInject

解析传递进来的 inject options

我们先来看看官网的一些例子：
- default 是函数的情况

```js
const Child = {
  inject: {
    foo: {
      from: 'bar',
      default: () => [1, 2, 3]
    }
  }
}
```
- default 是 字符串的情况

```js
const Child = {
  inject: {
    foo: {
      from: 'bar',
      default: 'foo'
    }
  }
}
```

所以代码需要做如下处理：

- 处理 default
- 处理 from 

```js
export function resolveInject(inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    // 创建一个 空对象
    const result = Object.create(null)
    // 判断是否是 Symbol，Reflect
    const keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // #6574 in case the inject object is observed...
      // 去除 key === '__ob__' 的情况
      if (key === '__ob__') continue
      // 获取 from 属性 key
      const provideKey = inject[key].from
      let source = vm
      // 循环获取保存 key
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey]
          break
        }
        source = source.$parent
      }
      // 处理 default 属性 key 的情况
      if (!source) {
        if ('default' in inject[key]) {
          const provideDefault = inject[key].default
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}
```

# initInjections

循环代理

```js
export function initInjections(vm: Component) {
  // 拿到解析的结果
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    // 将属性逐个代理到 vm 对象上，并做响应式处理
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    toggleObserving(true)
  }
}
```
# initProvide
处理我们传递进来的 provide options 属性，
- 可以是对象，
- 可以是方法

```js
export function initProvide(vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}
```

# Vue 源码解析 （六）初始化state流程

![221713e57fa70f437c4dd259007f1c48_1702x292.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/221713e57fa70f437c4dd259007f1c48_1702x292.png@900-0-90-f.png)

# sharedPropertyDefinition

此处提供了 `sharedPropertyDefinition`

```js
const sharedPropertyDefinition = {
  enumerable: true, // 设置可枚举
  configurable: true, // 设置可配置
  get: noop, // get 占位符
  set: noop // set 占位符
}
```
# proxy
- 设置 get 函数
- 设置 set 函数
- 然后给每个 属性 key 添加 set,set方法

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

# initData
- 拿到 data 判断是否是函数，还是对象
- 然后拿到 data 的属性 keys
- 循环检测 methods 函数名，props 属性名是否重复
- 最后给 data 设置响应式处理

```js
function initData(vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ?
    getData(data, vm) :
    data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      // 将 key 代理到 _data 属性上
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */ )
}
```

# getData

- 先入栈
- data.call(vm, vm)
- 然后出栈

```js
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
```
# initComputed

有两种方式
- key 对应一个函数
- key 对应一个对象，对象里面处理 set,get方法

我们先来看看例子：

```js
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
vm.aPlus   // => 2
vm.aPlus = 3
vm.a       // => 2
vm.aDouble // => 4
```

所以在 initComputed 方法里面需要处理以上两种情况

我们在原理里面看到，initComputed 为每一个 computed 中的属性 key 创建了 Watcher, 而且都设置了 lazy 这个属性：

```js
const computedWatcherOptions = {
  lazy: true
}
```

这里说了这一点原理：不同的是计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值

具体代码如下：

```js
function initComputed(vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

# initMethods

- 拿到 props 属性 key 
- 然后逐个跟 methods 属性 key 进行对比
- 判断 methods[key] 是否是函数
- 判断 key 是否在 props 属性被定义过了
- 判断 属性 key 是不是使用 $/_ 开头定义的
- 最后代理到 vm 上面

```js
function initMethods(vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
  }
}
```

# initWatch
在看源码的过程中，我们发现，watch 有两种书写方法
- 数组的形式
- 对象方法的形式
```js
var vm = new Vue({
  data: {
    a: 1,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      function handle1(val, oldVal) {}
      function handle2 (val, oldVal) { /* ... */ },
    ],
  }
})
vm.a = 2 // => new: 2, old: 1
```
- createWatcher

```js
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```

# stateMixin

- 定义了 $set
- 定义了 $delete
- 定义了 $watch

# Vue 源码解析 （七）render-helpers

![image.png](http://image.huawei.com/tiny-lts/v1/images/caa41f4e609d7b1e135fe251f6c950a0_338x285.png@900-0-90-f.png)

# bind-dynamic-keys

```html
 <div id="app" :[key]="value">
```
会被编译成这样的代码

```js
 _c('div', { attrs: bindDynamicKeys({ "id": "app" }, [key, value]) })
```

函数中是这样处理的

```js
baseObj[values[i]] = values[i + 1]
```

# bindObjectListeners

实例：

```js
{
	on: {
   		click: function(e) {} 
   }
}
```

合并已经存在的 on 对象里面的 listeners 和自定义的 listener

```js
const on = data.on = data.on ? extend({}, data.on) : {}
for (const key in value) {
  const existing = on[key]
  const ours = value[key]
  on[key] = existing ? [].concat(existing, ours) : ours
}
```

# bind-object-props

合并例如：v-bind="object" 进入 vnode data

```js
	// 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
```

- 处理 style
- 处理 class
- 处理 attrs
- 处理 domProps

# render-list

用于处理 v-for

- 处理数组，字符串

```js
<div v-for="(item, index) in arr"></div>
<div v-for="(item, index) in str"></div>
```
- 处理数字

```js
<div v-for="(item, index) in num"></div>
```

- 处理对象

```js
<div v-for="(item, index) of obj"></div>
```

- 处理迭代对象

```js
const range = {
	[Symbol.iterator]() {
   		// 实现迭代对象 
   }
}
```

源代码如下：

```js
if (hasSymbol && val[Symbol.iterator]) {
      ret = []
      const iterator: Iterator<any> = val[Symbol.iterator]()
      let result = iterator.next()
      while (!result.done) {
        ret.push(render(result.value, ret.length))
        result = iterator.next()
      }
    }
```

# render-slot

用于渲染 render `<slot>`

```js
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
```

# render-static 用于渲染静态节点

```js
function markStaticNode (node, key, isOnce) {
  node.isStatic = true
  node.key = key
  node.isOnce = isOnce
}
```

# resolve-filter

```js
/**
 * Runtime helper for resolving filters
 */
export function resolveFilter (id: string): Function {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}
```

# resolve-scoped-slots
```html
<template scoped-slot="">
```

# resolve-slots

```html
<slot></slot>
<template v-slot=""></template>
```

# Vue 源码解析 （八）global-api

![ad9755d3e21fcaee59607b6ebfe9c165_992x243.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/ad9755d3e21fcaee59607b6ebfe9c165_992x243.png@900-0-90-f.png)

![image.png](http://image.huawei.com/tiny-lts/v1/images/6196e6fc9967fc4d254edd83ea2a6f23_400x130.png@900-0-90-f.png)


# assets

ASSET_TYPES

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```
# initAssetRegisters
- 处理 components， 检测组件名字是否合法

```js
Vue.component('component-name', {})
```

- 处理 directives
```js
Vue.directive('directive-name', {
	bind: function (el, binding, vnode) {
    el.style.position = 'fixed'
    var s = (binding.arg == 'left' ? 'left' : 'top')
    el.style[s] = binding.value + 'px'
  }
})
Vue.directive('directive-name', function(el, binding){})

```
- 处理 filters

将 components, directives, filters 注册为 Vue 的静态方法

```js
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```

# mixin

使用 mergeOptions 合并策略

```js
import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

# use

用于安装第三方插件，或者自己开发的三方插件

- 判断插件是否已经存在，存在直接 return this
- 判断 plugin.install 是否是函数
- 判断 plugin 是否是函数

```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```



# Vue 源码解析 （八）keep-alive 组件

![fb9e946b76d94054f3edefa40544f878_682x322.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/fb9e946b76d94054f3edefa40544f878_682x322.png@900-0-90-f.png)

今天我们就来说说关于抽象组件 keep-alive 的官方文档：

### Props：

- include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
- exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
- max - 数字。最多可以缓存多少组件实例。
用法：

`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 `<transition>` 相似，`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

当组件在 `<keep-alive>` 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

# 注意

keep-alive 组件 include, exclude 属性：
- 字符串，以逗号为分隔符
- 正则表达式
- 数组的形式

```js
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```

所以我们第一个要讲的就是处理以上三种形式的方法

# matches

- 处理数组
- 处理字符串
- 处理正则
- 返回布尔值
```js
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
```


# 抽象组件如下：

会有一个标志
abstract：true


```js
name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
```

看个例子：

```js
<keep-alive :max="1" include="comp-a">
	<comp-a @hook:updated="hookUpdated"
      msg="hello"
      @hook:mounted="hookUpdated"></comp-a>
</keep-alive>
```

经过调试的过程

![image.png](http://image.huawei.com/tiny-lts/v1/images/8b0b94aad8a047b9232c431840c368ff_1858x577.png@900-0-90-f.png)


# pruneCache

- 参数有 cache: key 对应的 _vnode
- keys 缓存的 keys
- _vnode 虚拟元素

清除缓存

```js
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
```

# Vue 源码解析 （九）响应式研究（一）

![](https://camo.githubusercontent.com/fc3089f80b37a270a0b5057f65de020cd952d8bce3a975bcf3397e53bbd683ea/68747470733a2f2f636e2e7675656a732e6f72672f696d616765732f646174612e706e67)

如何给一个对象设置响应式呢，我们需要将这个对象重新定义，所以就需要一个用于定义属性的方法，这个方法在 Vue 源码中是 def

# def

```js
/**
 * Define a property.
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

在 Vue 源码中，我们看到对数组进行重新处理

- push
- pop
- shift
- unshift
- splice
- sort
- reverse


那么 Vue 是怎么处理的呢？

- 拿到 Array.protorype 原始数组的原型
- 对原始数组原型进行拷贝

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
```

- 然后将这些方法逐个进行 def

```js
/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

为什么上面会处理关于 push, unshift,splice 这三个方法，因为这三个函数有插入新元素的可能，所以需要对新元素进行响应式处理

![image.png](http://image.huawei.com/tiny-lts/v1/images/bb01fba5b345687db302befbd1eeb37a_895x376.png@900-0-90-f.png)

所以你会看到

```js
const ob = this.__ob__
if(inserted) ob.observeArray(inserted)
```

最后通知变化，进行更行

```js
// notify change
ob.dep.notify()
```

# Vue 源码解析 （十）dep 源码分析

dep 是用来管理 Watcher 实例的，dep 中有一个静态属性 target 用来存储唯一的 dep 实例

```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

# addSub

使用数组来管理 watcher 实例

# removeSub

移除 watcher 实例

# depend

存储当前 dep 实例

# notify

通知 watcher 更新


