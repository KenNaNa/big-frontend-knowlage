# Vue 源码解析 （十七）hooks,props 合并

```js
// Vue 中的生命周期放在一个数组里
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
]
// 合并生命钩子 hook  
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
	// parentVal 是个数组
   // 将 res 处理成数组
  const res = childVal // 有可能是数组，或者单个函数
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
  // 找到之前没有的 hooks 
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
```

从上面的合并来看，我们知道生命周期钩子有两种形式

- 一种是单个函数形式

```js
new Vue({
	created: function(){}
})
```

- 一种是函数数组形式

```js
new Vue({
	created: [
   		function fn1(){},
      function fn2(){}
   ]
})
```
