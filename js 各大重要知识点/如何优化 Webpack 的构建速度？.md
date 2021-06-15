# 如何优化 Webpack 的构建速度？
多进程/多实例构建：HappyPack(不维护了)、thread-loader

多进程并行压缩

webpack-paralle-uglify-plugin(不再维护)

uglifyjs-webpack-plugin 开启 parallel 参数 (不支持ES6)

terser-webpack-plugin 开启 parallel 参数(支持ES6)

DLL：

使用 DllPlugin 进行对第三方库分包提前打包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，通过 json 文件告诉webpack这些库提前打包好了，避免反复编译浪费时间。
HashedModuleIdsPlugin 可以解决模块数字id问题

充分利用缓存提升二次构建速度：

babel-loader 开启缓存

terser-webpack-plugin 开启缓存

使用 cache-loader 或者 hard-source-webpack-plugin

缩小构建目标/减少文件搜索范围：

exclude(不需要被解析的模块)/include(需要被解析的模块)

resolve.modules 告诉 webpack 解析模块时搜索的目录，指明第三方模块的绝对路径

resolve.mainFields 限定模块入口文件名，只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)

resolve.alias 当从 npm 包中导入模块时（例如，import * as React from 'react'），此选项将决定在 package.json 中使用哪个字段导入模块。根据 webpack 配置中指定的 target 不同，默认值也会有所不同
resolve.extensions 尽可能减少后缀尝试的可能性

noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)

IgnorePlugin (完全排除模块)

动态Polyfill

通过 Polyfill Service识别 User Agent，下发不同的 Polyfill，做到按需加载，社区维护。(部分国内奇葩浏览器UA可能无法识别，但可以降级返回所需全部polyfill)

Scope hoisting (「作用域提升」)

构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 把引入的 js 文件“提升到”它的引入者顶部，其实现原理为：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。因此只有那些被引用了一次的模块才能被合并。
必须是ES6的语法，因为有很多第三方库仍采用 CommonJS 语法和 Scope Hoisting 要分析模块之间的依赖关系，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的ES6模块化语法

提取页面公共资源：

使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中

使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件

基础包分离

Tree shaking

purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)

打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 开发中尽可能使用ES6 Module的模块，提高tree shaking效率

禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking

使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码
