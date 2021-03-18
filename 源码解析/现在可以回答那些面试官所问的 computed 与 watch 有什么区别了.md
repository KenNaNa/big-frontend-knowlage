# 现在可以回答那些面试官所问的 computed 与 watch 有什么区别了

computed

```js
new Vue({
	computed: {
   		getTest(){} 
   }
})
```

computed 内部会先判断是否需要缓存，如果需要缓存就会执行`createComputedGetter`, 会从 `this._computedWatchers` 里面取得值：

```js
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```

不需要缓存的时候，则调用 `createGetterInvoker`：

```js
function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this)
  }
}
```

computed 是有两种实现方式：
- 一种是方法
- 一种是对象

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
```

所以在 `initComputed` 方法中做了处理：

```js
const userDef = computed[key]
const getter = typeof userDef === 'function' ? userDef : userDef.get
```

# watch


```js
new Vue({
	watch: {
   		getTest(){} 
   }
})

new Vue({
	watch: {
   		getTest: {
      		handler(){},
          deep: true,
          immediate: false
      }
   }
})

new Vue({
	watch: []
})
```

watch 是直接 createWatcher 

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
