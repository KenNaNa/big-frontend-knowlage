# 如何实现 MVVM 类 Vue 迷你框架（四）


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
