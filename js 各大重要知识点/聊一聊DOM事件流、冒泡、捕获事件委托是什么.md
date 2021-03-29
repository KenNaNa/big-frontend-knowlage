由网上文章整理成，具体可以参考下面文章：

- https://www.cnblogs.com/xiaohuochai/p/5859476.html
- https://segmentfault.com/a/1190000013176643
- https://segmentfault.com/a/1190000012729080
- https://www.cnblogs.com/christineqing/p/7607113.html
- https://segmentfault.com/a/1190000005654451#articleHeader8
- https://www.cnblogs.com/lihongfei0602/p/4062345.html
- https://www.cnblogs.com/chunlei36/p/6354167.html


javascript操作CSS称为脚本化CSS，而javascript与HTML的交互是通过事件实现的。

事件就是文档或浏览器窗口中发生的一些特定的交互瞬间，而事件流(又叫事件传播)描述的是从页面中接收事件的顺序。

# 1. 事件冒泡

IE的事件流叫做事件冒泡(event bubbling)，即事件开始时由最具体的元素(文档中嵌套层次最深的那个节点)接收，然后逐级向上传播到较为不具体的节点(文档)。

所有现代浏览器都支持事件冒泡，并且会将事件一直冒泡到window对象。

![](https://img-blog.csdnimg.cn/20190225140611706.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTQ0NjU5MzQ=,size_16,color_FFFFFF,t_70)

# 2. 事件捕获


事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。

事件捕获的用意在于在事件到达预定目标之前就捕获它。

IE9+、Safari、Chrome、Opera和Firefox支持，且从window开始捕获（尽管DOM2级事件规范要求从document）。

由于老版本浏览器不支持，所以很少有人使用事件捕获。

![](https://img-blog.csdnimg.cn/20190225140729980.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTQ0NjU5MzQ=,size_16,color_FFFFFF,t_70)

# 冒泡还是捕获？

对于事件代理来说，在事件捕获或者事件冒泡阶段处理并没有明显的优劣之分，但是由于事件冒泡的事件流模型被所有主流的浏览器兼容，从兼容性角度来说还是建议大家使用事件冒泡模型。

# 3. DOM 事件流

事件流又称为事件传播，DOM2级事件规定的事件流包括三个阶段：事件捕获阶段(capture phase)、处于目标阶段(target phase)和事件冒泡阶段(bubbling phase)。

首先发生的是事件捕获，为截获事件提供了机会。然后是实际的目标接收到事件，最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

![](https://img-blog.csdnimg.cn/2019022514085793.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTQ0NjU5MzQ=,size_16,color_FFFFFF,t_70)

DOM事件流：同时支持两种事件模型：捕获型事件和冒泡型事件，但是，捕获型事件先发生。两种事件流会触及DOM中的所有对象，从document对象开始，也在document对象结束。

W3c明智的在这场争斗中选择了一个择中的方案。任何发生在w3c事件模型中的事件，首是进入捕获阶段，直到达到目标元素，再进入冒泡阶段。

你可以选择是在捕获阶段还是冒泡阶段绑定事件处理函数，这是通过addEventListener()方法实现的，如果这个函数的最后一个参数是true，则在捕获阶段绑定函数，反之false(默认)，在冒泡阶段绑定函数。

# 4.一个十分有趣的例子

具体可以参考：https://segmentfault.com/a/1190000012729080

```html
<div id="a">
    <div id="b">
        <div id="c"></div>
    </div>
</div>

#a{
    width: 300px;
    height: 300px;
    background: pink;
}
#b{
    width: 200px;
    height: 200px;
    background: blue;
}
#c{
    width: 100px;
    height: 100px;
    background: yellow;
}

var a = document.getElementById("a"),
    b = document.getElementById("b"),
    c = document.getElementById("c");
c.addEventListener("click", function (event) {
    console.log("c1");
    // 注意第三个参数没有传进 false , 因为默认传进来的是 false
    //，代表冒泡阶段调用，个人认为处于目标阶段也会调用的
});
c.addEventListener("click", function (event) {
    console.log("c2");
}, true);
b.addEventListener("click", function (event) {
    console.log("b");
}, true);
a.addEventListener("click", function (event) {
    console.log("a1");
}, true);
a.addEventListener("click", function (event) {
    console.log("a2")
});
a.addEventListener("click", function (event) {
    console.log("a3");
    event.stopImmediatePropagation();
}, true);
a.addEventListener("click", function (event) {
    console.log("a4");
}, true);

```

整个的html页面就是下面这三个小盒子。

![](https://img-blog.csdnimg.cn/20190225141447747.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTQ0NjU5MzQ=,size_16,color_FFFFFF,t_70)


那么现在有三个问题：

1.如果点击c或者b，输出什么?（答案是a1、a3）

stopImmediatePropagation包含了stopPropagation的功能，即阻止事件传播（捕获或冒泡），但同时也阻止该元素上后来绑定的事件处理程序被调用，所以不输出 a4。因为事件捕获被拦截了，自然不会触发 b、c 上的事件，所以不输出 b、c1、c2，冒泡更谈不上了，所以不输出 a2。

2.如果点击a，输出什么?（答案是 a1、a2、a3）

不应该是 a1、a3、a2 吗？有同学就会说：“a1、a3可是在捕获阶段被调用的处理程序的，a2 是在冒泡阶段被调用的啊。”这正是要说明的：虽然这三个事件处理程序注册时指定了true、false，但现在事件流是处于目标阶段，不是冒泡阶段、也不是捕获阶段，事件处理程序被调用的顺序是注册的顺序。不论你指定的是true还是false。换句话来说就是现在点击的是a这个盒子本身，它处于事件流的目标状态，而既非冒泡，又非捕获。（需要注意的是，此时的eventPhase为2，说明事件流处于目标阶段。当点击a的时候，先从document捕获，然后一步步往下找，找到a这个元素的时候，此时的target和currentTarget是一致的，所以认定到底了，不需要再捕获了，此时就按顺序执行已经预定的事件处理函数，执行完毕后再继续往上冒泡…）

3.如果注释掉event.stopImmediatePropagation，点击c，会输出什么？（答案是 a1、a3、a4、b、c1、c2、a2）

如果同一个事件处理程序（指针相同，比如用 handler 保存的事件处理程序），用 addEventListener或 attachEvent绑定多次，如果第三个参数是相同的话，也只会被调用一次。当然，如果第三个参数一个设置为true，另一个设置为false，那么会被调用两次。
而在这里，都是给监听函数的回调赋予了一个匿名函数，所以其实每个处理函数都会被调用。需要注意的是，如果你还不明白为什么在c上触发的先是c1再是c2的话，那么你就需要在去看看第二个问题锁描述的内容了。

# 5.事件冒泡与事件捕获应用:事件代理

举个例子。 ul 下面很多 li, 点击li,输出 li 的文字。循环每个li 添加点击事件不是很好的选择。 可以把点击事件写在 ul 上，点击 li ，事件会冒泡到 ul, 这样只用写一个事件。

具体可以参考：
https://segmentfault.com/a/1190000005654451#articleHeader8
https://www.cnblogs.com/liugang-vip/p/5616484.html

# 6.事件委托

事件委托顾名思义：将事件委托给另外的元素。其实就是利用DOM的事件冒泡原理，将事件绑定到目标元素的父节点。

如果要为大量的元素节点绑定事件，完美可以用事件委托完美解决，直接将事件绑定在这些元素的父节点上，只需要绑定一次，就可以在所有子节点触发事件。

最适合使用事件委托技术的事件包括click、mousedown、mouseup、keydown、keyup和keypress。

具体可以参考：https://www.cnblogs.com/lihongfei0602/p/4062345.html

事件代理就是事件委托，具体解释可以参考：
https://www.cnblogs.com/liugang-vip/p/5616484.html
https://www.cnblogs.com/xiayu25/p/6269652.html

