# HTML 各大重要知识点

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

# Vue 源码解析 （十八）assets 合并

*当vm存在时（实例创建），我们需要执行
*构造函数选项之间的三向合并，实例
*选项和父选项。

```js
// 三个属性，组件，指令，过滤
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
// 用于类型检测
// 本来组件里面的 value 属性设置的是 Object
// 给他传来其他类型的
// 报错
function assertObjectType (name: string, value: any, vm: ?Component) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}
// 直接将子的合并父的，相同的会覆盖父的
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  // 检测 childVal
  // 将 childVal 合并到 res
  // 否则直接返回 res
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
```

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

# Vue 源码解析 （二十一）检测组件名称

```js
// 检测组件名称是否合法
function checkComponents (options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}
// 
export function validateComponentName (name: string) {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
  // 检测组件名字是否合法
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }
  // 检测是否是内建标签，或者是内部保留标签
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}
```

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

# Vue 源码解析 （二十三）规范化 inject

```js
/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options: Object, vm: ?Component) {
  const inject = options.inject
  if (!inject) return
  const normalized = options.inject = {}
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
    	// 如果是数组的形式，也是格式化成对象的形势
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}
```

- 数组的形式

```js
const Child = {
  inject: ['foo'],
  data () {
    return {
      bar: this.foo
    }
  }
}
```

- 对象的形式

```js
const Child = {
  inject: {
    foo: {
      from: 'bar',
      default: () => [1, 2, 3]
    }
  }
}
```

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

