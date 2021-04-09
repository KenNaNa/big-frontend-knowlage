本文所有分析针对版本 v1.0.0-rc.13，你可以下载 vite1.0.0-rc.13 的源码

前面我们介绍了 vite server 的启动过程，那么服务启动后，vite 是如何把浏览器需要的 modules 进行编译构建，并且返回给浏览器呢？

# 一、vite 如何处理 modules

我们按照网页加载的顺序，首先从入口的 html 文件进行分析，在 html 文件中，有下面一段代码：

```html
	<body>
	  <div id="app"></div>
	  <script type="module" src="/src/main.js"></script>
	</body>
```

当浏览器检测到 <script type="module" src="/src/main.js"></script> 这行代码时，会按照 esm 标准处理，会去分析 /src/main.js 里面 import 的 modules。

我们来看看 main.js 里面的内容

```js
	import { createApp } from 'vue'
	import App from '/App.vue'
	createApp(App).mount('#app')
```

此时，假如不出意外，浏览器会执行以下操作：

- 从 vue 文件中获取 createApp 模块
- 从 App.vue 文件中获取 App 模块


但是这里有个问题，第 1 步的操作是会出现失败的。这是为什么呢？因为 ‘vue’ 是通过 npm 进行管理的，在 node_modules 目录下，所以浏览器是无法通过 ‘vue’ 这个路径找到相应的文件的。那么怎么办呢？

vite 的解决方案是进行路径重写。vite 会将下面语句

```js

```
