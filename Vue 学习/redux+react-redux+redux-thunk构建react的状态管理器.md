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



