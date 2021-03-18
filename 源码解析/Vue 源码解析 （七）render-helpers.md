# Vue 源码解析 （七）render-helpers

# bind-dynamic-keys

```html
 <div id="app" :[key]="value">
```
会被编译成这样的代码

```js
 _c('div', { attrs: bindDynamicKeys({ "id": "app" }, [key, value]) })
```

函数中是这样处理的

```js
baseObj[values[i]] = values[i + 1]
```

# bindObjectListeners

实例：

```js
{
	on: {
   		click: function(e) {} 
   }
}
```

合并已经存在的 on 对象里面的 listeners 和自定义的 listener

```js
const on = data.on = data.on ? extend({}, data.on) : {}
for (const key in value) {
  const existing = on[key]
  const ours = value[key]
  on[key] = existing ? [].concat(existing, ours) : ours
}
```

# bind-object-props

合并例如：v-bind="object" 进入 vnode data

```js
	// 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
```

- 处理 style
- 处理 class
- 处理 attrs
- 处理 domProps

# render-list

用于处理 v-for

- 处理数组，字符串

```js
<div v-for="(item, index) in arr"></div>
<div v-for="(item, index) in str"></div>
```
- 处理数字

```js
<div v-for="(item, index) in num"></div>
```

- 处理对象

```js
<div v-for="(item, index) of obj"></div>
```

- 处理迭代对象

```js
const range = {
	[Symbol.iterator]() {
   		// 实现迭代对象 
   }
}
```

源代码如下：

```js
if (hasSymbol && val[Symbol.iterator]) {
      ret = []
      const iterator: Iterator<any> = val[Symbol.iterator]()
      let result = iterator.next()
      while (!result.done) {
        ret.push(render(result.value, ret.length))
        result = iterator.next()
      }
    }
```

# render-slot

用于渲染 render `<slot>`

```js
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
```

# render-static 用于渲染静态节点

```js
function markStaticNode (node, key, isOnce) {
  node.isStatic = true
  node.key = key
  node.isOnce = isOnce
}
```

# resolve-filter

```js
/**
 * Runtime helper for resolving filters
 */
export function resolveFilter (id: string): Function {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}
```

# resolve-scoped-slots
```html
<template scoped-slot="">
```

# resolve-slots

```html
<slot></slot>
<template v-slot=""></template>
```
