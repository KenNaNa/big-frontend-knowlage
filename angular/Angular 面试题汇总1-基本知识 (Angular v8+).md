# 关于Angular CLI
Angular CLI又称 Angular脚手架，用于快速生成项目或者组件的框架以提高效率。可以方便的生成angular app、component、service 等等， 并且可以通过参数，按照自己的需求去创建。可以说是angular开发必不可少的利器。
参考：https://cli.angular.io/

- ng generate: 新建component、service、pipe, class 等
- ng new: 新建angular app
- ng update: 升级angular自身，以及依赖
- ng version： 显示anuglar cli全局版本、以及本地的angular cli、angular code等的版本
- ng add: 新增第三方库。会做2件事，1）基于npm安装node_modules, 2）自动更改配置文件，保证新的依赖正常工作

# 关于angular的依赖注入（dependency injection）
依赖注入是Angular实现的一种应用程序设计模式， 是Angular的核心概念之一。

依赖就是具有一系列功能的服务(service)， 应用程序中的各种组件和指令（derictives）可能需要服务的功能。 Angular提供了一种平滑的机制，通过它我们可以将这些依赖项注入我们的组件和指令中。因此，我们只是在构建依赖关系，这些依赖关系可以在应用程序的所有组件之间注入。

使用依赖注入还有以下好处，

不需要实例化，（new 实例）。不需要关心class的构造函数里需要什么参数
一次注入（app module通过Providers注入），所有组件都可以使用。而且是用同一个service实例（Singleton），也就是说一个service里的数据是共分享的，可以用于组件间数据传递。

# Angular双向绑定
Angular双向绑定的原理
Angular的双向绑定，通过脏数据检查（Dirty checking）来实现。

脏值检测的基本原理是存储旧数值，并在进行检测时，把当前时刻的新值和旧值比对。若相等则没有变化，反之则检测到变化，需要更新视图。
angular2中有了Zone.js。对于setTimeout，addEventListener、promise等都在ngZone中执行（换句话说，就是被zone.js封装重写了），angular并在ngZone中setup了相应的钩子，通知angular2做相应的脏检查处理，然后更新DOM。

# Angular双向绑定效率问题
对于页面中需要绑定DOM元素极其多的情况（成百上千），必然会遇到效率问题。（具体还取决于PC、浏览器性能）。另外，脏检查超过10次（经验值？），就认为程序有问题，不再进行检查。
可以采用如下方式避免

对于只用于展示的数据，使用单向绑定，而不是双向绑定；
Angular的数据流是自顶而下，从父组件到子组件单向流动。单向数据流向保证了高效、可预测的变化检测。因而组件化也是提高性能的一种手段。
表达式（以及表达式所调用的函数）中少写太过复杂的逻辑
不要连接太长的 pipe（往往 pipe里都会遍历并且生成新数组, pipe 在anglarJS（v1）中叫做filter）
变化检测策略onPush. Angular有两种变化检测策略。Default是Angular默认的变化检测策略，也就是上述提到的脏检查（只要有值发生变化，就全部检查）。开发者可以根据场景来设置更加高效的变化检测方式：onPush。onPush策略，就是只有当输入数据的引用发生变化或者有事件触发时，组件才进行变化检测。
NgFor应该伴随trackBy方程使用。否则，每次脏值检测过程中，NgFor会把列表里每一项都执行更新DOM操作。

# Angular数据绑定的三种方式

```ts

<div>
    <span>Name {{item.name}}</span>  <!-- 1. 直接绑定 -->
    <span>Classes {{item | classPipe}}</span><!-- 2. pipe方式-->
    <span>Classes {{classes(item)}}</span><!-- 3.绑定方法调用的结果 -->
</div>
```

- 直接绑定： 大多数情况下，这都是性能最好的方式。
- 绑定方法调用的结果：在每个脏值检测过程中，classes方程都要被调用一遍。如果没有特殊需求，应尽量避免这种使用方式。
- pipe方式： 它和绑定function类似，每次脏值检测classPipe都会被调用。不过Angular给pipe做了优化，加了缓存，如果item和上次相等，则直接返回结果。

# 什么是angular的Module
模块(Module)是一个我们可以对组件(Component)，服务(service)和管道(pipe)进行分组的地方。 模块通过导出或隐藏这些元素来决定其他模块是否可以使用组件，指令等。 每个模块都使用@NgModule装饰器定义。

# Root Module和Feature Module的区别。
每个Angular应用程序只能有一个根模块(Root Module)，而它可以有一个或多个功能模块(Feature Module)。根模块导入BrowserModule，而功能模块导入CommonModule。

# Module 延迟加载（Lazy-loading）
当一个项目做得很大后，为了提高首屏加载速度，可以通过Lazy-loading，当访问到某些具体的url时，才加载那些不常用的feature module。

实现：正常创建feature module，修改路由配置。 例如：

```ts
const routes: Routes = [
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
  }
];
```

这样，编译后，这个feature module就会是一个独立的js，只有当用户访问url（~/customers）时，才会向server端请求这个独立的js，然后加载、执行。

参考https://angular.io/guide/lazy-loading-ngmodules

# 什么是指令（Directive）
指令（Directive）用于添加行为到已有元素（DOM）或者组件（Component）。
同时，一个元素或组件，可以应用多个指令。

# Promise 和 Observable的区别
首先新版本的anuglar是推荐使用Observable的(属于RxJS)，其次，对于Observable对象，可以使用.toPromise()转化为Promise对象。

- Promise,无论是否调用then。promise都会立即执行；而observables只是被创建，当调用(subscribe)的时候才会被执行。
- Promise返回一个值；Observable返回0至N个值。所以Promise对应的操作符是.then()，Observable对应的是.subscribe
- Observable，还额外支持map，filter，reduce和相似的操作符
- Observable 可以取消，Promise不可以

# 如果提高Angular的性能
Angular也还是网页应用，所以一般的提高网页西能的技巧都是通用的。针对Angular，还有一些特殊的优化技巧:

- AOT编译。之前提到过不要在客户端编译
- 应用程序已经最小化（uglify和tree shaking）
- 去掉不必要的import语句。如果有遗留，那么打包时也会打进来。
- 确保应用中已经移除了不使用的第三方库。同上。
- 项目较大时，考虑延迟载入(Lazy Loading), 保证首页的加载速度。
































