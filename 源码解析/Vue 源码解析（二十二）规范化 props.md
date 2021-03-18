# Vue 源码解析（二十二）规范化 props

```js
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props // 拿到 props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
  	  // 如果 props 是数组，必须使用字符串的形式
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    // 对象的形式
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}
```

- 数组的形式

```js
Vue.component('props-demo-simple', {
  props: ['size', 'myMessage']
})
```

- 对象的形式

```js
// 对象语法，提供验证
Vue.component('props-demo-advanced', {
  props: {
    // 检测类型
    height: Number,
    // 检测类型 + 其他验证
    age: {
      type: Number,
      default: 0,
      required: true,
      validator: function (value) {
        return value >= 0
      }
    }
  }
})
```
