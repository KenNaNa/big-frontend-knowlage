# 如何实现 MVVM 类 Vue 迷你框架（二）


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
