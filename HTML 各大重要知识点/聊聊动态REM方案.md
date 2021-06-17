h5的移动端适配核心的问题有两个：

1.因为目前手机品牌众多，手机的宽度不统一，所以第一个问题就是如何让不同的手机显示的内容看起来是一样的？

2.因为目前市场上的手机多数是高清屏，如何解决高清的问题？

这篇文章将会介绍rem是如何解决这两个问题。

一、rem的简介

rem是css3新增的属性，是一个相对单位（相对根节点html的字体大小来计算）。比如：html的font－size为64px，2rem则是128px。

二、rem方案

这个方案本质上是宽度等比适配，不同的手机通过动态的计算出html的字体大小来做等比换算，让视觉（拿一部分出来，比如正方形）占手机宽度的比例在不同手机上是相等的，这样就可以在不同手机上看起来是一个样子。

动态计算html的字体大小的公式如下：

rem = document.documentElement.clientWidth * dpr / 10

说明：

1.乘以dpr，是因为页面有可能为了实现1px border页面会缩放(scale) 1/dpr 倍(如果没有，dpr=1)。

2.除以10，是为了取整，方便计算(理论上可以是任何值)。

3.根据这个公式可以知道，手机的clientWidth（屏幕宽度）和dpr（物理像素 / 设备独立像素）决定了html的字体大小（基准值）。比如：

iphone3gs: 320px / 10 = 32px

iphone4/5: 320px * 2 / 10 = 64px

iphone6: 375px * 2 / 10 = 75px

这样子假如一个针对iphone6的高清视觉稿 750×1334，如果有一个区块，在psd文件中量出：宽高750×300px的div（宽度占满屏幕），那么转换成rem单位（rem = px / 基准值）：宽高为10x4rem。这样的rem在iPhone4中换算成px为640x256px（宽度也是占满屏幕的）。

三、代码实现

这个方案只需要在加载页面的body的时候先执行以下js代码就可以做到适配的效果。

var dpr, rem, scale;

var docEl = document.documentElement;

var fontEl = document.createElement('style');

var metaEl = document.querySelector('meta[name="viewport"]');

dpr = window.devicePixelRatio || 1;

rem = docEl.clientWidth * dpr / 10;//基准值

scale = 1 / dpr;

// 设置viewport，进行缩放，达到高清效果

//理论上，1个位图像素对应于1个物理像素，图片才能得到完美清晰的展示。

metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale+ ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

// 动态写入样式

docEl.firstElementChild.appendChild(fontEl);

fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

四、参考文章：https://sanwen8.cn/p/416glHZ.html
