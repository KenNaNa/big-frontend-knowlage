# 背景

经常我们在给一个大型网站写页面的css时候，经常会出现如下的css编写效果。

```css
  .container .form .input  .warpper .icon {
        /*写入你需要的css*/
    }  

  .container .form .text  {
       /*写入你需要的css*/
  }

 .page .warpper .layout .content{
       /*写入你需要的css*/
  }
```

这样的css编写效果就是传统的命名空间的方式写css，它很好得解决了编写单纯全局css互相影响的问题，但是另外一方面它也引申出了一些问题：

- 维护css的时候，只看HTML，我们无法知道当前css的作用范围，css的表现不够一目了然。
- 如果我要覆盖css的样式，可能我就需要利用css的优先级的规则去覆盖原有的css，这样就会导致css优先级竞争。
- css编写的时候复用性不高，当存在多个样式一致的时候，我们可能会选择减少命名空间的方式来提升当前css的作用范围，但是可能会导致css样式冲突的问题。

由于我们的行业很棒，我们有很多推荐的解决方案。因为专家们的纷纷加入，于是我们有 BEM，OOCSS，SMACSS，Atomic Design 等许多选择。

# CSS 规范究竟在解决什么问题

- 我必须 立即知道编辑一个 class 是否安全，会不会干扰其他 CSS。这是最重要的，特别是当我需要在短时间内进行修改时。我不想因为改变一处而破坏别的东西。
- 我必须立即知道一个 class 放在这个伟大工程中的什么地方，以防止大脑过载。这样我就可以快速修改 style，而不必在整个工程里前后引用。
- class 必须 尽可能少，因为看到一长串的 class 时我头很晕。
- 我必须 立即知道一个组件是否使用了 JavaScript，所以如果我改变了它的 CSS，我不会意外地破坏任何组件。

# 什么是BEM

如果你从未接触过BEM，那么你第一次接触到BEM的时候它是长这个样子的。

```css

.block { /* styles */ }
.block__element { /* styles */ } 
.block--modifier { /* styles */ }

```

期中的BEM分别对应block ， element 和 modifier。

# 什么是块

在规范中，块表示一个组件的意思，这样看上去有点抽象，我们可以通过例子来学习，假设你要写一个按钮的组件。我们只需要设置了一个 .button 类的按钮，然后可以在任何<button>按钮上使用该类，就可以生成该组件的传统样式。

使用.button而不是用button的原因是因为类允许无限的可重用性，而即使是最基本的元素也可能改变样式。

但是在实际的项目使用中，我们会发现一个按钮可能是大按钮，可能是小按钮，也可能是红色的，或者黄色的。于是就引申出了BEM的modifier。


# 什么是修饰符
修饰符是改变某个块的外观的标志。要使用修饰符，可以将 --modifier 添加到块中。
假如我们要添加一个默认按钮，一个主要按钮，一个大按钮，一个小按钮，一个主要的小按钮。
我们可以这样:

```html
 <button class=".button .button--default"></button>  
 <button class=".button .button--primary"></button>
 <button class=".button .button--large"></button>   
 <button class=".button .button--small"></button> 
 <button class=".button .button--primary .button--small"></button> 
```

如果会scss或任何其他预处理器的mixin，我们就可以减少一些class，写成这样:

```html
 <button class=".button--default"></button>  
 <button class=".button--primary"></button>
 <button class=".button--large"></button>   
 <button class=".button--small"></button> 
 <button class=".button--small--primary"></button> 

```

# 什么是元素

元素是块的子节点。为了表明某个东西是一个元素，你需要在块名后添加 __element。

所以，如果你看到一个像那样的名字，比如 form__row ，你将立即知道 .form 块中有一个 row 元素。

```html
<form class="form" action="">
   <div class="form__row"> 
  </div> 
</form> 
<style>
   .form__row { /* styles */ }
</style>
```

# BEM 元素有两个优点 ：
- 你可以让 CSS 的优先级保持相对扁平。
- 你能立即知道哪些东西是一个子元素。





