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

而在W3C标准的盒模型

![](https://img-blog.csdn.net/20170917153853995?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzEwNTk0NzU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


