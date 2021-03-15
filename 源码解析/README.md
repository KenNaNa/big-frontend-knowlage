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

# 如何实现 MVVM 类 Vue 迷你框架（一）

MVVM 框架的三大要素：
- 数据响应式
 	- 使用 Object.defineProperty 属性
   - 使用 ES6 Proxy 
   - 监听数据变化，更新到视图上
- 模板插值
  - 提供模板语法与数据绑定
  - 插值：{{ }}
  - 指令：v-bind,v-model 等等。
- 模板渲染
	- 如果将模板转成 html
   - 将实际数据替换到模板插值中
   - 渲染
 	- 模板-> vdom -> real dom
    
# 初体验响应式

```js
function defineReactive(obj, key, value) {
	Object.defineProperty(obj, key, {
   		get() {
      		// 获取数据
         return obj[key]
      },
      set(newValue) {
      		// 设置数据
         if(value !== newValue) {
         	value = newValue
         }
      }
   })
}
```

测试一下数据是否被真的拦截

```js
const obj = {};
defineReactive(obj, 'name', 'ken');
obj.foo; // name
obj.foo = 'KenNaNa'; // KenNaNa
```

![image.png](http://image.huawei.com/tiny-lts/v1/images/3b4dbcbd951d9875fcc454447c93c239_1080x737.png@900-0-90-f.png)


# 如何实现 MVVM 类 Vue 迷你框架（二）

![image.png](http://image.huawei.com/tiny-lts/v1/images/eac303ef8f65147f913981c80a0683ed_900x614.png@900-0-90-f.png)

- MVue 基础类
- 通过 Observe 类对数据进行响应式处理
- 数据被 get 的时候通过 Dep 收集对应数据的依赖 watcher
- 数据被 set 的时候通过 Dep 通知对应的数据的依赖 watcher 进行数据更新操作
- 最后是数据编译，将模板转成 vdom 最后转成 realdom

# 实现 MVue 基础类

- 第一步需要拿到外部传递进来的 options, data

```js
class MVue {
	constructor(options) {
   		this.$options = options;
      this.$data = options.data();
   }
}
```

- 第二部代理这些数据到 MVue 实例上面

那么如何代理呢？需要拿到 MVue 实例的 data, 将属性代理到 MVue 实例上
检测数据变化重新更新到 MVue 实例上。

```js
function proxy(vm) {
	Object.keys(vm.$data).forEach(key => {
  		Object.defineProperty(vm, key, {
     		get() {
         	return vm.$data[key]	   
         },
         set(val) {
         	vm.$data[key] = val
         }
     })  
  })
}
```

然后再在 MVue 类加上以下代码：

```js
class MVue {
	constructor(options) {
   	this.$options = options;
   	this.$data = options.data();
   	proxy(this)
	}
}
```

测试代码

```js
let vm = new MVue({
	data: function(){
   		return {
      		msg: "MVue"  
      } 
   }
})

console.log(vm)
```
![image.png](http://image.huawei.com/tiny-lts/v1/images/97bac13ca751208738ed874ae4b4fe68_512x683.png@900-0-90-f.png)

# 如何实现 MVVM 类 Vue 迷你框架（三）

![image.png](http://image.huawei.com/tiny-lts/v1/images/eac303ef8f65147f913981c80a0683ed_900x614.png@900-0-90-f.png)

接下来我们需要在上节课的基础上，对数据进行响应式处理，大致的框架代码如下：

```js
class MVue {
	constructor(options) {
   		this.$options = optinos;
      this.$data = options.data();
      
      // 数据代理
      proxy(this)
      
      // 对 data 数据进行响应式处理
      observe(this.$data)
   }
}
```


- 定义一个方法

```js
function defineReactive(obj, key, val) {
	let curVal = val; // 缓存上一次的值
   Object.defineProperty(obj, key, {
   		get() {
          // 需要进行依赖收集
      		return curVal;  
      },
      set(newVal) {
      		if(newVal !== curVal) {
         	curVal = newVal;
           // 当值发生变化的时候，需要做通知数据更新操作
         }
      }
   })
}
```

那么如何来实现我们 Observer 类呢，他到底处理什么呢？
- 遍历 data 数据，给数据属性挨个设置 setter, getter 属性
- 需要分别处理 数组和对象

```js
class Observer {
	constructor(val) {
   		this.$value = val;
      if(Array.isArray(val)) {
      		// 处理数组
      } else {
      		// 处理对象
         // 需要写一个方法遍历
         this.walk(val)
      }
   }
   // 遍历对象，响应式对象
   walk(obj) {
   		Object.keys(key => defineReactive(obj, key, obj[key]))
   }
}
```


# 如何实现 MVVM 类 Vue 迷你框架（四）

![image.png](http://image.huawei.com/tiny-lts/v1/images/eac303ef8f65147f913981c80a0683ed_900x614.png@900-0-90-f.png)

接下来我们需要做什么处理呢？
- 数据 getter 的时候将数据添加 watcher 监听
- 数据 setter 的时候，通知 watcher 更新

那么我们需要一个 Dep 类：
- 需要一个用于添加 watcher 实例
- 需要一个用于通知 watcher 实例更新

```js
class Dep {
	constructor() {
   		this.deps = [] 
   }
   addDep(watcher) {
   		this.deps.push(watcher);
   }
   notify() {
   		this.deps.forEach(watcher => watcher.update());
   }
}
```
所以我们还需要一个 watcher 类

- 这个类就是用来更新数据的

```js
class Watcher {
	constructor(vm, key, updater) {
   		// 需要更新到那个 vm 对象上
      // 对应是那个 key
      this.$vm = vm
      this.$key = key
      this.$updater = updater
      
      Dep.target = this // 将当前实例指定到 Dep 的静态属性上
      vm[key]; // 初始化读取一下出发 getter
      Dep.target = null // 置空
   }
   // 未来用于更新 DOM 的函数， 由 Dep 通知调用
   update() {
   		this.$updater.call(this.$vm, this.$vm[this.$key]);
   }
}
```

那么我们在哪里使用这个依赖收集，以及触发数据更新呢
- 在响应式处理,get 数据的时候，对其进行依赖收集
- 在响应式处理，set 数据的时候，对其进行数据更新

```js
function defineReactive(obj, key, val) {
	// 初始化响应式数据
   observe(val);
	const dep = new Dep(); // 每个 key 对应创建一个 Dep 实例
   let curVal = val;
   Oject.defineProperty(obj, key, {
   		get() {
         // 建立 watcher 与 dep 的映射
      		Dep.target && dep.addDep(Dep.target);   
         return curVal
      }
      set(newVal) {
      		if(newVal !== curVal) {
         		observe(newVal); // 设置响应式
             curVal = newVal; // 重新赋值
             dep.notify(); // 通知更新
         }
      }
   })
}
```

# 如何实现 MVVM 类 Vue 迷你框架（五）

![image.png](http://image.huawei.com/tiny-lts/v1/images/eac303ef8f65147f913981c80a0683ed_900x614.png@900-0-90-f.png)

上面几节课我们已经把数据代理，响应式处理搞完了，接下来需要做什么呢？
当然是最难的一部分了，就是我们的编译模板。

![image.png](http://image.huawei.com/tiny-lts/v1/images/6b417a492284b9af5838d4b47b67f657_900x391.png@900-0-90-f.png)

使用到的dom编程方法

- element.childNodes - 返回元素子节点的 NodeList（可直接使用forEach遍历），换行和空格会被识别成文本节点。
- element.nodeType - 返回元素的节点类型，元素节点为 1，文本节点为 3
- element.nodeName - 返回元素的名称，例如**“DIV”**
- element.textContent - 设置或返回节点及其后代的文本内容
- element.attributes - 指定节点的属性Attr（含有name和value属性）合 NamedNodeMap（不可直接遍历）

我们需要做什么呢？

- 拿到我们需要的 DOM 元素
- 然后需要解析 `{{}}` 模板插值
- 解析 `m-text` 指令
- 解析 `m-html` 指令

所以我们需要一个编译模板 Compile 类：

```js
class Compile {
	constructor(el, vm) {
   		this.$el = document.querySelector(el);
      this.$vm = vm;
		 // 判断是否存在 el
      if(this.$el) {
      		this.compile(this.$el);
      }
   }
}
```

判断节点是不是具有 `{{}}` 文本节点

```js
class Compile {
	constructor{
   		// ...
   }
   isInter(node) {
   		return node.nodeType === 3 && /{{.*}}/.test(node.textContent);
   }
}
```

接下来我们封装一个用于更新指令的公用方法：

```js
update(node, key, dir) {
	const fn = this[dir+'Updater']; // 查找指令方法
   fn && fn(node, this.$vm[key];
   
   // 更新
   new Watcher(this.$vm, key, val => {
   		fn && fn(node, key)
   })
}
```

如果是文本内容我们就只更新文本：

```js
textUpdater(node, val) {
	node.textContent = val
}

text(node, key) {
	this.update(node, key, 'text')
}
```

如果是 html 内容就只更新 htm 内容：

```js
htmlUpdater(node, val) {
	node.innerHTML = val
}

html(node, key) {
	this.update(node, key, 'html');
}
```

模板插值解析：

```js
compileText(node) {
	this.update(node, RegExp.$1, 'text')
}
```

最后就是实现 compile(node) 方法：

```js
// 递归传入节点，根据节点类型做不同操作
    compile(el) {
        // 拿到子节点
        const childNodes = el.childNodes;
        childNodes.forEach(node => {
            if (node.nodeType === 1) {
                console.log('元素节点', node.nodeName);
            } else if (this.isInter(node)) {
                this.compileText(node);
                console.log('文本节点', node.textContent);
            }

            if (node.childNodes) {
                this.compile(node);
            }
        });
    }
```

# 如何实现 MVVM 类 Vue 迷你框架（六）

![image.png](http://image.huawei.com/tiny-lts/v1/images/eac303ef8f65147f913981c80a0683ed_900x614.png@900-0-90-f.png)

我们先来讲讲怎么处理 model 以及事件：

- model 处理跟 text,html 处理相似
- 事件处理需要找到 `@` 属性的事件，给对应的节点添加事件监听器

```js
// 节点元素编译
class Compile {
	compileElement(node) {
   		const nodeAttrs = Array.from(node.attributes);
      nodeAttrs.forEach(attr => {
      		const {name, value} = attr;
         // 指令处理
         if(name.startWith('m-')) {
         	const dir = this[name.slice(2)]; // 找出指令方法
          	dir && dir(node, value);
         }
         // 事件处理
         if(name.startWith('@')) {
         	// 找出开头是 @
           const dir = name.slice(1);
           // 事件监听
           this.eventHandler(node, value, dir);
         }
      })
   }
   // 绑定监听器
   eventHandler(node,value,dir) {
   		const { methods } = this.$vm.$options;
      const fn = methods && methods[value];
      fn && node.addEventListener(dir, fn.bind(this.$vm));
   }
}
```

解析 model

```js
modelUpdater(node, val) {
	node.value = val;
}


model(node, key) {
	this.update(node, key, 'model');
   node.addEventListener('input', e=>{
   		this.$vm[key] = e.target.value;
   })
}
```

# 如何实现 MVVM 类 Vue 迷你框架（七）

![image.png](http://image.huawei.com/tiny-lts/v1/images/eac303ef8f65147f913981c80a0683ed_900x614.png@900-0-90-f.png)

还有一件事件我们忘记处理，就是对数组的处理，Vue 内部处理一些数组方法，例如：push,pop,reverse,shift,unshift,sort,splice

- 找到原型上的方法
- 拷贝新的原型
- 在新的原型上对这些方法进行重写，这样就不会覆盖原有数组的原型
- 通知更新操作

```js
// 数组响应式处理
// push, pop, reverse, shift, sort, splice, unshift
const arrayMethods = ["push", "pop", "reverse", "shift", "unshift", "sort", "splice"];
const originProto = Array.prototype;
const arrayCopyProto = Object.create(originProto);

arrayMethods.forEach(method => {
    arrayCopyProto[method] = function () {
        // 原始操作
        originProto[method].apply(this, arguments);

        // 通知更新操作
    }
})
```

我们需要在 Observer 类处理

```js
class Observer {
    constructor(value) {
        this.$value = value
        if (Array.isArray(value)) {
            // 处理数组
            // array 覆盖原型，替换变更操作
            value.__proto__ = arrayCopyProto;

            // 对数组内容元素执行响应式
            value.forEach(item => observe(item));
        } else {
            // 处理对象
            this.walk(value);
        }
    }
    // 遍历对象，响应式处理
    walk(obj) {
        Object.keys.forEach(key => defineReactive(obj, key, obj[key]));
    }
}
```

# MVVM 类 Vue 迷你框架（完结撒花）

![image.png](http://image.huawei.com/tiny-lts/v1/images/eac303ef8f65147f913981c80a0683ed_900x614.png@900-0-90-f.png)

- 处理数据响应式，分为
- 代理数据
- 依赖收集
- 触发更新
- 魔板编译，解析插值，解析指令，解析事件

完整的代码如下：

```js
// 数组响应式处理
// push, pop, reverse, shift, sort, splice, unshift
const arrayMethods = ["push", "pop", "reverse", "shift", "unshift", "sort", "splice"];
const originProto = Array.prototype;
const arrayCopyProto = Object.create(originProto);

arrayMethods.forEach(method => {
    arrayCopyProto[method] = function () {
        // 原始操作
        originProto[method].apply(this, arguments);

        // 通知更新操作
    }
})

// 响应式数据
function defineReactive(obj, key, val) {
    observe(val); // 递归遍历
    const dep = new Dep(); // 每个key对应创建一个Dep实例
    let curVal = val;
    Object.defineProperty(obj, key, {
        get() {
            Dep.target && dep.addDep(Dep.target); // 建立watcher与dep的映射关系
            console.log(`get:${key}-${curVal}`);
            return curVal;
        },
        set(newVal) {
            if (newVal !== curVal) {
                observe(newVal);
                console.log(`set:${key}-${newVal}`);
                curVal = newVal;
                dep.notify(); // 通知更新
            }
        }
    })
}


function observe(obj) {
    new Observer(obj);
}

// 属性代理

function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(val) {
                vm.$data[key] = val
            }
        })
    })
}

// MVue 类
class MVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data(); // 这里 data 是函数， 所以要执行取返回值

        // 对 data 选项做响应式处理
        observe(this.$data);

        // 代理数据
        proxy(this);

        // 编译模板
        new Compile(options.el, this);
    }
}

// Observer 用于管理 Watcher

class Observer {
    constructor(value) {
        this.$value = value
        if (Array.isArray(value)) {
            // 处理数组
            // array 覆盖原型，替换变更操作
            value.__proto__ = arrayCopyProto;

            // 对数组内容元素执行响应式
            value.forEach(item => observe(item));
        }
        if (typeof value === 'object') {
            // 处理对象
            this.walk(value);
        }
    }
    // 遍历对象，响应式处理
    walk(obj) {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
    }
}

// Compile 编译类

class Compile {
    // 宿主元素
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;

        if (this.$el) {
            this.compile(this.$el);
        }
    }
    // 判断节点是不是含有 {{}} 的文本节点
    isInter(node) {
        return node.nodeType === 3 && /{{.+}}/.test(node.textContent);
    }
    update = (node, key, dir) => {
        const fn = this[dir + 'Updater']; // 查找指令
        fn && fn(node, this.$vm[key]);

        // 更新函数
        new Watcher(this.$vm, key, (val) => {
            fn && fn(node, val);
        });
    }
    textUpdater(node, val) {
        node.textContent = val;
    }
    htmlUpdater(node, val) {
        node.innerHTML = val;
    }
    // 插值语法编译
    compileText = (node) => {
        let res = /{{(.+)}}/.exec(node.textContent)
        console.log("res===>", res)
        this.update(node, res[1], 'text');
    }

    // 递归传入节点，根据节点类型做不同操作
    compile = (el) => {
        // 拿到子节点
        const childNodes = el.childNodes;
        childNodes.forEach(node => {
            if (node.nodeType === 1) {
                console.log('元素节点', node.nodeName);
                this.compileElement(node);
            } else if (this.isInter(node)) {
                debugger
                this.compileText(node);
                console.log('文本节点', node.textContent);
            }

            if (node.childNodes) {
                this.compile(node);
            }
        });
    }


    text = (node, key) => {
        this.update(node, key, 'text');
    }

    html = (node, key) => {
        this.update(node, key, 'html');
    }

    // 节点元素的编译
    compileElement(node) {
        const nodeAttrs = Array.from(node.attributes);
        nodeAttrs.forEach(attr => {
            const { name, value } = attr;
            // 指令处理
            if (name.startsWith('m-')) {
                const dir = this[name.slice(2)]; // 找出指令方法
                dir && dir(node, value);
            }
            // 事件处理
            if (name.startsWith('@')) {
                // 找出开头是 @ 的指令，例如 @click
                const dir = name.slice(1);
                // 事件监听
                this.eventHandler(node, value, dir);
            }
        })
    }

    // 绑定监听函数
    eventHandler = (node, value, dir) => {
        const { methods } = this.$vm.$options;
        const fn = methods && methods[value];
        fn && node.addEventListener(dir, fn.bind(this.$vm));
    }

    // 解析 model
    modelUpdater(node, val) {
        node.value = val;
    }
    model = (node, key) => {
        this.update(node, key, 'model');
        node.addEventListener('input', e => {
            this.$vm[key] = e.target.value
        });
    }
}

// Watcher 类
// 检测数据变化

class Watcher {
    constructor(vm, key, updater) {
        this.$vm = vm;
        this.$key = key;
        this.$updater = updater;

        Dep.target = this; // 将当前实例指定在Dep的静态属性上
        vm[key]; // 读一下触发get
        Dep.target = null; // 置空
    }

    // 未来更新 dom 的函数，由 dep 调用
    update = () => {
        this.$updater.call(this.$vm, this.$vm[this.$key])
    }
}

// 依赖收集

class Dep {
    constructor() {
        this.deps = [];
    }
    addDep = (watcher) => {
        this.deps.push(watcher);
    }

    notify = () => {
        this.deps.forEach(watcher => watcher.update())
    }
}
```

效果如下：

![image.png](http://image.huawei.com/tiny-lts/v1/images/efb594b892f36f83416dc4e642077d47_528x194.png@900-0-90-f.png)


# Vue 源码解析 （一）初始化流程

![dd21057a676023ad74993b3c8b353c5e_1992x562.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/dd21057a676023ad74993b3c8b353c5e_1992x562.png@900-0-90-f.png)

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

![image.png](http://image.huawei.com/tiny-lts/v1/images/8e477117f47c8be622789c681795213c_954x241.png@900-0-90-f.png)

我们可以看到此时的 `$data`, `$props` 都为 `undefined`

```js
$data: undefined
$isServer: false
$props: undefined
$ssrContext: undefined
```
接着往下走 debugger 

![image.png](http://image.huawei.com/tiny-lts/v1/images/698a197ac1f43dc81dda9436e531b659_974x186.png@900-0-90-f.png)
此时我们发现 `vm` 开始出现 `_uid`，这个用于计算 `Vue` 被 `new` 过多少次

![image.png](http://image.huawei.com/tiny-lts/v1/images/b607c20faead750af6d4228e0ee6ca24_936x250.png@900-0-90-f.png)

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

![image.png](http://image.huawei.com/tiny-lts/v1/images/8067b1fbf96f18eb6b8f7216f065c45a_1130x358.png@900-0-90-f.png)


# initProxy

用于初始化代理数据，此时 vm 会出现一个叫做 `_renderProxy`：

![image.png](http://image.huawei.com/tiny-lts/v1/images/69755b644ab243e575dd4b2f2f7813aa_1221x105.png@900-0-90-f.png)

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

![image.png](http://image.huawei.com/tiny-lts/v1/images/63779d95ec12961595b181af2e9ad6e2_1213x727.png@900-0-90-f.png)


















