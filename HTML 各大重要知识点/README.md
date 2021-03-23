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




