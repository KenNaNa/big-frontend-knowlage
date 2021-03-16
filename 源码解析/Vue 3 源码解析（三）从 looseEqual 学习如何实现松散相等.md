# Vue 3 源码解析（三）从 looseEqual 学习如何实现松散相等

### isArray

验证数组

```js
export const isArray = Array.isArray
```

### isDate

验证日期

```js
export const isDate = (val) => val instanceof Date
```

### isObject

验证对象

```js
export const isObject = (val) => val !== null && typeof val === 'object'
```

### looseEqual

松散相等的方法实现

```js
function looseEqual(a, b) {
  // a,b 全等直接返回 true
  if (a === b) return true
  // 判断是否是日期类型
  let aValidType = isDate(a)
  let bValidType = isDate(b)
  if (aValidType || bValidType) {
    // 使用 getTime() 对比
    return aValidType && bValidType ? a.getTime() === b.getTime() : false
  }
  aValidType = isArray(a)
  bValidType = isArray(b)
  if (aValidType || bValidType) {
  	  // 数组类型
    return aValidType && bValidType ? looseCompareArrays(a, b) : false
  }
  aValidType = isObject(a)
  bValidType = isObject(b)
  if (aValidType || bValidType) {
    /* istanbul ignore if: this if will probably never be called */
    if (!aValidType || !bValidType) {
      return false
    }
    // 先判断 keys 的长度
    const aKeysCount = Object.keys(a).length
    const bKeysCount = Object.keys(b).length
    if (aKeysCount !== bKeysCount) {
      return false
    }
    // 再逐个属性判断
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key)
      const bHasKey = b.hasOwnProperty(key)
      if (
        (aHasKey && !bHasKey) ||
        (!aHasKey && bHasKey) ||
        !looseEqual(a[key], b[key])
      ) {
        return false
      }
    }
  }
  return String(a) === String(b)
}
```

### looseCompareArrays

松散的对比数组

```js
function looseCompareArrays(a: any[], b: any[]) {
  // 比较数组长度
  if (a.length !== b.length) return false
  let equal = true
  for (let i = 0; equal && i < a.length; i++) {
    // 比较每一个的值是否是相等的
    equal = looseEqual(a[i], b[i])
  }
  return equal
}
```

### looseIndexOf

```js
export function looseIndexOf(arr: any[], val: any): number {
  return arr.findIndex(item => looseEqual(item, val))
}
```
