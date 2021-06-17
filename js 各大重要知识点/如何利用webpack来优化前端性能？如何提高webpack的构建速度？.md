# 如何利用webpack来优化前端性能？如何提高webpack的构建速度？

1.压缩代码。删除多余的代码、注释、简化代码的写法等等方式。可以利用webpack的UglifyJsPlugin和ParallelUglifyPlugin来压缩JS文件， 利用cssnano（css-loader?minimize）来压缩css

2.利用CDN加速。在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。可以利用webpack对于output参数和各loader的publicPath参数来修改资源路径

3.删除死代码（Tree Shaking）。将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数--optimize-minimize来实现

4.提取公共代码。

# 如何提高webpack的构建速度？

1.多入口情况下，使用CommonsChunkPlugin来提取公共代码

2.通过externals配置来提取常用库

3.利用DllPlugin和DllReferencePlugin预编译资源模块 通过DllPlugin来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过DllReferencePlugin将预编译的模块加载进来。

4.使用Happypack 实现多线程加速编译

5.使用webpack-uglify-parallel来提升uglifyPlugin的压缩速度。 原理上webpack-uglify-parallel采用了多核并行压缩来提升压缩速度

6.使用Tree-shaking和Scope Hoisting来剔除多余代码

7.使用高版本的 Webpack 和 Node.js

8.图片压缩 配置image-webpack-loader

9.充分利用缓存提升二次构建速度
