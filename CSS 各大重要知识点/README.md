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


