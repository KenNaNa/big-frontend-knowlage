vue3.0变快的原因

diff算法的优化

hoistStatic 静态提升

 vue2无论元素是否参与更新，每次都会重新创建，然后再渲染
 
 vue3对于不参与更新的元素，只会做静态提升，只会被创建一次，在渲染时直接复用
 
   3. cacheHandlers 事件监听缓存


默认情况下onclick会被视为动态绑定，所以每次都会追踪它的变化，但是因为是同一函数，所以没有追踪变化，直接缓存起来就行

   4. ssr渲染
    

composition API的本质

只是上就是把暴露出去的方法跟函数注入到options api中的data跟methods里面去

setup函数执行时机跟注意点

执行时机： beforeCreate-> setup -> Created

beforeCreate： 组件刚刚创建，data跟methods还没有初始化好

Created: data跟methods初始化完成

注意点： 执行setup的时候还没有初始化好data和methods,所以无法使用，为了避免我们错误使用，所以vue直接将setup中的this修改成为了undefined，setup只能是同步函数

reactive

reactive是vue3中提供的实现响应式数据的方法

vue2中提供defineProperty来实现

vue3中使用es6中的proxy来实现

注意点：

   reactive参数必须是对象（json/arr）,
   
    如果传递了其他对象：  
    
 默认情况下修改对象不会更新界面
 
如果想更新，必须重新赋值
