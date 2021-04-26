- mockjs 用于模拟数据的插件
- @vitejs/plugin-vue-jsx 支持 jsx 的插件
- cross-env 配置多种环境

# first commit 

使用 `yarn create @vitejs/app vite2-in-action --template vue` 来创建自己的 vue 项目

安装依赖插件

```json
"dependencies": {
  "js-yaml": "^4.0.0",
  "mockjs": "^1.1.0",
  "vue": "^3.0.5"
},
```

```json
"devDependencies": {
  "@vitejs/plugin-vue": "^1.0.4",
  "@vitejs/plugin-vue-jsx": "^1.0.2",
  "@vue/compiler-sfc": "^3.0.5",
  "cross-env": "^7.0.3",
  "vite": "^2.0.0-beta.12",
  "vite-plugin-mock": "^2.0.0-beta.3"
}
```

在项目根目录下创建 mock 目录

#### test.js

```js
export default [{
    url: '/api/users',
    method: 'get',
    response: () => {
        return {
            code: 0,
            data: [
                {
                    name: '小仙女',
                    age: 18
                },
                {
                    name: 'KenNaNa',
                    age: 20
                }
            ]
        };
    }
}];
```

使用 jsx 语法修改 App.vue

```jsx
<script setup lang="jsx">
import { defineComponent } from "vue";
import HelloWorld from "comps/HelloWorld.vue";
import logo from "./assets/logo.png";
export default defineComponent({
  render: () => (
    <>
      <img alt="Vue logo" src={logo} />
      <HelloWorld msg="Hello Vue 3 + Vite" />
    </>
  ),
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

配置 vite.config.js

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({ supportTs: true })
  ],
  alias: {
    "@": path.resolve(__dirname, "src"),
    "comps": path.resolve(__dirname, "src/components"),
    "api": path.resolve(__dirname, "src/api"),
    "views": path.resolve(__dirname, "src/views"),
    "styles": path.resolve(__dirname, "src/styles"),
    "locales": path.resolve(__dirname, "src/locales"),
    "layout": path.resolve(__dirname, "src/layout"),
    "utils": path.resolve(__dirname, "src/utils"),
    "dirs": path.resolve(__dirname, "src/dirs")
  }
});
```

# second commit 

修改 helloworld.vue 组件

```jsx
<template>
  <h1>{{ msg }}</h1>
  <button @click="state.count++">count is: {{ state.count }}</button>
</template>

<script setup>
import { defineProps, reactive } from "vue";

defineProps({
  msg: String,
});

const state = reactive({ count: 0 });
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
```

# third commit

安装 sass 插件，解析 scss 样式

```js
yarn add sass --save-dev
```

在 src 新建 styles 目录，样式配置

#### mixin.scss

```scss
@mixin clearfix {
    &::after {
        content: "";
        display: table;
        clear: both;
    }
}

@mixin scrollBar {
    &::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }
}

@mixin relative {
    position: relative;
    width: 100%;
    height: 100%;
}
```

#### index.scss

```scss
@import "./mixin.scss";

// 编写全局样式
body {
    height: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
        Microsoft YaHei, Arial, sans-serif;
    margin: 0;
}

label {
    font-weight: 700;
}

html {
    height: 100%;
    box-sizing: border-box;
}

#app {
    height: 100%;
}

*,
*:before,
*:after {
    box-sizing: inherit;
}

a:focus,
a:active {
    outline: none;
}

a,
a:focus,
a:hover {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
}

div:focus {
    outline: none;
}

.clearfix {
    &:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
}

// main-container global css
.app-container {
    padding: 20px;
}
```

在 main.js 中引入全局样式

```js
import "styles/index.scss";
```

# fourth commit 

安装 element3

```js
yarn add element3 --save
```

在 src 下新建 plugins/element3.js

```js
// 完整引入
// import element3 from "element3";
// import "element3/lib/theme-chalk/index.css";

// 按需引入
import "element3/lib/theme-chalk/button.css";
import {
    // ElRow,
    // ElCol,
    // ElContainer,
    // ElHeader,
    // ElFooter,
    // ElAside,
    // ElMain,
    // ElIcon,
    ElButton,
    // ElLink,
    // ElRadio,
    // ElRadioButton,
    // ElRadioGroup,
    // ElCheckbox,
    // ElCheckboxButton,
    // ElCheckboxGroup,
    // ElInput,
    // ElInputNumber,
    // ElSelect,
    // ElOption,
    // ElOptionGroup,
    // ElCascader,
    // ElCascaderPanel,
    // ElSwitch,
    // ElSlider,
    // ElTimePicker,
    // ElTimeSelect,
    // ElDatePicker,
    // ElUpload,
    // ElRate,
    // ElColorPicker,
    // ElTransfer,
    // ElForm,
    // ElFormItem,
    // ElTag,
    // ElProgress,
    // ElTree,
    // ElPagination,
    // ElBadge,
    // ElAvatar,
    // ElAlert,
    // ElLoading,
    // ElMenu,
    // ElMenuItem,
    // ElSubmenu,
    // ElMenuItemGroup,
    // ElTabs,
    // ElTabPane,
    // ElBreadcrumb,
    // ElBreadcrumbItem,
    // ElPageHeader,
    // ElDropdown,
    // ElDropdownItem,
    // ElDropdownMenu,
    // ElSteps,
    // ElStep,
    // ElDialog,
    // ElTooltip,
    // ElPopover,
    // ElPopconfirm,
    // ElCard,
    // ElCarousel,
    // ElCarouselItem,
    // ElCollapse,
    // ElCollapseItem,
    // ElTimeline,
    // ElTimelineItem,
    // ElDivider,
    // ElCalendar,
    // ElImage,
    // ElBacktop,
    // ElInfiniteScroll,
    // ElDrawer,
    // ElScrollbar,
} from "element3";

export default function useElement(app) {
    // 完整引入
    // app.use(element3)

    // 按需引入
    app.use(ElButton);
}
```

配置 plugins 目录

```js
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({ supportTs: false })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "comps": path.resolve(__dirname, "src/components"),
      "api": path.resolve(__dirname, "src/api"),
      "views": path.resolve(__dirname, "src/views"),
      "styles": path.resolve(__dirname, "src/styles"),
      "locales": path.resolve(__dirname, "src/locales"),
      "layout": path.resolve(__dirname, "src/layout"),
      "utils": path.resolve(__dirname, "src/utils"),
      "dirs": path.resolve(__dirname, "src/dirs"),
      "plugins": path.resolve(__dirname, "src/plugins")
    }
  }
});
```

在 main.js 引入组件

```js
import { createApp } from 'vue';
import App from './App.vue';

// 引入全局样式
import "styles/index.scss";

// 导入 element3
import useElement from 'plugins/element3.js';

const app = createApp(App);
useElement(app);
app.mount('#app');
```

修改 HelloWorld.vue 组件

```html
<template>
  <h1>{{ msg }}</h1>
  <el-button @click="state.count++">count is: {{ state.count }}</el-button>
</template>

<script setup>
import { defineProps, reactive } from "vue";

defineProps({
  msg: String,
});

const state = reactive({ count: 0 });
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
```

# five commit 

安装 vue-router

```js
yarn add vue-router@4.x --save
```

在 src 下新建 router 目录

在 src 下新建 views 目录

配置 vite.config.js

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({ supportTs: false })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "comps": path.resolve(__dirname, "src/components"),
      "api": path.resolve(__dirname, "src/api"),
      "views": path.resolve(__dirname, "src/views"),
      "styles": path.resolve(__dirname, "src/styles"),
      "locales": path.resolve(__dirname, "src/locales"),
      "layout": path.resolve(__dirname, "src/layout"),
      "utils": path.resolve(__dirname, "src/utils"),
      "dirs": path.resolve(__dirname, "src/dirs"),
      "plugins": path.resolve(__dirname, "src/plugins"),
      "config": path.resolve(__dirname, "src/config"),
      "router": path.resolve(__dirname, "src/router"),
      "store": path.resolve(__dirname, "src/store")
    }
  }
});

```
在 router 下新建 index.js

```js
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('views/home/index.vue')
        }
    ]
});

export default router;
```

在 views 目录下新建 home/index.vue

```html
<template>
  <div>
    <HelloWorld></HelloWorld>
  </div>
</template>

<script setup>
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<style scoped>
</style>
```

修改 plugins/element3.js
```js
// 完整引入
// import element3 from "element3";
// import "element3/lib/theme-chalk/index.css";

// 按需引入
import "element3/lib/theme-chalk/button.css";
import {
    // ElRow,
    // ElCol,
    // ElContainer,
    // ElHeader,
    // ElFooter,
    // ElAside,
    // ElMain,
    // ElIcon,
    ElButton,
    // ElLink,
    // ElRadio,
    // ElRadioButton,
    // ElRadioGroup,
    // ElCheckbox,
    // ElCheckboxButton,
    // ElCheckboxGroup,
    // ElInput,
    // ElInputNumber,
    // ElSelect,
    // ElOption,
    // ElOptionGroup,
    // ElCascader,
    // ElCascaderPanel,
    // ElSwitch,
    // ElSlider,
    // ElTimePicker,
    // ElTimeSelect,
    // ElDatePicker,
    // ElUpload,
    // ElRate,
    // ElColorPicker,
    // ElTransfer,
    // ElForm,
    // ElFormItem,
    // ElTag,
    // ElProgress,
    // ElTree,
    // ElPagination,
    // ElBadge,
    // ElAvatar,
    // ElAlert,
    // ElLoading,
    // ElMenu,
    // ElMenuItem,
    // ElSubmenu,
    // ElMenuItemGroup,
    // ElTabs,
    // ElTabPane,
    // ElBreadcrumb,
    // ElBreadcrumbItem,
    // ElPageHeader,
    // ElDropdown,
    // ElDropdownItem,
    // ElDropdownMenu,
    // ElSteps,
    // ElStep,
    // ElDialog,
    // ElTooltip,
    // ElPopover,
    // ElPopconfirm,
    // ElCard,
    // ElCarousel,
    // ElCarouselItem,
    // ElCollapse,
    // ElCollapseItem,
    // ElTimeline,
    // ElTimelineItem,
    // ElDivider,
    // ElCalendar,
    // ElImage,
    // ElBacktop,
    // ElInfiniteScroll,
    // ElDrawer,
    // ElScrollbar,
} from "element3";

export default function (app) {
    // 完整引入
    // app.use(element3)

    // 按需引入
    app.use(ElButton);
};
```
导入 main.js 
```js
import { createApp } from 'vue';
import App from './App.vue';

// 引入全局样式
import "styles/index.scss";

// 导入 element3
import element3 from 'plugins/element3.js';

// 导入路由
import router from "router/index.js";

const app = createApp(App);
app.use(router).use(element3).mount('#app');
```
修改 App.vue

```html
<template>
  <router-view></router-view>
</template>
```

# sixth commit

安装 vuex

```js
yarn add vuex@4.x --save
```

修改 components/HelloWorld.vue

```html
<template>
  <h1>{{ msg }}</h1>
  <p>{{ $store.state.counter }}</p>
  <el-button @click="state.count++">count is: {{ state.count }}</el-button>
</template>

<script setup>
import { defineProps, reactive } from "vue";

defineProps({
  msg: String,
});

const state = reactive({ count: 0 });
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
```

在 layout 新建 components/AppMain.vue

```html
<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppMain",
});
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>

```

在 layout 新建 components/NavBar.vue

```html
<template>
  <div class="navbar">
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="/src/assets/logo.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/57code/vite2-in-action/">
            <el-dropdown-item>我的Github</el-dropdown-item>
          </a>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
```

在 layout 目录下新建 index.vue

```html
<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container"></div>
    <!-- 内容容器 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <nav-bar />
      <!-- 内容区 -->
      <app-main />
    </div>
  </div>
</template>

<script setup>
import AppMain from "layout/components/AppMain.vue";
import NavBar from "layout/components/NavBar.vue";
</script>

<style lang="scss" scoped>
@import "styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
```

在 src 新建 store/index.js

```js
import { createStore } from 'vuex';
const store = createStore({
    state: {
        counter: 0
    }
});

export default store;
```

修改 plugin/element3.js

```js
// 完整引入
import element3 from "element3";
import "element3/lib/theme-chalk/index.css";

export default function (app) {
    // 完整引入
    app.use(element3);
};
```

修改 src/router/index.js

```js
import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from 'layout/index.vue';
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'layout',
            component: Layout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('views/home/index.vue'),
                    meta: {
                        title: "首页",
                        icon: 'el-icon-s-home'
                    }
                }
            ]
        }
    ]
});

export default router;
```

在 main.js

```js
import { createApp } from 'vue';
import App from './App.vue';

// 引入全局样式
import "styles/index.scss";

// 导入 element3
import element3 from 'plugins/element3.js';

// 导入路由
import router from "router/index.js";

// 导入仓库
import store from 'store/index.js';

const app = createApp(App);
app.use(router).use(store).use(element3).mount('#app');
```

# seventh commit 

安装 path

```js
yarn add path --save
```





















