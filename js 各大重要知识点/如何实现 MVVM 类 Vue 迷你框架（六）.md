# 如何实现 MVVM 类 Vue 迷你框架（六）


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
