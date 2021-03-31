[面试官：Vue组件间通信方式都有哪些?](https://github.com/febobo/web-interview/issues/12)

![](https://camo.githubusercontent.com/8ed44b9c2d23d852edfbf34024cd34b10d10a3f3e3c9987f8be8f6c6937e9e2d/68747470733a2f2f7374617469632e7675652d6a732e636f6d2f37646535306432302d336163612d313165622d383566362d3666616337376330633962332e706e67)

# 一、组件间通信的概念
开始之前，我们把组件间通信这个词进行拆分

- 组件
- 通信

都知道组件是vue最强大的功能之一，vue中每一个.vue我们都可以视之为一个组件通信指的是发送者通过某种媒体以某种格式来传递信息到收信者以达到某个目的。广义上，任何信息的交通都是通信组件间通信即指组件(.vue)通过某种方式来传递信息以达到某个目的举个栗子我们在使用UI框架中的table组件，可能会往table组件中传入某些数据，这个本质就形成了组件之间的通信

# 二、组件间通信解决了什么
在古代，人们通过驿站、飞鸽传书、烽火报警、符号、语言、眼神、触碰等方式进行信息传递，到了今天，随着科技水平的飞速发展，通信基本完全利用有线或无线电完成，相继出现了有线电话、固定电话、无线电话、手机、互联网甚至视频电话等各种通信方式从上面这段话，我们可以看到通信的本质是信息同步，共享回到vue中，每个组件之间的都有独自的作用域，组件间的数据是无法共享的但实际开发工作中我们常常需要让组件之间共享数据，这也是组件通信的目的要让它们互相之间能进行通讯，这样才能构成一个有机的完整系统

# 二、组件间通信的分类
组件间通信的分类可以分成以下

- 父子组件之间的通信
- 兄弟组件之间的通信
- 祖孙与后代组件之间的通信
- 非关系组件间之间的通信
关系图:

![](https://camo.githubusercontent.com/41389964a4d8cb201f3c1c1c268d17d933c33f39b733333b16adf41cba636461/68747470733a2f2f7374617469632e7675652d6a732e636f6d2f38356239323430302d336163612d313165622d616239302d6439616538313462323430642e706e67)

# 三、组件间通信的方案
整理vue中8种常规的通信方案

- 通过 props 传递
- 通过 $emit 触发自定义事件
- 使用 ref
- EventBus
- $parent 或$root
- attrs 与 listeners
- Provide 与 Inject
- Vuex

### props传递数据

![](https://camo.githubusercontent.com/b7f08ff2fed277b55b66927cbfc6b4e749485aed8a5a1eb9c5af95d2b1e837db/68747470733a2f2f7374617469632e7675652d6a732e636f6d2f38663830613637302d336163612d313165622d616239302d6439616538313462323430642e706e67)

适用场景：
- 父组件传递数据给子组件
- 子组件设置props属性，定义接收父组件传递过来的参数
- 父组件在使用子组件标签中通过字面量来传递值

Children.vue

```html
props:{  
    // 字符串形式  
 name:String // 接收的类型参数  
    // 对象形式  
    age:{    
        type:Number, // 接收的类型为数值  
        defaule:18,  // 默认值为18  
       require:true // age属性必须传递  
    }  
}  
```

Father.vue组件

```js
<Children name="jack" age=18 /> 
```

### $emit 触发自定义事件

- 适用场景：子组件传递数据给父组件
- 子组件通过$emit触发自定义事件，$emit第二个参数为传递的数值
- 父组件绑定监听器获取到子组件传递过来的参数

Chilfen.vue

```js
this.$emit('add', good)  
```

Father.vue

```js
<Children @add="cartAdd($event)" />  
```

### ref
- 父组件在使用子组件的时候设置ref
- 父组件通过设置子组件ref来获取数据

父组件

```js
<Children ref="foo" />  
  
this.$refs.foo  // 获取子组件实例，通过子组件实例我们就能拿到对应的数据  
```

### EventBus

使用场景：
- 兄弟组件传值
- 创建一个中央时间总线EventBus
- 兄弟组件通过$emit触发自定义事件，$emit第二个参数为传递的数值
- 另一个兄弟组件通过$on监听自定义事件

Bus.js

```js
// 创建一个中央时间总线类  
class Bus {  
  constructor() {  
    this.callbacks = {};   // 存放事件的名字  
  }  
  $on(name, fn) {  
    this.callbacks[name] = this.callbacks[name] || [];  
    this.callbacks[name].push(fn);  
  }  
  $emit(name, args) {  
    if (this.callbacks[name]) {  
      this.callbacks[name].forEach((cb) => cb(args));  
    }  
  }  
}  
  
// main.js  
Vue.prototype.$bus = new Bus() // 将$bus挂载到vue实例的原型上  
// 另一种方式  
Vue.prototype.$bus = new Vue() // Vue已经实现了Bus的功能  
```

Children1.vue

```js
this.$bus.$emit('foo')  
```

Children2.vue

```js
this.$bus.$on('foo', this.handle) 
```

### $parent 或$ root

- 通过共同祖辈$parent或者$root搭建通信侨联


兄弟组件
```js
this.$parent.on('add',this.add)
```
另一个兄弟组件
```js
this.$parent.emit('add')
```

### $attrs 与$ listeners

适用场景：
- 祖先传递数据给子孙
- 设置批量向下传属性$attrs和 $listeners
- 包含了父级作用域中不作为 prop 被识别 (且获取) 的特性绑定 ( class 和 style 除外)。
- 可以通过 v-bind="$attrs" 传⼊内部组件

```html
// child：并未在props中声明foo  
<p>{{$attrs.foo}}</p>  
  
// parent  
<HelloWorld foo="foo"/>  
```

```html
// 给Grandson隔代传值，communication/index.vue  
<Child2 msg="lalala" @some-event="onSomeEvent"></Child2>  
  
// Child2做展开  
<Grandson v-bind="$attrs" v-on="$listeners"></Grandson>  
  
// Grandson使⽤  
<div @click="$emit('some-event', 'msg from grandson')">  
{{msg}}  
</div>  
```

### provide 与 inject
- 在祖先组件定义provide属性，返回传递的值
- 在后代组件通过inject接收组件传递过来的值

祖先组件

```js
provide(){  
    return {  
        foo:'foo'  
    }  
} 
```

后代组件

```js
inject:['foo'] // 获取到祖先组件传递过来的值  
```

### vuex
适用场景: 

- 复杂关系的组件数据传递

- Vuex作用相当于一个用来存储共享变量的容器

![](https://camo.githubusercontent.com/c82de9bcf70e6fbacc3f9b64f32eb43b64f6d67b6c2fe809c83e36eaaed8ee2d/68747470733a2f2f7374617469632e7675652d6a732e636f6d2f66613230376364302d336163612d313165622d616239302d6439616538313462323430642e706e67)

- state用来存放共享变量的地方

- getter，可以增加一个getter派生状态，(相当于store中的计算属性），用来获得共享变量的值

- mutations用来存放修改state的方法。

- actions也是用来存放修改state的方法，不过action是在mutations的基础上进行。常用来做一些异步操作

### 小结
- 父子关系的组件数据传递选择 props  与 $emit进行传递，也可选择ref
- 兄弟关系的组件数据传递可选择$bus，其次可以选择$parent进行传递
- 祖先与后代组件数据传递可选择attrs与listeners或者 Provide与 Inject
- 复杂关系的组件数据传递可以通过vuex存放共享的变量

