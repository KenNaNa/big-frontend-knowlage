[Vue的路由实现原理：hash模式 和 history模式](https://blog.csdn.net/weixin_42752574/article/details/108457614)

# 1. 背景知识

大多数vue项目采用SPA(单页面应用)的模式开发，不同视图的切换，都要通过前端路由去管理和控制。

因此平时我们开发vue的项目，都会install vue-router来实现前端路由，控制视图的切换。

前端路由的作用，就是改变视图的同时不会向后端发出请求。

vue-Router的原理就是利用了浏览器自身的两个特性(hash和history),来实现前端路由的功能。

# 2. history和hash实现原理

### 2.1. history mode实现原理

介绍history mode前，需要先认识window.history对象

window.history 提供了两类API，一类是go(), back(), forward()这种定位到某个浏览历史的记录上；

另外一类是pushState(), replaceState()这种，是操作历史记录的接口（添加和替换历史记录栈）。

history mode就是使用pushState()和replaceState()来实现前端路由，通过这两个方法改变url，页面不会重新刷新。

使用这两个方法更改url后，会触发popstate事件，监听popstate事件，实现前端路由。

window.addEventListener('popstate', function(e) { alert('url 更新') });

当我们访问同域下不同的url时，就能触发popstate事件

# 2.2. hash moede实现原理
hash mode下的url都有一个特点，就是url里面带'#'号，

如：https://www.baidu.com/#/view1。 '#'号后面就是hash值。

同样的，改变hash值，也不会向服务器发出请求，因此也就不会刷新页面。每次hash值发生改变的时候，会触发hashchange事件。通过监听hashchange事件，实现前端路由：

# 3. history和hash的差异
history和hash的差异主要有以下点：

1.history和hash都是利用浏览器的两种特性实现前端路由，history是利用浏览历史记录栈的API实现，hash是监听location对象hash值变化事件来实现

2.history的url没有'#'号，hash反之

3.history修改的url可以是同域的任意url，hash是同文档的url

4.相同的url，history会触发添加到浏览器历史记录栈中，hash不会触发。


# 4. history和hash的优点和缺点
1.history比hash的url美观（没有'#'号）

2.history修改的url可以是同域的任意url，hash则只能是同文档的url

3.history模式往往需要后端支持，如果后端nginx没有覆盖路由地址，就会返回404，hash因为是同文档的url，即使后端没有覆盖路由地址，也不会返回404

4.hash模式下，如果把url作为参数传后端，那么后端会直接从'#'号截断，只处理'#'号前的url，因此会存在#后的参数内容丢失的问题，不过这个问题hash模式下也有解决的方法。

# 5. 总结
一般场景下，前端路由使用history或hash都可以，个人推荐history mode，

history mode更加符合个人使用习惯，只要后端nginx做好配置即可。



