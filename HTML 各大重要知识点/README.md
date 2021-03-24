# DTD 有什么作用？

[文档类型声明](https://developer.mozilla.org/zh-CN/docs/Glossary/Doctype)

在 HTML 中，文档类型 doctype 的声明是必要的。

在所有文档的头部，你都将会看到"<!DOCTYPE html>" 的身影。

这个声明的目的是防止浏览器在渲染文档时，切换到我们称为“怪异模式(兼容模式)”的渲染模式。

“<!DOCTYPE html>" 确保浏览器按照最佳的相关规范进行渲染，而不是使用一个不符合规范的渲染模式。

# 什么是怪异模式？什么是标准模式？二者有什么差别（举例）？产生的历史原因是什么？使用时需要注意什么？

### 怪异模型

使用浏览器自己的方式解析执行代码，因为不同浏览器解析执行的方式不一样，所以称之为怪异模式。

### 标准模型

按照 W3C 标准解析执行代码

浏览器解析时使用标准模式还是怪异模式，与网页中的DTD声明直接相关，DTD声明定义了标准文档的类型（标准模式解析）文档类型，会使浏览器使用相关的方式加载网页并显示，忽略DTD声明，将使网页进入怪异模式（quirks mode）。

### 产生的历史原因？

是因为以前分了两个，一个是网景，一个是 IE 浏览器，而W3C标准创建之后，为了兼容老代码，老网站，所以采取了两种模式。

### 二者都有什么差别

在怪异模式下，排版会模拟 Navigator 4 与 Internet Explorer 5 的非标准行为。为了支持在网络标准被广泛采用前，就已经建好的网站，这么做是必要的。

在标准模式下，行为即（但愿如此）由 HTML 与 CSS 的规范描述的行为。

### 使用时需要注意什么？

1、盒模型：

在怪异模式下，盒模型为IE模型

![](https://img-blog.csdn.net/20170917153839823?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzEwNTk0NzU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

`height` = `border-top` + `border-bottom` + `padding-top` + `padding-bottom` + `content`

`width` = `border-left` + `border-right` + `padding-left` + `padding-right` + `content`

而在W3C标准的盒模型

![](https://img-blog.csdn.net/20170917153853995?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzEwNTk0NzU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

`height` = `content`

`width` = `content`

# HTML5是什么？有哪些新特性？新增了哪些语义化标签？新增了哪些表单元素？

### HTML5 是什么？

它是一个新版本的HTML语言，具有新的元素，属性和行为，

它有更大的技术集，允许构建更多样化和更强大的网站和应用程序。这个集合有时称为HTML5和它的朋友们，不过大多数时候仅缩写为一个词 HTML5。

- 语义：能够让你更恰当地描述你的内容是什么。
- 连通性：能够让你和服务器之间通过创新的新技术方法进行通信。
- 离线 & 存储：能够让网页在客户端本地存储数据以及更高效地离线运行。
- 多媒体：使 video 和 audio 成为了在所有 Web 中的一等公民。
- 2D/3D 绘图 & 效果：提供了一个更加分化范围的呈现选择。
- 性能 & 集成：提供了非常显著的性能优化和更有效的计算机硬件使用。
- 设备访问 Device Access：能够处理各种输入和输出设备。
- 样式设计: 让作者们来创作更加复杂的主题吧！

### 有哪些新特性？

- 语义化标签
- 多媒体 video/audio
- 画布 canvas
- 通信 websocket/webworker/Server-sent events
- 缓存 localStorage/sessionStorage
- 拖拽 drag/dragstart/dragover/dragleave/drop

### 新增了哪些语义化标签？

- section 块
- article 文章
- nav 导航
- header 头部
- footer 页脚
- main 主要
- aside 侧边栏

### 新增了哪些表单元素？

[html5篇——新增表单元素和表单属性](https://blog.csdn.net/u010556394/article/details/50769853)

```html
<form method="get" id="test">
      <input type="text" name="name"/>
      <input type="password" name="password"/>
      <input type="submit" value="提交">
 </form>
<input type="text" name="confirm" form="test">
<input type="email" name="email"/>
<input type="url" name="url"/>
<input type="number" name="number" min=2 max=100 step=5 value="15"/>
<input type="range" name="range" min=20 max=200 value="60"/>
<input type="date" name="date"/>
<input type="month" name="month"/>
<input type="week" name="week"/>
<input type="time" name="time"/>
<input type="datetime" name="datetime"/>
<input type="datetime-local" name="datetime-local"/>
<input type="search" name="search" result="s"/>
<input type="tel" name="tel" />
<input type="color" name="color"/>
<input type="text" name="name" pattern="[A-z0-9]{8}"/>
```

# 什么是HTML语义化？

单纯的HTML代码是不带任何样式的只是用来标记这一段是标题、这一块是代码、那一个是要强调的内容等等，但是为什么我们只写HTML在浏览器中不同的标签也是有不同的样式呢？那是因为各个浏览器都自带的有相应标签的默认样式，为了方便在没有设定样式的情况下友好的展示页面。
良好的语义化代码可以直接从代码上就能看出来那一块到底是要表达什么内容。

# 为什么要使用HTML语义化标签？
- 1.标签语义化有助于构架良好的HTML结构，有利于搜索引擎的建立索引、有助于爬虫抓取更多的有效信息.简单来说，试想在H1标签中匹配到的关键词和在div中匹配到的关键词搜索引擎会吧那个结果放在前面。
- 2.有利于不同设备的解析（屏幕阅读器，盲人阅读器等）满是div的页面这些设备如何区分那些是主要内容优先阅读？
- 3.有利于构建清晰的机构，有利于团队的开发、维护。
- 4.提升用户体验，例如title、alt可用于解释名词或解释图片信息。
- 5.网页加载慢导致CSS文件还未加载时（没有CSS），页面仍然清晰、可读、好看。

# 语义化标签有啥缺陷

- 兼容性差

# meta viewport 是做什么用的，怎么写？

该meta标签的作用是让当前viewport的宽度等于设备的宽度

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
```

meta viewport 的6个属性：

- width设置layout viewport的宽度，为一个正整数，或字符串"width-device"

- initial-scale设置页面的最大缩放值，为一个数字，可以带小数

- minimum-scale允许用户的最小缩放值，为一个数字，可以带小数

- maximum-scale允许用户的最大缩放值，为一个数字，可以带小数

- height设置layout viewport的高度，这个属性并不重要，很少使用

- user-scalable 是否允许用户进行缩放，值为"no"或"yes"

# 使用 data-* 属性有什么用？

是一类被称为自定义数据属性的属性，它赋予我们在所有 HTML 元素上嵌入自定义数据属性的能力，并可以通过脚本在 HTML 与 DOM 表现之间进行专有数据的交换。

通过 element.dataset[属性名字] 获取对应的值。

# `<script>`、`<script async>` 和 `<script defer>` 的区别。

### `<script>`

不带属性，加载到 `script` 脚本立即下载执行，阻塞后续渲染的执行。

### `<script async>`

与后续元素渲染异步执行，乱序执行，若js文件之间存在依赖关系，容易产生错误，

只适用于完全没有依赖的文件，文档解析过程中异步下载，下载完成之后立即执行。

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script src="../vue.js" async></script>
  <div id="app"
       @once>
  </div>
  <script>
            const vm = new Vue({
                el: "#app",
                data(){
                    return {
                    }
                },
            })

            console.log("vm", vm)
    </script>
</body>

</html>
```

你会发现控制台报错了：

```js
Uncaught ReferenceError: Vue is not defined
```

### `<script defer>`

与后续渲染异步执行，延迟到界面文档解析完成之后执行，<b style="color: red;">即为立即下载，延迟执行<b>。所有执行均在DOMContentLoaded 事件触发之前完成。 

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script src="../vue.js" defer></script>
  <div id="app"
       @once>
  </div>
  <script>
            const vm = new Vue({
                el: "#app",
                data(){
                    return {
                    }
                },
            })

            console.log("vm", vm)
    </script>
</body>

</html>
```

### 最佳的解决方案

外部引用文件放在`</body>`之前执行

### `<script/>`放在`<head/>`与`<body/>`中的区别？

区别：加载顺序的不同，在页面加载之前下载，HTML加载顺序是由上至下

`<head/>`：会在文档加载前加载结束。

`<body/>`：不能保证哪个先加载结束（文档？引用文件？）性能更优

注：内嵌的脚本也不要紧跟在`<link>`标签之后，否则会导致页面阻塞去等待样式表的下载。


# 白屏和`FOUC`是什么？

### 白屏

不同浏览器对 CSS 和 HTML 的处理方式不同，有的是等待 CSS 加载完成之后，对 HTML 元素进行渲染和展示。

白屏不是bug，而是由于浏览器的渲染机制。

### FOUC

有的是先对 HTML 元素进行展示，然后等待 CSS 加载完成之后重新对样式进行修改（无样式内容闪烁）

### 如何解决FOUC问题

尽量把 js 文件放在 `<body>` 标签后面引入，执行。

# 浏览器的渲染机制

- 解析 DOM 树
- 解析 CSSDOM 树
- 有了 DOM 树，CSSDOM 树，进行渲染，形成 Render Tree
- layout 浏览器已经能知道网页中有哪些节点、各个节点的CSS定义以及他们的从属关系，从而去计算出每个节点在屏幕中的位置
- painting 绘制
- reflow 回流
- repaint 重绘 改变某个元素的背景色、文字颜色、边框颜色等等不影响它周围或内部布局的属性时，屏幕的一部分要重画，但是元素的几何尺寸没有变。

# 什么是回流（影响布局的情况）

浏览器发现某个部分发生了点变化影响了布局，需要倒回去重新渲染，这个过程就是回流

# 什么是重绘（不影响布局的情况）

改变某个元素的背景色、文字颜色、边框颜色等等不影响它周围或内部布局的属性时，屏幕的一部分要重画，但是元素的几何尺寸没有变。

# 为什么通常推荐将 `CSS <link>` 放置在 `<head></head>` 之间，而将 `JS <script>` 放置在 `</body>` 之前？你知道有哪些例外吗？

如果将 js 放在 head 里面，则会先被浏览器解析，但是这时的 body 还没被解析，如果这个时候，浏览器解析到 js 出现错误，就会阻止后续的渲染。

例外的话？

一般都会绑定一个监听 onload，当全部的html文档解析完之后，再执行代码

```js
window.onload = function() {
      // 将所有 js 代码都在 window.onload 方法加载
}
```

# 什么属性能让浏览器直接使用ES6 Module

```js
<script type="module">
  import {addTextToBody} from './utils.js';
 
  addTextToBody('Modules are pretty cool.');
</script>
```


