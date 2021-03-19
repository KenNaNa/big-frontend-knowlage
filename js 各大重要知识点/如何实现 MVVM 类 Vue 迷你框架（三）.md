# 如何实现 MVVM 类 Vue 迷你框架（三）


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
