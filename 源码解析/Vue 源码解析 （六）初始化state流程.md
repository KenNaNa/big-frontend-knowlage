# Vue 源码解析 （六）初始化state流程


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
