# Vue 源码解析 （十一）Observe 源码分析


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
