# 如何实现 MVVM 类 Vue 迷你框架（五）


上面几节课我们已经把数据代理，响应式处理搞完了，接下来需要做什么呢？
当然是最难的一部分了，就是我们的编译模板。


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
