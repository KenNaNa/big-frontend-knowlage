首先使用以下命令创建项目

```sh
yarn create @vitejs/app vue3-ts-vite2 --template vue-ts
```

# vite.config.js

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // 打包路径
  resolve: { // 解析
    alias: { // 重命名路劲
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 4000, // 服务端口
    open: true, // 是否自动打开浏览器
    host: 'localhost', // 主机名字
    proxy: { // 代理
      '/api': {
        target: '/api',
        changeOrigin: true,
        ws: false,
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
    cors: true
  }
})
```

# tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

# postcss.config.js

```js
module.exports = {
    "plugins": {
        "postcss-pxtorem": {
            rootValue: 37.5,
            // Vant 官方根字体大小是 37.5
            propList: ['*'],
            selectorBlackList: ['.norem']
            // 过滤掉.norem-开头的class，不进行rem转换
        }
    }
}
```

# package.json

```js
{
  "name": "vue3-vite2-ts",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "@types/node": "^14.14.37",
    "axios": "^0.21.1",
    "jsonwebtoken": "^8.5.1",
    "mockjs": "^1.1.0",
    "vant": "^3.0.11",
    "vue": "^3.0.10",
    "vue-router": "4",
    "vuex": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^1.1.5",
    "@vue/compiler-sfc": "^3.0.5",
    "postcss-pxtorem": "^6.0.0",
    "sass": "^1.32.8",
    "typescript": "^4.1.3",
    "vite": "^2.1.3",
    "vue-tsc": "^0.0.8"
  }
}
```

# index.html

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon"
        href="/favicon.ico" />
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>Vite App</title>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>

</html>
```

# src/api/request.ts

```js
import axios from 'axios'

const service = axios.create({ // 创建服务
    baseURL: '/api/',
    timeout: 5000
})

service.interceptors.request.use(config => { // 请求拦截处理
    const token = window.localStorage.getItem("accessToken")
    if (token) {
        config.headers.common.Authorization = token
    }
    return config
}, error => {
    return Promise.reject(error)
})

service.interceptors.response.use(response => { // 响应拦截处理
    const res = response.data
    if (response.status !== 200) {
        return Promise.reject(new Error(res.message || 'Error'))
    } else {
        return res
    }
}, error => {
    return Promise.reject(error)
})

export default service
```

# src/api/index.ts

```js
import type { AxiosPromise } from 'axios'
import request from './request'

// 获取首页banner新闻数据
export const getBannerList = (): AxiosPromise => {
    return request({
        url: '/bannerList'
    })
}

//  获取首页newsList数据
export const getNewsList = (): AxiosPromise => {
    return request({
        url: '/newsList'
    })
}

//获取newsDetail数据
export const getNewsDetail = (id: any): AxiosPromise => {
    return request.post('/detailList', {
        id
    })
}

// 登录验证
export const toLogin = (data: Object): AxiosPromise => {
    return request.post('/login', data)
}

export default {
    getBannerList,
    getNewsList,
    getNewsDetail,
    toLogin
}
```

# src/api/mock.ts

```js
import Mock from 'mockjs'
interface Data {
    id?: string | number,
    title?: string,
    images?: string | Array<string>,
    author?: string,
    token?: string
}

const bannerData: Array<Data> = [
    {
        "id": "1",
        "images": "./2021-02-27/1.jpg",
        "title": "翘屁美女"
    },
    {
        "id": "2",
        "images": "./2021-02-27/2.jpg",
        "title": "青春美女"
    },
    {
        "id": "3",
        "title": "翘屁美女",
        "images": "./2021-02-27/3.jpg",
    },
    {
        "id": "4",
        "title": "性感美女",
        "images": "./2021-02-27/4.jpg",
    },
    {
        "id": "5",
        "title": "哈哈美女",
        "images": "./2021-02-27/5.jpg",
    },
    {
        "id": "6",
        "title": "性感美女",
        "images": "./2021-02-27/6.jpg",
    },
    {
        "id": "7",
        "title": "爱笑美女",
        "images": "./2021-02-27/7.jpg",
    },
    {
        "id": "8",
        "title": "哈哈美女",
        "images": "./2021-02-27/8.jpg",
    },
    {
        "id": "9",
        "title": "爱笑美女",
        "images": "./2021-02-27/9.jpg",
    },
    {
        "id": "10",
        "title": "爱笑美女",
        "images": "./2021-02-27/10.jpg",
    },
    {
        "id": "11",
        "title": "爱笑美女",
        "images": "./2021-02-27/11.jpg",
    },
    {
        "id": "12",
        "title": "爱笑美女",
        "images": "./2021-02-27/12.jpg",
    },
    {
        "id": "13",
        "title": "爱笑美女",
        "images": "./2021-02-27/13.jpg",
    },
    {
        "id": "14",
        "title": "爱笑美女",
        "images": "./2021-02-27/14.jpg",
    },
    {
        "id": "15",
        "title": "爱笑美女",
        "images": "./2021-02-27/15.jpg",
    },
]

const newsData: Array<Data> = [
    {
        "id": "1",
        "images": ["../assets/logo.png"],
        "title": "金发碧眼为什么很少在白人以外的种族出现？",
        "author": "作者 / biokiwi"
    },
    {
        "id": "2",
        "title": "《哈利波特》原著中与电影中人物有哪些差别？",
        "author": "作者 / kalinnn",
        "images": ["../assets/logo.png"]
    },
    {
        "id": "3",
        "title": "有哪些适合情侣两个人一起玩的桌游？",
        "author": "作者 / 北邙",
        "images": ["../assets/logo.png"]
    }
]

const loginData: Data = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInVzZXJfaWQiOjEsImlhdCI6MTU5NDI2MjQ5NSwiZXhwIjoxNTk0MzQ4ODk1fQ.1MJ_MAFgpBjOjpggj69Xz8F_evBcMAenRK_7a8fdVrc"
}

Mock.mock('/api/bannerList', 'get', {
    "data": bannerData
})

Mock.mock('/api/newsList', 'get', {
    "data": newsData
})


Mock.mock('/api/login', 'post', {
    "data": loginData
})

```

# src/api/token.ts

```js
import jwt from 'jsonwebtoken'
const jwtScrect: string = "accessToken"
const genToken = (username: string, password: string): string => {
    const token: string = jwt.sign({ username, password }, jwtScrect, { expiresIn: '24h' })

    return token
}

export default {
    genToken
}
```

# src/components/Banner/index.vue

```html
<template>
  <div class="swipe-content">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" lazy-render>
      <van-swipe-item v-for="item in bannerData" :key="item.id">
        <img :src="item.images" class="img" :alt="item.title" @click="toDetail(item)" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import { useRouter } from "vue-router";
export default {
  name: "Banner",
  props: {
    bannerData: {
      type: Array
    }
  },
  setup(props) {
    const router = useRouter();
    const toDetail = item => {
      router.push({
        name: "Detail",
        params: {
          id: item.id,
          item: JSON.stringify(item)
        }
      });
    };

    return {
      toDetail
    };
  }
};
</script>
<style lang="scss" scoped>
.img {
  width: 100%;
  height: 100%;
}
.my-swipe {
  width: 100%;
}
.my-swipe .van-swipe-item {
  width: 100%;
  //   color: #fff;
  font-size: 1rem;
  //   line-height: 6rem;
  text-align: center;
  background-color: #fff;
}
</style>
```

# src/router/index.ts

```js
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        meta: {
            title: "首页",
            keepAlive: true,
            requireAuth: true
        },
        component: () => import("../views/Home/index.vue")
    },
    {
        path: '/select',
        name: 'Select',
        meta: {
            title: "选项",
            keepAlive: true,
            requireAuth: true
        },
        component: () => import("../views/Select/index.vue")
    },
    {
        path: '/detail/:id/:item',
        name: 'Detail',
        meta: {
            title: "选项",
            keepAlive: true,
            requireAuth: true
        },
        component: () => import("../views/Detail/index.vue")
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: "登录",
            keepAlive: true
        },
        component: () => import("../views/Login/index.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (window.localStorage.getItem('accessToken')) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
            window.localStorage.clear()
        }
    }
    else {
        next();
    }
})

export default router
```

# src/store/index.ts

```js
import { createStore } from 'vuex'
export default createStore({
    state: {
        listData: { 1: 10 },
        num: 10
    },
    mutations: {
        setData(state, value) {
            state.listData = value
        },
        addNum(state) {
            state.num = state.num + 10
        }
    },
    actions: {
        setData(context, value) {
            context.commit('setData', value)
        }
    },
    modules: {}
})

```

# src/utils/rem.ts

```js
import { stringifyQuery } from "vue-router"

const baseSize: number = 37.5

function setRem() {
    const scale: number = document.documentElement.clientWidth / 375
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}

setRem()

window.onresize = function () {
    setRem()
}
```

# src/views/Detail/index.vue

```js
<template>
  <div class="detail-wrap">
    <p class="title">{{item.title}}</p>
    <div class="img" v-for="(img, index) in item.imgs" :key="index">
      <img :src="img" class="img" />
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { reactive, toRefs, computed } from "vue";
export default {
  name: "Detail",
  setup(props) {
    interface Data {
      id?: string | Array<string>;
      item?: Object;
    }
    let data: Data = {
      id: "",
      item: Object
    };
    const state = reactive(data);

    const route = useRoute();
    const item = computed(() => route.params.item).value;
    state.id = computed(() => route.params.id).value;
    state.item = JSON.parse(item);

    return {
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped>
.detail-wrap {
  width: 100%;
  .title {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    color: #cccc;
    font-size: 20px;
    margin-block-start: 0;
    margin-block-end: 0;
    background-color: #2c323c;
  }
  .img {
    width: 100%;
    height: 100%;
  }
}
</style>

```

# src/views/Select/index.vue

```js
<template>
  <div class="select-wrap">
    <van-radio-group
      v-model="state.checked"
      direction="horizontal"
      :icon-size="30"
      @change="change"
    >
      <van-radio name="1">男</van-radio>
      <van-radio name="2">女</van-radio>
    </van-radio-group>
  </div>
</template>

<script lang="ts" setup="props">
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const state = ref({
  checked: ""
});
const { ctx } = getCurrentInstance();

const change = (e: string) => {
  const num = parseInt(e);
  switch (num) {
    case 1:
      console.log("男");
      ctx.$toast({
        type: "text",
        message: "暂无帅哥"
      });
      break;
    case 2:
      console.log("女");
      setTimeout(() => {
        router.push("/");
      }, 1000);
      break;
    default:
  }
};
</script>

<style lang="scss" scoped>
.select-wrap {
  width: 100%;
  height: 100%;
  background-color: #ebfff0;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  ::v-deep .van-radio__label {
    font-size: 30px;
  }
}
</style>
```

# src/views/Home/index.vue

```html
<template>
  <div class="home">
    <p class="text">美女图片预览</p>
    <banner :bannerData="state.bannerData"></banner>
    <van-loading color="#1989fa" v-if="state.loading" />
  </div>
</template>
<script lang="ts" setup="props">
import { reactive, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getBannerList } from "../../api/index";

const router = useRouter();
const store = useStore();

// 获取上下文对象
const { ctx } = getCurrentInstance();

// 定义响应式数据
const state = reactive({
  color: "#ccc",
  bannerData: [],
  loading: false
});

const initFN = () => {
  ctx.$toast({
    type: "fail",
    message: "请求失败"
  });
  state.loading = false;
};

// DOM 加载完成后更新数据
onMounted(() => {
  state.loading = true;
  getBannerList()
    .then(
      (res: any) => {
        state.loading = false;
        state.bannerData = res.data;
        ctx.$toast({
          type: "success",
          message: "请求成功"
        });
        console.log(res);
      },
      error => {
        initFN();
      }
    )
    .catch(error => {
      initFN();
    });
});
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
.text {
  color: v-bind("state.color");
  font-size: 20px;
  margin-block-start: 0;
  margin-block-end: 0;
  background-color: #2c323c;
}
.login {
  width: 100%;
  height: 100px;
  line-height: 100px;
  background-color: pink;
}
</style>
```

# src/views/Login/index.vue

```html
<template>
  <div class="login">
    <div class="passw-name-box">
      <div class="name">
        <i class="name-img"></i>
        <input v-model="state.userName" type="text" placeholder="请输入用户名" />
      </div>
      <div class="name">
        <i class="passw-img"></i>
        <input v-model="state.passWord" type="password" placeholder="请输入密码" />
      </div>
      <div>
        <van-button type="primary" @click="login">登录</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup="props">
import { reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { toLogin } from "../../api/index";
const router = useRouter();

const { ctx } = getCurrentInstance();

const state = reactive({
  userName: "",
  passWord: ""
});

const initError = () => {
  ctx.$toast({
    type: "fail",
    message: "登录失败"
  });
  window.localStorage.clear();
  router.push("/login");
};

const login = async () => {
  if (!state.userName) {
    ctx.$toast({
      type: "text",
      message: "请输入用户名"
    });
    return;
  }

  if (!state.passWord) {
    ctx.$toast({
      type: "text",
      message: "请输入密码"
    });
    return;
  }
  toLogin({ userName: state.userName, passWord: state.passWord })
    .then(
      res => {
        ctx.$toast({
          type: "success",
          message: "登录成功"
        });

        // 设置 token
        window.localStorage.setItem("accessToken", res.data.token);
        console.log("res===>", res);
        router.push("/select");
      },
      error => {
        initError();
      }
    )
    .catch(error => {
      initError();
    });
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  background: url("./login/bgimg.jpg") no-repeat;
  background-size: 100% 100%;
  background-position: 100% 100%;
  .passw-name-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .name {
      display: flex;
      justify-content: center;
      padding: 5px 10px;
      input {
        width: 250px;
        height: 32px;
        outline: none;
        border: none;
        font-size: 16px;
        margin-left: 10px;
      }
      .name-img {
        display: block;
        width: 32px;
        height: 32px;
        background: url("./login/sno.png") no-repeat;
        background-size: 100% 100%;
      }
      .passw-img {
        display: block;
        width: 32px;
        height: 32px;
        background: url("./login/pasw.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
```

# 

# src/App.vue

```html
<template>
  <div style="height: 100%;">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App"
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* width: 100%; */
  height: 100%;
}
html,
body {
  height: 100%;
  /* width: 100%; */
  overflow-x: hidden;
}
</style>
```

# src/main.ts

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'vant/lib/index.css'
import vant from 'vant'

import { Toast } from 'vant'
import "./utils/rem"
import './api/mock'
import Banner from "./components/Banner/index.vue"
const app = createApp(App)
app.component('banner', Banner).use(router).use(store).use(vant).mount('#app')
app.config.globalProperties = {
    "$toast": Toast,
}
```


# src/shims-vue.d.ts

```js
declare module '*.vue' { // 定义 .vue 文件模块
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'mockjs' // 定义 mockjs 模块
declare module 'jsonwebtoken' // 定义 jsonwebtoken 模块
```



