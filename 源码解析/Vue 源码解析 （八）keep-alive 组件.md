# Vue 源码解析 （八）keep-alive 组件


今天我们就来说说关于抽象组件 keep-alive 的官方文档：

### Props：

- include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
- exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
- max - 数字。最多可以缓存多少组件实例。
用法：

`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 `<transition>` 相似，`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

当组件在 `<keep-alive>` 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

# 注意

keep-alive 组件 include, exclude 属性：
- 字符串，以逗号为分隔符
- 正则表达式
- 数组的形式

```js
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```

所以我们第一个要讲的就是处理以上三种形式的方法

# matches

- 处理数组
- 处理字符串
- 处理正则
- 返回布尔值
```js
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
```


# 抽象组件如下：

会有一个标志
abstract：true


```js
name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
```

看个例子：

```js
<keep-alive :max="1" include="comp-a">
	<comp-a @hook:updated="hookUpdated"
      msg="hello"
      @hook:mounted="hookUpdated"></comp-a>
</keep-alive>
```

经过调试的过程

![image.png](http://image.huawei.com/tiny-lts/v1/images/8b0b94aad8a047b9232c431840c368ff_1858x577.png@900-0-90-f.png)


# pruneCache

- 参数有 cache: key 对应的 _vnode
- keys 缓存的 keys
- _vnode 虚拟元素

清除缓存

```js
function pruneCache (keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
```
