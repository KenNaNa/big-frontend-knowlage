# js 各大重要知识点

# 搞懂同源策略

# 搞懂浏览器同源策略

本文会从以下几个方面讲述同源策略：
- 第一点 `what`：什么是同源策略
- 第二点 `why`：为什么需要同源策略
- 第三点 `how`：如何解决经典的跨域问题

# 什么是同源策略
什么是同源策略呢？通常一个概念出来之后，我会从生活的实际例子找到解析，你可以想象一下，假如你们家的房子，是不是不允许陌生人进入，如果可以随便进入，那么久有可能被盗了，那么这个时候，锁头和钥匙就出现了为了保证家的安全。

所以我们引出浏览器的同源策略，就是指必须在同一个协议，域名，端口号下，而且三者必须一致的。这个时候，我们就说是同源。

举个例子：
```js
https://www.angular.cn:80/guide/inputs-outputs
```
- `http://` 是我们所说的协议。
- `www.angular.cn` 是我们所说的域名。
- `80` 表示端口号。

所以就会牵引出一个问题，不同源的数据交互问题，
如果是以下两个链接交互数据，可以通过同源策略的检测：
```js
https://www.angular.cn:80/guide/inputs-outputs
https://www.angular.cn:80/guide/index
```

而如果是以下这样的链接交互数据，则不能通过同源策略的检测：
```js
http://www.child.a.com/test/index.html ----失败，域名不同
https://www.a.com/test/index.html ----失败，协议不同
http://www.a.com:8080/test/index.html ----失败，端口号不同
```

# 有哪些是不受同源策略限制

- 页面上的链接，比如 `a` 链接。
- 重定向。
- 表单提交。
- 跨域资源的引入，比如：`script`, `img`, `link`, `iframe`。

# 解决跨域问题

既然有同源策略的限制，那么就会产生跨域问题，就是指不同源的脚本在数据交互的时候，会报错，这个过程就是跨域。

那么有什么解决方案？

- JSONP 解决跨域
- CORS 解决跨域

总的来说，这连个比较经典，其他的也没有详细研究，上面两个方案，工作中比较常用，所以先讲讲上面的方案。

### JSONP 解决跨域
什么是 JSONP，举个例子，就是 a.com/jsonp.html 想要获取 b.com/main.js 的数据，这个时候由于浏览器同源策略，是获取不到数据的，所以我们可以在 a.com/jsonp.html 创建一个 `script` 脚本，http://b.com/main.js?callback=xxx。在main.js中调用这个回调函数xxx，并且以JSON数据形式作为参数传递，完成回调。我们来看看代码：

```js
// a.com/jsonp.html中的代码
  function addScriptTag(src) { 
       var script = document.createElement('script'); 
       script.setAttribute("type","text/javascript"); 
       script.src = src; 
      document.body.appendChild(script);
  }
  window.onload = function () { 
      addScriptTag('http://b.com/main.js?callback=foo');
  } //window.onload是为了让页面加载完成后再执行
  function foo(data) { 
        console.log(data.name+"欢迎您");
  };

//b.com/main.js中的代码
foo({name:"hl"})
```
存在以下几点问题：
- 只能使用 GET 请求方式，无法使用 POST 请求方式。
- 可能被注入恶意代码，篡改页面内容，可以采用字符串过滤来规避此问题。

### CORS 解决跨域

CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。
刚才的例子中，在b.com里面添加响应头声明允许a.com的访问，代码：
```js
Access-Control-Allow-Origin: http://a.com
```
然后a.com就可以用ajax获取b.com里的数据了。

# redux+react-redux+redux-thunk构建react的状态管理器

在此处说说 redux 与 react-redux 的区别：

- redux 就是一个数据仓库管理器，类似与 vuex

- react-redux 是对 redux 进行优化，是将 redux 中的 state, dispatch 映射到顶层的 props 属性上面

# 项目结构

![image.png](http://image.huawei.com/tiny-lts/v1/images/0e25b33f6d81ab99b8e4ac590cc99db5_894x618.png@900-0-90-f.png)

# 用到的具体插件

```js
yarn install redux react-redux redux-thunk --save
```

# 动作类型静态变量

```js
// redux/constant/index.js
const constant = {
    ADD: "ADD", // 加一操作
    REDUCE: "REDUCE", // 减一操作
    ADD_MSG: "ADD_MSG", // 添加 msg
    DEL_MSG: "DEL_MSG" // 删除 msg
};

export default constant;
```

# 操作 Store 的一些动作

```js
// redux/actions/action1.js
import constant from '../constants/index';

export const ADD = {
    type: constant.ADD
};

export const REDUCE = {
    type: constant.REDUCE
};

// redux/actions/action2.js
// 处理异步
import constant from '../constants/index';

export const ADD_MSG = msg => async (dispatch, getState) => dispatch({
    type: constant.ADD_MSG,
    payload: msg
});

export const DEL_MSG = msg => ({
    type: constant.DEL_MSG,
    payload: msg
});

```
# 返回 新的 state

由于 redux 规定需要返回新的 state，所以我们需要 reducer 来处理这个阶段

```js
// redux/reducers/modules/reducer1.js
export const reducer1 = (state = 123, action) => {
    switch (action.type) {
        case "ADD":
            return ++state;
        case "REDUCE":
            return state - 1;
        default:
            return state
    }
};

// redux/reducer/modules/reducer2.js
export default (state = [], action) => {
    switch (action.type) {
        case "ADD_MSG":
            return [...state, action.payload];
        case "DEL_MSG":
            return state.filter(item => item.msg !== action.payload);
        default:
            return state;
    }
};
```

# 创建 reducer

由于有很多个 reducer 模块，所以我们需要 combine 这些模块

```js
// redux/reducer/index.js
import { combineReducers } from 'redux';
import { reducer1 } from './modules/reducer1';
import reducer2 from './modules/reducer2';

export const reducer = combineReducers({
    reducer1,
    msg: reducer2
});
```
# 创建 Store

有了 reducer, state,action 这些，我们就需要将这些集成到 Store 里面

```js
// redux/store/index.js
import { createStore, compose, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import { reducer } from '../reducers/index';

export const store = createStore(
    reducer,
    compose(applyMiddleware(thunk))
);
```
# 接下来就是 react-redux 

接下来我们需要将 这些 state, dispatch 映射到我们顶层组件 props 属性，这样我们就能在子组件访问了

```js
// src/views/Home.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ADD, REDUCE } from '../redux/actions/action1';
import { ADD_MSG, DEL_MSG } from '../redux/actions/action2';
```

首先导入我们需要的一些列动作类型


# 创建 Home 组件

这个 Home 组件实现加一，减一操作，以及添加 msg, 删除 msg 操作

```js
class Home extends Component {
    state = {
        msg: ""
    }
    onInput = (e) => {
        this.setState({
            msg: e.target.value
        })
    }

    addMsg = () => {
        const msg = {
            msg: this.state.msg
        }
        console.log("msg===>", msg)
        this.props.addMsg(msg)
        this.setState({
            msg: ""
        })
    }

    delMsg = (msg) => {
        this.props.delMsg(msg);
    }

    render() {
        return (
            <div>
                <p>{this.props.num}</p>
                <button onClick={this.props.addNum}>加一</button>
                <button onClick={this.props.reduceNum}>减一</button>
                {
                    this.props.msg.map((item, index) => {
                        return (
                            <p onClick={this.props.delMsg.bind(this, item)} key={index}>{item.msg}</p>
                        )
                    })
                }
                <input type="text" value={this.state.msg} onChange={(e) => this.onInput(e)} />
                <button onClick={this.addMsg}>添加一条消息</button>
            </div>
        )
    }
};
```

# 将 state, dispatch 映射到 props 属性上面

```js
// src/views/Home.js

const mapStateToProps = (state, ownProps) => {
    console.log("mapStateToProps", ownProps)
    return {
        num: state.reducer1,
        msg: state.msg
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    console.log("mapDispatchToProps", ownProps)
    return {
        addNum: () => dispatch(ADD),
        reduceNum: () => dispatch(REDUCE),
        addMsg: (msg) => dispatch(ADD_MSG(msg)),
        delMsg: (msg) => dispatch(DEL_MSG(msg))
    }
}
```

# 然后需要使用 connect 来链接组件

```js
export default connect(mapStateToProps, mapDispatchToProps)(Home);
```

# 最后就是使用组件的阶段了

```js
// src/App.js
import { Provider } from 'react-redux';
import { store } from './redux/store/index';
import Home from './views/Home';

function App(){
	reeturn (
   		<Provider store={store}>
      <Home />
    </Provider> 
   )
}
```
![image.png](http://image.huawei.com/tiny-lts/v1/images/7bd3e36aa0a333811fed1eb55879b06f_407x95.png@900-0-90-f.png)



