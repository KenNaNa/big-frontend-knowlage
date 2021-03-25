# 两种盒模型分别说一下

[盒子模型](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)

### 盒子模型的各个部分

- content-box: 内容的实际宽高
- padding-box: 包围在内容区域外部的空白区域； 大小通过 padding 相关属性设置
- border-box: 边框盒包裹内容和内边距。大小通过 border 相关属性设置
- margin-box: 这是最外面的区域，是盒子和其他元素之间的空白区域。大小通过 margin 相关属性设置。

### 标准盒子模型

在标准模型中，如果你给盒设置 width 和 height，实际设置的是 content box。 padding 和 border 再加上设置的宽高一起决定整个盒子的大小

假设定义了 width, height, margin, border, and padding:

```js
.box {
  width: 350px;
  height: 150px;
  margin: 25px;
  padding: 25px;
  border: 5px solid black;
}
```

如果使用标准模型宽度 = 410px (350 + 25 + 25 + 5 + 5)，高度 = 210px (150 + 25 + 25 + 5 + 5)，padding 加 border 再加 content box。


### IE 怪异盒子模型

使用这个模型，所有宽度都是可见宽度，所以内容宽度是该宽度减去边框和填充部分。使用上面相同的样式得到 (width = 350px, height = 150px).

默认浏览器会使用标准模型。如果需要使用替代模型，您可以通过为其设置 `box-sizing: border-box` 来实现。 这样就可以告诉浏览器使用 `border-box` 来定义区域，从而设定您想要的大小。

```css
.box {
  box-sizing: border-box;
} 
```

# 如何垂直居中？

[css如何实现垂直居中（5种方法）](https://blog.csdn.net/weixin_34388207/article/details/93573026)

###  第一种

这个方法把一些 div 的显示方式设置为表格，因此我们可以使用表格的 vertical-align property 属性

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #wrapper {
      display: table;
    }

    #cell {
      display: table-cell;
      vertical-align: middle;
    }

  </style>
</head>

<body>
  <div id="wrapper">
    <div id="cell">
      <div class="content">
        Content goes here
      </div>
    </div>
  </div>
</body>

</html>
```

### 第二种

这个方法使用绝对定位的 div，把它的 top 设置为 50％，top margin 设置为负的 content高度。这意味着对象必须在 CSS 中指定固定的高度。

因为有固定高度，或许你想给 content 指定 overflow:auto，这样如果 content 太多的话，就会出现滚动条，以免content 溢出。

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #content {
      position: absolute;
      top: 50%;
      height: 240px;
      margin-top: -120px;
      /* negative half of the height */
    }

  </style>
</head>

<body>
  <div id="content"> Content goes here</div>
</body>

</html>
```

### 方法三

这种方法，在 content 元素外插入一个 div。设置此 div height:50%; margin-bottom:-contentheight;。 
content 清除浮动，并显示在中间。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #floater {
      float: left;
      height: 50%;
      margin-bottom: -120px;
    }

    #content {
      clear: both;
      height: 240px;
      position: relative;
    }

  </style>
</head>

<body>
  <div id="floater">
    <div id="content">Content here</div>
  </div>
</body>

</html>
```

### 第四种

这个方法使用了一个 position:absolute，有固定宽度和高度的 div。这个 div 被设置为 top:0; bottom:0;。

但是因为它有固定高度，其实并不能和上下都间距为 0，因此 margin:auto; 会使它居中。

使用 margin:auto;使块级元素垂直居中是很简单的。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      height: 240px;
      width: 70%;
    }

  </style>
</head>

<body>
  <div id="content"> Content here</div>
</body>

</html>
```

### 第五种

这个方法只能将单行文本置中。只需要简单地把 line-height 设置为那个对象的 height 值就可以使文本居中了。

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #content {
      height: 100px;
      line-height: 100px;
    }

  </style>
</head>

<body>
  <div id="content"> Content here</div>
</body>

</html>
```
# Flex布局，常用的几个属性值；

[Flex 布局详解 - Flex布局的常用属性](https://blog.csdn.net/weixin_41305441/article/details/90213419?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-4.control&dist_request_id=1328689.9934.16165720919716681&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-4.control)

任何东西都可以Flex布局；

包括行内元素：

```css
display:inline-flex | flex;
```

```css
.box {
  flex-wrap: nowrap | wrap | wrap-reverse;
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

它可能取5个值，具体对齐方式与轴的方向有关。下面假设主轴为从左到右。

- lex-start（默认值）：左对齐
- flex-end：右对齐
- center： 居中
- space-between：两端对齐，项目之间的间隔都相等。
- space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

align-items属性定义项目在交叉轴上如何对齐。

```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

它可能取5个值。具体的对齐方式与交叉轴的方向有关，下面假设交叉轴从上到下。

- flex-start：交叉轴的起点对齐。
- flex-end：交叉轴的终点对齐。
- center：交叉轴的中点对齐。
- baseline: 项目的第一行文字的基线对齐。
- stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

# 什么是BFC？看这一篇就够了

[什么是BFC？看这一篇就够了](https://blog.csdn.net/sinat_36422236/article/details/88763187)

块格式化上下文，这么专业的术语，BFC, 哪些方式会创建 BFC 呢？

- 根元素（HTML）
- 浮动元素（float 不是 none 值）
- 绝对定位元素（position 值 为 absolute 或者 fixed）
- 行内块袁术（display: inline-block）
- 表格单元格（display: table-cell）
- 表格标题（display: table-caption）
- 匿名表格单元格元素（display: table, table-row, table-row-group, table-header-group, table-footer-group）
- overflow 计算值不为 visible 的元素
- display 值 为 flow-root 的元素
- contain 值为 layout,content, paint
- 弹性元素（display: flex|inline-flex）
- 网格元素（display: grid|inline-grid）
- 多容器（column-count 或者 column-width）不为 auto

### 产生的影响

1. 浮动定位和清除浮动时只会应用于同一个BFC内的元素。
2. 浮动不会影响到其他BFC种的元素的布局，
3. 清除浮动只能清除同一个BFC中在它前面的元素的浮动
4. 外边距折叠也只会发生在属于同一BFC的块级元素之间

### 利用 BFC 避免 margin 重叠

下面这个例子会发现，两个 p 标签的 margin-top + margin-bottom 应该是 60px, 结果只有 30px 说明重叠了。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible"
        content="ie=edge">
  <title>防止margin重叠</title>
</head>
<style>
  * {
    margin: 0;
    padding: 0;
  }

  p {
    color: #f55;
    background: yellow;
    width: 200px;
    line-height: 100px;
    text-align: center;
    margin: 30px;
  }

</style>

<body>
  <p>看看我的 margin是多少</p>
  <p>看看我的 margin是多少</p>
</body>

</html>

```

根据第 4 条，我们知道可以使用不同的 BFC 来避免 margin 的重叠

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>防止margin重叠</title>
</head>
<style>
    *{
        margin: 0;
        padding: 0;
    }
    p {
        color: #f55;
        background: yellow;
        width: 200px;
        line-height: 100px;
        text-align:center;
        margin: 30px;
    }
    div{
        overflow: hidden;
    }
</style>
<body>
    <p>看看我的 margin是多少</p>
    <div>
        <p>看看我的 margin是多少</p>
    </div>
</body>
</html>

```

### 自适应两栏布局

每个盒子的 margin box 的左边，与包含块 border box 的左边相接触（对于从左往右的格式化，否则相反）即使存在浮动也是如此。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    *{
        margin: 0;
        padding: 0;
    }
    body {
        width: 100%;
        position: relative;
    }
 
    .left {
        width: 100px;
        height: 150px;
        float: left;
        background: rgb(139, 214, 78);
        text-align: center;
        line-height: 150px;
        font-size: 20px;
    }
 
    .right {
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="left">LEFT</div>
    <div class="right">RIGHT</div>
</body>
</html>

```
又因为：BFC 的区域不会与 float box 重叠

所以我们让 right 单独成为一个 BFC

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    *{
        margin: 0;
        padding: 0;
    }
    body {
        width: 100%;
        position: relative;
    }
 
    .left {
        width: 100px;
        height: 150px;
        float: left;
        background: rgb(139, 214, 78);
        text-align: center;
        line-height: 150px;
        font-size: 20px;
    }
 
    .right {
        overflow: hidden;
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="left">LEFT</div>
    <div class="right">RIGHT</div>
</body>
</html>

```
### 清除浮动

当我们不给父节点设置高度，子节点设置浮动的时候，会发生高度塌陷，这个时候我们就要清除浮动。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible"
        content="ie=edge">
  <title>清除浮动</title>
</head>
<style>
  .par {
    border: 5px solid rgb(91, 243, 30);
    width: 300px;
  }

  .child {
    border: 5px solid rgb(233, 250, 84);
    width: 100px;
    height: 100px;
    float: left;
  }

</style>

<body>
  <div class="par">
    <div class="child"></div>
    <div class="child"></div>
  </div>
</body>

</html>
```
这个时候我们根据最后一条：

计算 BFC 的高度时，浮动元素也参与计算

给父节点激活 BFC

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>清除浮动</title>
</head>
<style>
    .par {
        border: 5px solid rgb(91, 243, 30);
        width: 300px;
        overflow: hidden;
    }
    
    .child {
        border: 5px solid rgb(233, 250, 84);
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
</html>

```
