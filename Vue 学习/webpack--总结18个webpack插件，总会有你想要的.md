# webpack--总结18个webpack插件，总会有你想要的
[webpack--总结18个webpack插件，总会有你想要的](https://blog.csdn.net/wenmin1987/article/details/107013532?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-14.control&dist_request_id=1328740.39617.16170043428176547&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-14.control)

何为插件(Plugin)？专注处理 webpack 在编译过程中的某个特定的任务的功能模块，可以称为插件。

Plugin 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务。

Plugin 的特点

- 是一个独立的模块

- 模块对外暴露一个 js 函数

- 函数的原型 (prototype) 上定义了一个注入 compiler 对象的 apply方法 apply 函数中需要有通过 compiler 对象挂载的 webpack 事件钩子，钩子的回调中能拿到当前编译的 compilation 对象，如果是异步编译插件的话可以拿到回调 callback

- 完成自定义子编译流程并处理 complition 对象的内部数据

- 如果异步编译插件的话，数据处理完成后执行 callback 回调。

下面介绍 18 个常用的 webpack 插件。

# HotModuleReplacementPlugin

模块热更新插件。Hot-Module-Replacement 的热更新是依赖于 webpack-dev-server，后者是在打包文件改变时更新打包文件或者 reload 刷新整个页面，HRM 是只更新修改的部分。

HotModuleReplacementPlugin是webpack模块自带的，所以引入webpack后，在plugins配置项中直接使用即可。

```js
const webpack = require('webpack')
 
plugins: [
  new webpack.HotModuleReplacementPlugin(), // 热更新插件
]
```

# html-webpack-plugin
生成 html 文件。将 webpack 中entry配置的相关入口 chunk 和 extract-text-webpack-plugin抽取的 css 样式 插入到该插件提供的template或者templateContent配置项指定的内容基础上生成一个 html 文件，具体插入方式是将样式link插入到head元素中，script插入到head或者body中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
 
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(__dirname, '/index.html'),
    minify: {
      // 压缩HTML文件
      removeComments: true, // 移除HTML中的注释
      collapseWhitespace: true, // 删除空白符与换行符
      minifyCSS: true, // 压缩内联css
    },
    inject: true,
  }),
]
```

inject 有四个选项值

- true：默认值，script 标签位于 html 文件的 body 底部

- body：script 标签位于 html 文件的 body 底部（同 true）

- head：script 标签位于 head 标签内

- false：不插入生成的 js 文件，只是单纯的生成一个 html 文件

多页应用打包

有时，我们的应用不一定是一个单页应用，而是一个多页应用，那么如何使用 webpack 进行打包呢。

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:6].js',
  },
  //...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件名
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', //打包后的文件名
    }),
  ],
}
```


