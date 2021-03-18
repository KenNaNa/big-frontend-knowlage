# Vue 源码解析 （十九）watch 合并

```js
// 兼容 firefox 浏览器
export const nativeWatch = ({}).watch

strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /* istanbul ignore if */
  // 如果 childVal 不存在，直接返回 parentVal
  if (!childVal) return Object.create(parentVal || null)
  // 进行告警
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  // 如果 parentVal 不存在，直接返回 childVal
  if (!parentVal) return childVal
  // 否则将 parentVal 合并到 ret
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
  	  // 拿到 parent, child
    let parent = ret[key]
    const child = childVal[key]
    // parent 不是数组，就将其改为数组
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}
```

可以看出是有优先级的，先是将父级的 watch 队列添加子级的 watch
