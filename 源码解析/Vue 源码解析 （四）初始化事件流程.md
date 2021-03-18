# Vue 源码解析 （四）初始化事件流程

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
