# Vue 学习

# Vue 源码解析 （十一）Observe 源码分析

![8965b33b91e598de963f39c57e30b294_782x282.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/8965b33b91e598de963f39c57e30b294_782x282.png@900-0-90-f.png)

# hasProto

```js
export const hasProto = '__proto__' in {}
```
# arrayKeys

为了拿到数组的原型的属性key
```js
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
```
举个例子：

```js
Object.getOwnPropertyNames(Array.prototype)
```

上面这个例子在浏览器控制台会打印出来：

```js
["length", "constructor", "concat", "copyWithin", "fill", "find", "findIndex", "lastIndexOf", "pop", "push", "reverse", "shift", "unshift", "slice", "sort", "splice", "includes", "indexOf", "join", "keys", "entries", "values", "forEach", "filter", "flat", "flatMap", "map", "every", "some", "reduce", "reduceRight", "toLocaleString", "toString"]
```

我们需要注意的是，我们可能在某些情况下，需要阻止数据响应式，所以 Vue 中定义了一个方法：

```js

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
export let shouldObserve: boolean = true

export function toggleObserving(value: boolean) {
  shouldObserve = value
}
```

在观测对象 Observe 中，需要对数组，对象进行观测，而且是深度观测：

```js
class Observe {
	 constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
}
```

我们来拆解上面的这句代码：

```js
def(value, '__ob__', this)
```
关于 def 函数如下：

```js
/* def(value, '__ob__', this) */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}
```

`def` 函数主要是配置 `Object.defineProperty` 里的 `enumerable`. 在 `Observer` 里面调用了 `def`,没传递 `enumerable`, 那么就是`undefined`, `!!enumerable`两次取反最终为`false`. 通过 `for in` 操作不可枚举出 `__ob__` 属性

# 数组处理
先判断 `Array.isArray(value)`
再判断 `__proto__` 原型是否存在 hasProto

```js
if (hasProto) {
  protoAugment(value, arrayMethods)
} else {
  copyAugment(value, arrayMethods, arrayKeys)
}
```
做了兼容性处理

- protoAugment

 直接覆盖 `__proto__` 原型

```js
/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}
```

- copyAugment
拷贝原型上的数组方法
重新定义属性标志
处理为不可枚举状态
```js
/* istanbul ignore next */
function copyAugment(target: Object, src: Object, keys: Array < string > ) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```
- 最后对数组进行响应式处理

```js
this.observeArray(value)
```

- observeArray

```js
/**
   * Observe a list of Array items.
   */
  observeArray(items: Array < any > ) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
```
- observe 方法

返回一个观测对象实例

会检测传递进来的参数是否是 obj 对象，或者 虚拟dom，否则不做检测

```js
if (!isObject(value) || value instanceof VNode) {
    return
  }
```

接着检测 obj 是否具有 `__ob__` 属性，或者 `obj.__ob__` instanceof Observe 对象，也就是说已经存在 `__ob__`

```js
if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
} 
```

接着检测是否观测 shouldObserve，非服务端渲染，而且是数组，或者对象，是否是可扩展对象，非 Vue 实例。直接返回新的观测对象实例

```js
else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
```

# 对象处理

给对象的每个属性 key 重新定义属性
- walk 方法
```js
/**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
```

- defineReactive 方法

会先判断这个对象属性是否是可配置的,不可配置就直接返回

```js
const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
```
- Object.getOwnPropertyDescriptor

用于获取对象里面的属性 key 对应的描述符

预置 setter/getter

```js
// cater for pre-defined getter/setters
const getter = property && property.get
const setter = property && property.set
if ((!getter || setter) && arguments.length === 2) {
  val = obj[key]
}
```
是否进行深度观测

```js
let childOb = !shallow && observe(val)
```

设置 getter，进行依赖收集
```js
Object.defineProperty(obj, key, {
    enumerable: true, // 可枚举
    configurable: true, // 可配置
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend() // 进行依赖收集
        if (childOb) {
          childOb.dep.depend() // 多层依赖收集
          if (Array.isArray(value)) {
            dependArray(value) // 如果是数组
          }
        }
      }
      return value
    },)
```

数据变化，触发 set 方法，进行依赖更新

```js
set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
```

# Vue 源码解析 （十二）$set,$delete

我们先来看看一个简单得例子

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script src="../vue.js"></script>
    <div id="app"
         @once>
        <p @click="clickEvent">
            <keep-alive :max="1"
                        include="comp-a">
                <comp-a @hook:updated="hookUpdated"
                        msg="hello"
                        @hook:mounted="hookUpdated"></comp-a>
            </keep-alive>
        </p>
    </div>
    <script>
        const compA = {
                template: "<div @click='clickEvent'>我是compA{{msg}}</div>",
                props: {
                    msg: {
                        type: String,
                        default: 'msg'
                    },
                    _after: {
                        type: String
                    }
                },
                data() {
                    return {
                        obj: { name: "ken" },
                        arr: [1, 2]
                    }
                },
                methods: {
                    clickEvent: function(e) {
                        this.$set(this.obj, 'sex', '男')
                        this.$set(this.arr, 2, 3)
                    },
                }
            }
            const vm = new Vue({
                el: "#app",
                components: {
                    "comp-a": compA
                },
                methods: {
                    hookUpdated() {
                        console.log("hookUpdated")
                    },
                    clickEvent(e) {
                        console.log("clickEvent")
                    }
                },
            })

            console.log("vm", vm)
    </script>
</body>

</html>
```

当我们给 obj,arr 新增属性，或者元素时，我们调试发现会进入以下代码：

![image.png](http://image.huawei.com/tiny-lts/v1/images/d4de3609e9326acc9e13dd98068e3f27_1152x694.png@900-0-90-f.png)

- 先判断是否是 undefined, null, primitive value 
- 接着检测数组 如果对应地的 index 存在就直接赋值
- 接着检测对象 如果对应的 key 存在就直接返回
- 否则就是新增的 key,或者 index
- 需要对数据进行响应式定义
- 触发 dep 通知更新

```js
export function set(target: Array < any > | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

# $delete
- 先检测  undefined, null, or primitive value
- 接着检测数组 index 
- 接着检测对象 key
- 最后通知更新
```js
function del(target, key) {
    debugger
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }
```

# Vue 源码解析 （十三）$nextTick 源码分析

# flushCallbacks

用于处理回调函数调用方法
- 先拷贝了 callbacks.slice(0)
- callbacks.length = 0
- 循环调用 callback()

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```
//这里我们使用微任务异步延迟包装器。
//在2.5中，我们使用了（宏）任务（与微任务结合使用）。
//但是，当状态在重新上色之前更改时，它有微妙的问题
//（例如。#6813，出入转换）。
//另外，在事件处理程序中使用（宏）任务会导致一些奇怪的行为
//无法规避（例如。#7109, #7153, #7546, #7834, #8109）.
//所以我们现在在任何地方都使用微任务。
//这种权衡的一个主要缺点是存在一些场景
//其中微任务的优先级太高，并且可能在两者之间触发
//顺序事件（例如。#4521, #6690，有规避措施）
//甚至是同一事件的冒泡之间（ #6566 ）。


# 兼容 Promise

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
}
```

//nextTick行为利用微任务队列，可以访问
//通过本机承诺.then或Mutation观察者。
//Mutation观察者有更广泛的支持，但它被严重窃听
//iOS中的UIWebView>=9.3.3在触摸事件处理程序中触发。
//触发几次后完全停止工作...所以，如果是本地的
//承诺可用，我们将使用它：

# 兼容 MutationObserver

```js
else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
}
```

# 兼容 setImmediate

```js
else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
}
```

# 兼容 setTimeout

```js
else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

# nextTick

- 先把回调放进一个 callbacks 队列中
- 然后再集体进行宏任务或者微任务调用

```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

所以，从源码分析我们可以知道，为什么官网会有有两种方式：

![image.png](http://image.huawei.com/tiny-lts/v1/images/98045d0f15ed1bc594f1fd27c2b9d3e8_745x459.png@900-0-90-f.png)

- 一种给 nextTick(cb) 传递回调函数
- 一种是 不给 nextTick() 传递参数，里面默认是使用 Promise

# Vue 源码解析 （十四）源码中的工具方法

# 空对象

```js
const emptyObject = Object.freeze({})
```

# isUndef

检测 undefined,null

```js
function isUndef (v) {
  return v === undefined || v === null
}
```

# isDef

检测非 undefined,null

```js
function isDef (v) {
  return v !== undefined && v !== null
}
```

# isTrue

检测 true

```js
function isTrue (v) {
  return v === true
}
```

# isFalse

加测 false

```js
function isFalse (v) {
  return v === false
}
```

# isPrimitive

检测值是否为 primitive

```js
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

# toRawType

转成原始类型

```js
function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}
```

# isObject
检测是否是 object

```js
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
```

# _toString

```js
const _toString = Object.prototype.toString
```

# isPlainObject

```js
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}
```

# isRegExp

```js
function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}
```

# isValidArrayIndex

检测数组下标是否越界

```js
function isValidArrayIndex (val) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
```
# isPromise

检测是否是 Promise

```js
function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
```

# toString

```js
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}
```

# toNumber

```js
function toNumber (val) {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
```

# makeMap

```js
function makeMap (
  str,
  expectsLowerCase
) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}
```

# isBuiltInTag

```js
export const isBuiltInTag = makeMap('slot,component', true)
```

# isReservedAttribute
检查属性是否为保留属性
```js
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')
```

# remove

```js
function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

# hasOwn

```js
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}
```

# cached

```js
function cached(fn) {
  const cache = Object.create(null)
  return (function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  })
}

```

# camelize

将连字符分隔的字符串驼峰化

```js
const camelizeRE = /-(\w)/g
const camelize = cached((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})
```
# capitalize

```js
const capitalize = cached((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

```

# hyphenate
连字符连接驼峰案例字符串。

```js
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str) => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})
```

# 兼容 bind

```text
/**
*对于不支持它的环境，简单绑定聚填充，
*例如，PhantomJS 1.x。从技术上讲，我们不再需要这个了
*因为本机绑定现在在大多数浏览器中都足够性能。
*但删除它意味着破坏能够运行的代码
* PhantomJS 1.x，因此必须保留此选项，以实现向后兼容性。
*/
```

```js
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}
```

# nativeBind

原生存在 Bind

```js
function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}
```

# bind

```js
const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind
```

# toArray

```js
function toArray (list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
```

# extend

```js
function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
```

# toObject

```js
function toObject (arr) {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}
```

# Vue 源码解析 （十五）如何解析 props

我们先来看看官网给出的例子：

```js
props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
```

type 可以是下列原生构造函数中的一个：

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol

# validateProp

检测 props

处理 布尔值，空字符串等优先级问题
检测默认值是否存在

```js
const prop = propOptions[key]
  const absent = !hasOwn(propsData, key)
  let value = propsData[key]
  // boolean casting
  const booleanIndex = getTypeIndex(Boolean, prop.type)
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      const stringIndex = getTypeIndex(String, prop.type)
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true
      }
    }
  }
```

处理默认值数据响应式问题

```js
// check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldObserve = shouldObserve
    toggleObserving(true)
    observe(value)
    toggleObserving(prevShouldObserve)
  }
```

# getPropDefaultValue

获取 prop 属性默认值

- 如果不存在 default 默认值，则直接返回

```js
// no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
```

- 检测是否是对象，需要返回数组，对象工厂函数

```js
// warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    )
  }
```

- 处理 default 为函数类型

```js
// call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
```

# type 类型检测

```js
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/

function assertType (value, type){
  let valid
  const expectedType = getType(type)
  if (simpleCheckRE.test(expectedType)) {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value)
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value)
  } else {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}
```

# Vue 源码解析（十六）data 合并策略

从今天开始研究 Vue 中的合并策略

*选项覆盖策略是处理
*如何合并父选项值和子选项
*值转换为最终值

# mergeData

递归地将两个数据对象合并在一起的帮助程序

```js
function mergeData (to, from) {
	// 如果 from 不存在，直接返回 to
  if (!from) return to
  let key, toVal, fromVal
	// 兼容判断，如果存在 Reflect.ownKeys 直接使用
   // 否则直接只用 Object.keys
  const keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    if (key === '__ob__') continue
    // 跳过 __ob__ key
    // 获取 to[key] 的值
    toVal = to[key]
    // 获取 from[key] 的值
    fromVal = from[key]
    if (!hasOwn(to, key)) {
    	// 设置新 key,value,同时触发更新操作
      set(to, key, fromVal)
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
    	// 如果还是对象，继续进行合并操作
      mergeData(toVal, fromVal)
    }
  }
  return to
}
```

# mergeDataFn

//当父级和子级都存在时，
//我们需要返回一个函数，该函数返回
//两个函数的合并结果...不需要
//检查父Val是否为这里的函数，因为
//它必须是一个函数来传递以前的合并。

```js
function mergeDataOrFn (parentVal, childVal, vm){
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // 合并 dataFn
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
```
从上面源码上看，区分两种情况
- 一种是子类，子组件中的 data，必须是一个 function

这里会执行 mergeDataFn 函数，值得注意的时候 mergeDataFn 里面返回的是 mergeData 函数

所以你就知道为什么官网提示我们使用函数返回 data了：

```js
Vue.extend({
	name: 'extend',
   data: function() {
   		return {}
   }
})
```

因为对象是引用类型的，为了使得每一个 data 不一样，所以使用函数返回的方式，来为 data 创建不同的内存。

## mergeData 为什么不在初始化的时候就合并好, 而是在调用的时候进行合并?

inject 和 props 这两个选项的初始化是先于 data 选项的，就保证了能够使用 props 初始化 data 中的数据.

- 一种是根实例中的 data

如果是根实例，就使用 mergedInstanceDataFn，同样 mergedInstanceDataFn 函数也是返回 mergeData 函数

但是有一个可能是只有一个根实例，所以对根实例的 data 没有严格的要求，既可以使用 函数的形式返回，也可以使用对象的形式：

```js
new Vue({
	data() {
   		return {} 
   }
})

new Vue({
	data: {}
})
```

所以你会看到合并策略中，会检测子类的data是不是函数，不是函数就会报错

```js
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
```

我们来看看例子：

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script src="../vue.js"></script>
    <div id="app"
         @once>
        <p @click="clickEvent">
            <keep-alive :max="1"
                        include="comp-a">
                <comp-a @hook:updated="hookUpdated"
                        msg="hello"
                        @hook:mounted="hookUpdated"></comp-a>
            </keep-alive>
        </p>
        <p>
            {{ken}}
        </p>
    </div>
    <script>
        const compA = {
                template: "<div @click='clickEvent'>我是compA{{msg}}</div>",
                props: {
                    msg: {
                        type: String,
                        default: 'msg'
                    },
                    _after: {
                        type: String
                    }
                },
                data() {
                    return {
                        obj: { name: "ken" },
                        arr: [1, 2]
                    }
                },
                methods: {
                    clickEvent: function(e) {
                        this.$delete(this.obj, "name")
                    },
                }
            }
            const vm = new Vue({
                el: "#app",
                components: {
                    "comp-a": compA
                },
                data: {
                    ken: 'data 对象'
                },
            })

            console.log("vm", vm)
    </script>
</body>

</html>
```
我们可以看到没有报错

![image.png](http://image.huawei.com/tiny-lts/v1/images/10d9dd464d1daff7bd2cc88acd9c5a45_1909x535.png@900-0-90-f.png)




