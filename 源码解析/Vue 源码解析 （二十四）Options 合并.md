# Vue 源码解析 （二十四）Options 合并

```js
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    // 检测子类的组件的名称
    checkComponents(child)
  }

  if (typeof child === 'function') {
    // 如果是子类，获取 child.options
    child = child.options
  }
  // 规范化 props
  normalizeProps(child, vm)
  // 规范化 inject
  normalizeInject(child, vm)
  // 规范化 指令
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  // 使用 Vue.extend() 扩展子类的
  // 将子类合并到 parent 上，用子类覆盖 parent
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    // 使用 mixins 混入的
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

