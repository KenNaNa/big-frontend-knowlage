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
