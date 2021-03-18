# Vue 源码解析 （二十）props,methods,inject,computed 合并

```js
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  // 如果 parentVal 没有值，直接返回 childVal
  if (!parentVal) return childVal
  const ret = Object.create(null)
  // 否则，合并 parentVal 到 ret
  // 如果 childVal 存在，合并 childVal 到 ret
  // 说明是直接让 childVal 覆盖到 parentVal 
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
```
