# Vue 源码解析（十六）data 合并策略

从今天开始研究 Vue 中的合并策略

*选项覆盖策略是处理
*如何合并父选项值和子选项
*值转换为最终值

# mergeData

递归地将两个数据对象合并在一起的帮助程序

```js
function mergeData (to, from) {
	// 如果 from 不存在，直接返回 to
  if (!from) return to
  let key, toVal, fromVal
	// 兼容判断，如果存在 Reflect.ownKeys 直接使用
   // 否则直接只用 Object.keys
  const keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    if (key === '__ob__') continue
    // 跳过 __ob__ key
    // 获取 to[key] 的值
    toVal = to[key]
    // 获取 from[key] 的值
    fromVal = from[key]
    if (!hasOwn(to, key)) {
    	// 设置新 key,value,同时触发更新操作
      set(to, key, fromVal)
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
    	// 如果还是对象，继续进行合并操作
      mergeData(toVal, fromVal)
    }
  }
  return to
}
```

# mergeDataFn

//当父级和子级都存在时，
//我们需要返回一个函数，该函数返回
//两个函数的合并结果...不需要
//检查父Val是否为这里的函数，因为
//它必须是一个函数来传递以前的合并。

```js
function mergeDataOrFn (parentVal, childVal, vm){
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // 合并 dataFn
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
```
从上面源码上看，区分两种情况
- 一种是子类，子组件中的 data，必须是一个 function

这里会执行 mergeDataFn 函数，值得注意的时候 mergeDataFn 里面返回的是 mergeData 函数

所以你就知道为什么官网提示我们使用函数返回 data了：

```js
Vue.extend({
	name: 'extend',
   data: function() {
   		return {}
   }
})
```

因为对象是引用类型的，为了使得每一个 data 不一样，所以使用函数返回的方式，来为 data 创建不同的内存。

## mergeData 为什么不在初始化的时候就合并好, 而是在调用的时候进行合并?

inject 和 props 这两个选项的初始化是先于 data 选项的，就保证了能够使用 props 初始化 data 中的数据.

- 一种是根实例中的 data

如果是根实例，就使用 mergedInstanceDataFn，同样 mergedInstanceDataFn 函数也是返回 mergeData 函数

但是有一个可能是只有一个根实例，所以对根实例的 data 没有严格的要求，既可以使用 函数的形式返回，也可以使用对象的形式：

```js
new Vue({
	data() {
   		return {} 
   }
})

new Vue({
	data: {}
})
```

所以你会看到合并策略中，会检测子类的data是不是函数，不是函数就会报错

```js
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
```

我们来看看例子：

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script src="../vue.js"></script>
    <div id="app"
         @once>
        <p @click="clickEvent">
            <keep-alive :max="1"
                        include="comp-a">
                <comp-a @hook:updated="hookUpdated"
                        msg="hello"
                        @hook:mounted="hookUpdated"></comp-a>
            </keep-alive>
        </p>
        <p>
            {{ken}}
        </p>
    </div>
    <script>
        const compA = {
                template: "<div @click='clickEvent'>我是compA{{msg}}</div>",
                props: {
                    msg: {
                        type: String,
                        default: 'msg'
                    },
                    _after: {
                        type: String
                    }
                },
                data() {
                    return {
                        obj: { name: "ken" },
                        arr: [1, 2]
                    }
                },
                methods: {
                    clickEvent: function(e) {
                        this.$delete(this.obj, "name")
                    },
                }
            }
            const vm = new Vue({
                el: "#app",
                components: {
                    "comp-a": compA
                },
                data: {
                    ken: 'data 对象'
                },
            })

            console.log("vm", vm)
    </script>
</body>

</html>
```
