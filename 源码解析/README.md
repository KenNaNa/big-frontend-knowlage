# 源码解析

### [varable.define](./varable.define.md)
### [shallowProperty](./shallowProperty.md)
### [root.global.object](./root.global.object.md)
### [restArguments](./restArguments.md)
### [reduce](./reduce.md)
### [random](./random.md)
### [optimizeCb](./optimizeCb.md)
### [now](./now.md)
### [map](./map.md)
### [isUndefined.judge](./isUndefined.judge.md)
### [isSymbol.judge](./isSymbol.judge.md)
### [isObject.judge](./isObject.judge.md)
### [isNumberic](./isNumberic.md)
### [isNull.judge](./isNull.judge.md)
### [isNaN.judge](./isNaN.judge.md)
### [isFinite.judge](./isFinite.judge.md)
### [isArrayLike](./isArrayLike.md)
### [inheritsObj2](./inheritsObj2.md)
### [inheritsObj](./inheritsObj.md)
### [hasOwnProperty](./hasOwnProperty.md)
### [find](./find.md)
### [filter](./filter.md)
### [element.judge](./element.judge.md)
### [each](./each.md)
### [deepGet](./deepGet.md)
### [closure](./closure.md)
### [closure2](./closure2.md)
### [cd](./cd.md)
### [array.judge](./array.judge.md)


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

# 基本类型对应的内置对象，以及他们之间的装箱拆箱操作

- String
- Number
- Boolean
- Object
- Date
- RegExp

装箱

```js
var str = new String("小仙女")
var str1 = str.substr(0)
str = null // 销毁
```

拆箱

```js
var str = new String("小仙女")
str.valueOf()
str.toString()
```

# JavaScript变量在内存中的具体存储形式

JavaScript 有两种值类型
- 基本类型
- 引用类型

基本类型存在 栈内存中

引用类型在 栈内存中存放地址指向堆内存的对象

![image.png](http://image.huawei.com/tiny-lts/v1/images/9c744c45cc4d5db1dac0d3876ca18524_648x281.png@900-0-90-f.png)

# JavaScript规定了几种语言类型

# undefined

- 函数默认返回值

```js
function ret() {
	// 默认是返回 undefined
}
```

- 获取对象不存在的 key

```js
var obj = {}
obj.name
```
- 获取数组不存在的下标

```js
var aa = []

aa[0] undefined
```

- 声明变量，不初始化值
```js
var foo;
```

# null

null 表示的是：“定义了但是为空”。所以，在实际编程时，我们一般不会把变量赋值为 undefined，这样可以保证所有值为 undefined 的变量，都是从未赋值的自然状态。

Null 类型也只有一个值，就是 null，它的语义表示空值，与 undefined 不同，null 是 JavaScript 关键字，所以在任何代码中，你都可以放心用 null 关键字来获取 null 值。

# Boolean

true/false

# number

有一个经典的问题，是 0.1 + 0.2 != 0.3。如何解决精度问题

我们可以这样实现，

- 获取小数点后面的位数
- 然后取最大的位数
- 进行重新计算

```js
function formatFloat (num1, num2) {
        var baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    };
console.log(formatFloat(0.1,0.2))
```

# string

# Symbol
Symbol 是 ES6 中引入的新类型，它是一切非字符串的对象 key 的集合，在 ES6 规范中，整个对象系统被用 Symbol 重塑。

Symbol 可以具有字符串类型的描述，但是即使描述相同，Symbol 也不相等。

创建 Symbol 的方式是使用全局的 Symbol 函数。例如：
```js
 var mySymbol = Symbol("my symbol");
```








