原因：手机端事件 touchstart –> touchmove –> touchend or touchcancel –> click，因为在 touch 事件触发之后，浏览器要判断用户是否会做出双击屏幕的操作，所以会等待 300ms 来判断，再做出是否触发 click 事件的处理，所以就会有 300ms 的延迟。

禁用缩放
```html
<meta name = "viewport" content="user-scalable=no" >
```
缺点: 网页无法缩放
更改默认视口宽度
```html
<meta name="viewport" content="width=device-width">
```
缺点: 需要浏览器的支持

css touch-action touch-action的默为 auto，将其置为 none 即可移除目标元素的 300 毫秒延迟

缺点: 新属性，可能存在浏览器兼容问题

tap事件 zepto的tap事件, 利用touchstart和touchend来模拟click事件

缺点: 点击穿透

fastclick 原理: 在检测到touchend事件的时候，会通过DOM自定义事件立即出发模拟一个click事件，并把浏览器在300ms之后真正的click事件阻止掉

缺点: 脚本相对较大

使用:
```js
// 引入   
<script type='application/javascript' src='/path/to/fastclick.js'></script>    

// 使用了jquery的时候    
$(function() {        
   FastClick.attach(document.body);    
});    

// 没使用jquery的时候    
if ('addEventListener' in document) {        
   document.addEventListener('DOMContentLoaded', function() {            
    FastClick.attach(document.body);        
   }, false);    
}  
```
在vue中使用

// 安装    
npm install fastclick -S    
// 引入    
import FastClick from 'fastclick'    
// 使用    
FastClick.attach(document.body);    
加了 FastClick 后解决延迟。

原理：FastClick 在 touchend 阶段调用 event.preventDefault，然后通过 document.createEvent 创建一个 MouseEvents，然后通过 event​Target​.dispatch​Event 触发对应目标元素上绑定的 click 事件。
```js
// 业务代码
var $test = document.getElementById('test');
$test.addEventListener('click', function () {
    console.log('click')
});

// FastClick简单实现
var targetElement = null;
document.body.addEventListener('touchstart', function () {
    // 记录点击的元素
    targetElement = event.target;
});
document.body.addEventListener('touchend', function (event) {
    // 阻止默认事件（屏蔽之后的click事件）
    event.preventDefault();
    var touch = event.changedTouches[0];
    // 合成click事件，并添加可跟踪属性forwardedTouchEvent
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
});
```
