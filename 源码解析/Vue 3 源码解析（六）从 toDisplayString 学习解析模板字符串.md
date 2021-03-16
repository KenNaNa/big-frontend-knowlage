### isArray

检测数组

```js
export const isArray = Array.isArray
```

### toTypeString

```js
export const objectToString = Object.prototype.toString
export const toTypeString = (value) => objectToString.call(value)
```

### isMap

检测 Map

```js
export const isMap = (val) => toTypeString(val) === '[object Map]'
```

### isSet

检测 Set

```js
export const isSet = (val) => toTypeString(val) === '[object Set]'
```

### isObject

检测对象

```js
export const isObject = (val) => val !== null && typeof val === 'object'
```

### isPlainObject

```js
export const isPlainObject = (val) => toTypeString(val) === '[object Object]'
```

### toDisplayString

解析模板字符串

```js
export const toDisplayString = (val) => {
  return val == null
    ? ''
    : isObject(val) 
      ? JSON.stringify(val, replacer, 2)
      : String(val)
}
```

### replacer

```js
const replacer = (_key, val) => {
  if (isMap(val)) {
    // 判断是否是 Map
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
        ;(entries)[`${key} =>`] = val
        return entries
      }, {})
    }
  } else if (isSet(val)) {
    // 判断是否是 Set
    return {
      [`Set(${val.size})`]: [...val.values()]
    }
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    // 原生数组，对象
    return String(val)
  }
  return val
}
```


