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







