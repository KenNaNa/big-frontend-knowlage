[Vue 组件 data 为什么必须是函数(分析源码，找到答案)](https://blog.csdn.net/Jioho_chen/article/details/106934607)

官方的解释为：

![](https://img-blog.csdnimg.cn/20200321154716763.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQzNTkyMDY0,size_16,color_FFFFFF,t_70#pic_center)

通俗的讲就是：

因为对象是一个引用数据类型，如果data是一个对象的情况下会造成所有组件共用一个data。

而当data是一个函数的情况下，每次函数执行完毕后都会返回一个新的对象，这样的话每个组件都会维护一份独立的对象（data）
