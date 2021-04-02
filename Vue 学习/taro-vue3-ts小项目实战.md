[taro-ui-vue3](https://b2nil.github.io/taro-ui-vue3/docs/introduction.html)

# config/dev.js

```js
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {}
}
```

# config/prod.js

```js
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
```

# config/index.js

```js
const config = {
  projectName: 'taro-vue3',
  date: '2021-4-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'vue3',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui-vue3'],
    webpackChain(chain) {
      chain.resolve.alias
        .set(
          '@tarojs/components$',
          '@tarojs/components/dist-h5/vue3/index.js'
        )
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
```

# config/h5-building-script.js

请看这里的配置

[h5-building-script.js](https://b2nil.github.io/taro-ui-vue3/docs/quickstart.html)

# tsconfig.json

```js
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "removeComments": false,
    "preserveConstEnums": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "outDir": "lib",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strictNullChecks": true,
    "sourceMap": true,
    "baseUrl": ".",
    "rootDir": ".",
    "jsx": "react-jsx",
    "allowJs": true,
    "resolveJsonModule": true,
    "typeRoots": [
      "node_modules/@types",
      "global.d.ts"
    ]
  },
  "exclude": [
    "node_modules",
    "dist"
  ],
  "compileOnSave": false
}
```

# project.config.json

```js
{
  "miniprogramRoot": "./dist",
  "projectname": "taro-vue3",
  "description": "",
  "appid": "touristappid",
  "setting": {
    "urlCheck": true,
    "es6": false,
    "postcss": false,
    "minified": false
  },
  "compileType": "miniprogram"
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
  "name": "taro-vue3",
  "version": "1.0.0",
  "private": true,
  "description": "",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "sass"
  },
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "build:swan": "taro build --type swan",
    "build:alipay": "taro build --type alipay",
    "build:tt": "taro build --type tt",
    "build:h5": "node ./config/h5-building-script.js && taro build --type h5",
    "build:rn": "taro build --type rn",
    "build:qq": "taro build --type qq",
    "build:jd": "taro build --type jd",
    "build:quickapp": "taro build --type quickapp",
    "dev:weapp": "npm run build:weapp -- --watch",
    "dev:swan": "npm run build:swan -- --watch",
    "dev:alipay": "npm run build:alipay -- --watch",
    "dev:tt": "npm run build:tt -- --watch",
    "dev:h5": "npm run build:h5 -- --watch",
    "dev:rn": "npm run build:rn -- --watch",
    "dev:qq": "npm run build:qq -- --watch",
    "dev:jd": "npm run build:jd -- --watch",
    "dev:quickapp": "npm run build:quickapp -- --watch"
  },
  "browserslist": [
    "last 3 versions",
    "Android >= 4.1",
    "ios >= 8"
  ],
  "author": "",
  "dependencies": {
    "@babel/runtime": "^7.7.7",
    "@tarojs/components": "3.1.5",
    "@tarojs/runtime": "3.1.5",
    "@tarojs/taro": "3.1.5",
    "axios": "^0.21.1",
    "mockjs": "^1.1.0",
    "postcss-pxtorem": "^6.0.0",
    "taro-ui-vue3": "^1.0.0-alpha.19",
    "vant": "^3.0.11",
    "vue": "^3.0.0",
    "vue-router": "^4.0.5",
    "vuex": "^4.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.8.0",
    "@tarojs/mini-runner": "3.1.5",
    "@tarojs/webpack-runner": "3.1.5",
    "@types/webpack-env": "^1.13.6",
    "@typescript-eslint/eslint-plugin": "^4.15.1",
    "@typescript-eslint/parser": "^4.15.1",
    "@vue/compiler-sfc": "^3.0.0",
    "babel-preset-taro": "3.1.5",
    "eslint": "^6.8.0",
    "eslint-config-taro": "3.1.5",
    "eslint-plugin-vue": "^7.0.0",
    "stylelint": "9.3.0",
    "typescript": "^4.1.0",
    "vue-loader": "^16.0.0-beta.8"
  }
}
```

# global.d.ts

```js
declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

declare module ".vue"
declare module "vant"
declare module "mockjs"
declare module "axios"
declare module "vue-router"
declare module "vuex"
```

# babel.config.js

```js
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'vue3',
      ts: true
    }]
  ]
}
```

# src/api

跟 Vue3+Ts+Vite2 小项目实战一样

[ue3+ts+vite2小项目实战.md](https://github.com/KenNaNa/big-frontend-knowlage/blob/master/Vue%20%E5%AD%A6%E4%B9%A0/vue3%2Bts%2Bvite2%E5%B0%8F%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98.md)

# src/components/Banner/index.vue

```html
<template>
  <view class="swipe-content">
    <van-swipe class="my-swipe" :autoplay="2000" indicator-color="white" lazy-render>
      <van-swipe-item v-for="item in bannerData" :key="item.id">
        <img :src="item.images" class="img" :alt="item.title" @click="toDetail(item)" />
      </van-swipe-item>
    </van-swipe>
  </view>
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

# src/pages/login/

```js
// index.config.js
export default {
  navigationBarTitleText: '登录'
}

// index.scss
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  background: url("../../../public/login/bgimg.jpg") no-repeat;
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

      .at-input {
        padding: 0 0 !important;
      }

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
        background: url("../../../public/login/sno.png") no-repeat;
        background-size: 100% 100%;
      }

      .passw-img {
        display: block;
        width: 32px;
        height: 32px;
        background: url("../../../public/login/pasw.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}


// index.vue
<template>
  <view class="login">
    <view class="passw-name-box">
      <view class="name">
        <i class="name-img"></i>
        <AtInput name="userName" v-model:value="state.userName" type="text" placeholder="请输入用户名" />
      </view>
      <view class="name">
        <i class="passw-img"></i>
        <AtInput
          name="passWord"
          v-model:value="state.passWord"
          type="password"
          placeholder="请输入密码"
        />
      </view>
      <view>
        <van-button type="primary" @click="login">登录</van-button>
      </view>
    </view>
  </view>
</template>

<script>
import { reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { AtInput } from "taro-ui-vue3";
import { toLogin } from "../../api/index";
import Taro from "@tarojs/taro";
import "./index.scss";

export default {
  name: "Login",
  components: {
    AtInput
  },
  setup() {
    const router = useRouter();
    console.log("router", router);

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
      Taro.navigateTo({
        url: "pages/login/index"
      });
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
            ctx.$taro.navigateTo({
              url: "/pages/select/index"
            });
          },
          error => {
            initError();
          }
        )
        .catch(error => {
          initError();
        });
    };

    return {
      login,
      state
    };
  }
};
</script>
```

# src/pages/home/

```js
// index.config.js
export default {
    navigationBarTitleText: '首页'
}

// index.scss
.home {
  height: 100%;
}

.text {
  display: block;
  color: #ccc;
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
// index.vue

<template>
  <view class="home">
    <text class="text">美女图片预览</text>
    <banner :bannerData="state.bannerData"></banner>
    <van-loading color="#1989fa" v-if="state.loading" />
  </view>
</template>
<script lang="ts" setup="props">
import { reactive, onMounted, getCurrentInstance } from "vue";
import { getBannerList } from "../../api/index";
import "./index.scss";

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
        console.log("bannerData", state.bannerData);
        ctx.$toast({
          type: "success",
          message: "请求成功"
        });
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
```

# src/utils/rem.ts

```js
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

# app.config.ts

```js
export default {
  pages: [
    'pages/login/index',
    'pages/select/index',
    'pages/home/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
```

# app.ts

```js
import { createApp } from 'vue'
import './app.scss'
import "vant/lib/index.css";
import vant from 'vant'
import { Toast } from 'vant'
import Banner from './components/Banner/index.vue'
import './utils/rem'
import './api/mock'
import Taro from '@tarojs/taro'
const App = createApp({
  onShow(options) { },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(vant).component('banner', Banner)
App.config.globalProperties = {
  "$toast": Toast,
  "$taro": Taro
}
export default App

```
