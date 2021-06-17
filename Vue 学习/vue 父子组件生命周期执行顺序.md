[vue 父子组件生命周期执行顺序](https://blog.csdn.net/qyl_0316/article/details/107505447)

我们已经非常熟悉单个的vue组件的生命周期执行顺序了，但是，如果有嵌套组件，父子组件的生命周期的执行顺序是什么？

当父子组件在加载的时候，执行的先后顺序为

父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

然后理解下这个顺序：

1.当父组件执行完beforeMount挂载开始后，会依次执行子组件中的钩子，直到全部子组件mounted挂载到实例上，父组件才会进入mounted钩子

2.子级触发事件，会先触发父级beforeUpdate钩子，再去触发子级beforeUpdate钩子，下面又是先执行子级updated钩子，后执行父级updated钩子

总结：

父组件先于子组件created，而子组件先于父组件mounted

父子组件加载渲染过程：

父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted

子组件更新：父beforeUpdate->子beforeUpdate->子updated->父updated

父组件更新过程：父beforeUpdate->父updated

销毁：父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
