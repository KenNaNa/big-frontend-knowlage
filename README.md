[带你从0到1系统构建web全栈完整的知识体系！](https://github.com/qappleh/Interview)
# HTML相关

- DTD的作用是什么？
- 什么是怪异模式？
- 什么是标准模式？二者有什么差别（举例）？产生的历史原因是什么？使用时需要注意什么？
- HTML5是什么？有哪些新特性？新增了哪些语义化标签？新增了哪些表单元素？和h5有啥关系？
- 你是如何理解 HTML 语义化的？
- meta viewport 是做什么用的，怎么写？
- HTML 和 XHTML 有什么区别？
- 使用 data-* 属性有什么用？
- <script>、<script async> 和 <script defer> 的区别。
- 白屏和FOUC是什么？
- 为什么通常推荐将 CSS `<link>` 放置在 `<head></head>` 之间，而将 JS `<script>` 放置在 `</body>` 之前？有没有例外的情况？
- 浏览器渲染机制？
- 什么是回流(reflow)、
- 重绘(repaint)？
- 什么属性能让浏览器直接使用ES6 Module

# CSS 相关


- 两种盒模型分别说一下。如何垂直居中？
- Flex 怎么用，常用属性有哪些？
- Grid布局用过吗？
- 必考：BFC 是什么？
- CSS 选择器优先级CSS 中 class 和 ID 的区别CSS reset 和 CSS normalize是什么？
- 浮动 (Floats)元素有哪些特性？清除浮动说一下z-index和叠加上下文是如何形成的？在同一个层叠上下文中才能比较z-index的大小。
- CSS sprites是什么字体图标和svg图标用过吗你日常工作是如何处理浏览器兼容的？
- 如何为有功能限制的浏览器提供网页？
- 渐进增强，优雅降级是什么？
- 有哪些的隐藏内容的方法？
- 栅格系统是什么你用过媒体查询吗？
- 如何优化网页的打印样式？
- 如果设计中使用了非标准的字体，你该如何去实现？
- 浏览器是如何判断元素是否匹配某个 CSS 选择器？
- 伪元素 (pseudo-elements) 有什么用？
- 列出你所知道的 display 属性的全部值inline 和 inline-block 的区别relative、fixed、absolute 和 static 元素的区别？
- 响应式设计 (responsive design) 和自适应设计 (adaptive design) 不同？
- 为什么提倡使用 translate() 而非 不是 absolute？
- 如果实现一个高性能的CSS动画效果？
- 圣杯布局，双飞翼布局了解吗

# javascript

- JS有哪几种数据类型变量声明提升？
- let、var、const的区别？
- ES 6 语法你平常能用到哪些？
- undefined和null有什么区别？
- Promise、Promise.all、Promise.race 分别怎么用？
- 这段代码里的 this 是什么？
- 箭头函数和普通函数有什么区别？
- 如果把箭头函数转换为不用箭头函数的形式，如何转换闭包是什么？
- 什么是跨域？
- 有哪些方法？
- 图片懒加载的原理动画有几种实现方式，性能对比聊一聊DOM事件流、冒泡、捕获事件委托是什么
- EventLoop是什么
- 宏任务微任务是什么

# 手写代码

- 手写一个Promise
- 手写函数防抖和函数节流
- 手写AJAX
- 如何实现深拷贝？
- 封装一个jsonp？
- 如何用正则实现 trim()？
- 不用 class 如何实现继承？
- 用 class 又如何实现？
- 如何实现数组去重？
- 手写函数柯里化
- 实现一个new
- 实现bind、call、apply
- 数组拍平
- 手写发布订阅
- 手写Promise斐
- 波那契实现与优化

# HTTP

- 讲一讲TCP协议的三次握手和四次挥手流程
- 为什么TCP建立连接协议是三次握手，而关闭连接却是四次握手呢？
- 为什么不能用两次握手进行连接？OSI有哪七层模型？
- TCP/IP是哪四层模型传输层有哪些协议应用层有哪些协议，常用端口常见Http方法有哪些？
- 使用场景分别是什么？
- GET与POST有什么区别？
- 在HTML的form 标签里，method支持哪些类型？
- 状态码 200、301、302、304、403、404、500、503分别代表什么？
- Web安全中有哪些常见的攻击方式？
- 一次完整的Http请求所经历哪些步骤？
- URI和URL的区别？
- HTTP请求报文与响应报文的格式？
- Http首部包含哪些字段？
- 举例说明Websockt是什么？
- 和HTTP有什么区别？常见的鉴权方式有哪些谈谈Session/Cookie机制，如何实现会话跟踪谈谈JWT鉴权原理谈谈Auth2鉴权原理浏览器是如何控制缓存的什么是非持久连接，什么是持久连接？
- 服务端推送有哪些技术谈谈Comet（长轮询）的原理HTTPS的原理是什么？
- Keep-Alive: timeout=5, max=100是什么意思？
- HTTP1.0，HTTP1.1，HTTP2.0，HTTP3区别（HTTP1.1版本新特性？HTTP2快在哪里？HTTP3变了什么？）

# 打包工具
- 除了Webpack外你还用过哪些构建工具？
- Webpack与Grunt、Gulp有什么区别？
- Webpack的构建流程是什么有哪些常见的Loader？
- 他们是解决什么问题的？
- 有哪些常见的Plugin？
- 他们是解决什么问题的？
- Loader 和 Plugin 有什么差别有没有写过Loader有没有写过Plugincompiler与complilation有什么区别？
- 有哪些代码分离的方法
- 什么是 Tree Shaking
- 如何利用Webpack来优化前端性能
- 如何提高Webpack的构建速度
- 打包文件大怎么解决

# Vue 相关的

- Vue  watch、computed、methods区别是什么
- v-show与v-if区别是什么
- 列表遍历时key作用？
- Vue有哪些生命周期钩子函数？有什么用？
- Vue父子组件生命周期调用顺序
- Vue如何实现组件通信
- data为什么是函数
- Vue数据响应式原理
- nextTick怎么用？原理是什么
- 组件data为什么是函数
- diff算法和时间复杂度
- Vue中的keep-alive有什么用
- Vuex怎么用
- VueRouter怎么用
- VueRouter中hash和history模式的原理
- VueRouter如何做登录跳转
- Vuex的原理，有哪些概念
- Vue3用过吗，有哪些让你觉得好用的变化

# 移动端
- px、em、rem、vw、百分比的区别
- 物理像素、逻辑像素、CSS像素、PPI、设备像素比是什么
- 移动端页面为什么要加<meta name="viewport" content="width=device-width">
- 图片高清怎么做如何实现0.5px边框/细边框
- 移动端如何做适配有哪些方案
- 聊聊viewport缩放方案
- 聊聊动态REM方案
- 聊聊vw适配方案
- 300ms延时的原因和解决fastclick是什么原理

# 性能优化
- 前端性能优化经验
- 如何做首屏渲染优化
- 白屏优化
- 长列表优化方案
- HTTP2如何提升性能
- 懒加载、预加载、HTTP2的服务器推送都是什么


# 非技术问题
- 做个自我介绍
- 介绍最难的项目
- 项目如何做优化
- 如何做技术选型
- 单元测试做不做
- 有什么流程和规范
- 读过源码吗
- 有没有造过轮子
- 平时不写博客吗
- 你是怎么学前端的
- 你的职业规划
- 你有什么要问的




### react 项目

[react-elm](https://github.com/liuyangjike/react-elm)
[React-Native学习指南](https://github.com/reactnativecn/react-native-guide)




# 写这份初衷
我不想再只是看别人的知识总结了，实在是太多了，而且每个人的理解，成长方式不同，必须要按照自己的步骤来实现，不能被别人带着走，或许别人能够告诉你一些前沿的东西，更多的是自己勇敢的去探索，在这里立下誓言，写这份文档，拒绝抄袭，拒绝抄袭，拒绝抄袭，必须坚持原创，希望后面有更多的人参与进来
