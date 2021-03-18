# Vue 源码解析 （一）初始化流程

最近疯狂的查看 Vue 源码，疯狂的调试代码，于是乎就有了这篇 Vue 初始化流程的文章出现，辛苦我了，今天我要去吃点好吃的，奖励以下自己，

```js
<script src="../vue.js"></script>
   <div id="app"></div>
<script>
   const vm = new Vue({
      el: '#app'
   })
   console.log(vm)
</script>
```

我们把 debugger 断点打在如图这里


我们可以看到此时的 `$data`, `$props` 都为 `undefined`

```js
$data: undefined
$isServer: false
$props: undefined
$ssrContext: undefined
```
接着往下走 debugger 

此时我们发现 `vm` 开始出现 `_uid`，这个用于计算 `Vue` 被 `new` 过多少次


走到这一步 vm 开始出现 `_isVue` 属性，用来避免被 `observed`

# options 合并策略

首先是处理内部的组件，像 keep-alive, router-link, router-view,自定义 这样的组件。

- 通过 `_isComponent` 来判断 (initInternalComponent)

- 合并 vm.constructor 的 options (resolveConstructorOptions, merge)

- 此时 vm 才有了 $options

- $options 里面有：

```js
components: {}
directives: {}
el: "#app"
filters: {}
```


# initProxy

用于初始化代理数据，此时 vm 会出现一个叫做 `_renderProxy`：


```js
renderProxy: Proxy
```

# initLifecycle

初始化生命周期函数

此时 vm 出现以下内容：

```js
$children: []
$parent: undefined
$refs: {}
$root: {}
_directInactive: false
_inactive: null
_isBeingDestroyed: false
_isDestroyed: false
_isMounted: false
```

# initEvents
初始化事件，此时 vm 出现 `_events`

```js
_events: {}
```

# initRender

初始化渲染， 此时 vm 出现:

```js
$scopedSlots: {}
$slots: {}
$vnode: undefined
```
# callHook(vm,'beforeCreate')

初始化 beforeCreate 生命周期

# initInjections

初始化注入内容

# initState

初始化 state, 此时注意观察，我们发现 data 此时有了数据，el 还没有元素

# initProvide

初始化提供

# callHook(vm, 'created')

调用 created 生命周期函数，此时 $data 有数据， $el 没有元素

# 挂载元素

当执行了以下代码的时候，才是真正意义上挂载 DOM 元素，此时 vm 出现了 $el 元素

```js
if (vm.$options.el) {
   vm.$mount(vm.$options.el);
}
```
