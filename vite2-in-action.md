框架需要什么

- 请求封装
1. 处理基础 url
2. 响应处理
3. 请求处理

- 如何封装 sidebar
- 如何封装 面包屑
- 如何配置路由，权限控制，面包屑的控制问题



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
在 src/layout/components/SideBar 新建 Item.vue

```html
<template>
  <i v-if="icon" class="sub-el-icon" :class="icon"></i>
  <span v-if="title">{{ title }}</span>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuItem",
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
});
</script>

<style lang="scss" scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>

```
新建 Link.vue

```html
<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "utils/validate";
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return "a";
      }
      return "router-link";
    },
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: "_blank",
          rel: "noopener",
        };
      }
      return {
        to: to,
      };
    },
  },
};
</script>
```
新建 SidebarItem.vue

```html
<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template #title>
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <side-bar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script setup>
import Item from "./Item.vue";
import AppLink from "./Link.vue";
import { isExternal } from "utils/validate";
import { defineProps, ref } from "vue";
const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: "",
  },
});
const onlyOneChild = ref(null);
const hasOneShowingChild = (children = [], parent) => {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item;
      return true;
    }
  });
  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true;
  }
  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
};
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  return props.basePath + routePath;
};
</script>
```

新建 index.vue

```html
<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="false"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <side-bar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import SideBarItem from "./SideBarItem.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { routes } from "router/index";
import variables from "styles/variables.module.scss";
const activeMenu = computed(() => {
  const route = useRoute();
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>
```

修改 src/layouts/index.vue

```html
<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <side-bar class="sidebar-container"></side-bar>
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
import SideBar from "layout/components/Sidebar/index.vue";
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

修改  src/router/index.js

```html
import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from 'layout/index.vue';
export const routes = [
    {
        path: '/',
        name: 'layout',
        alwaysShow: true,
        component: Layout,
        meta: { title: '导航', icon: "el-icon-setting" },
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
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
```
添加 src/styles/index.scss

```scss
@import "./mixin.scss";
@import "./variables.module.scss";
@import "./sidebar.scss";

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
    font-family: Avenir,
        Helvetica,
        Arial,
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
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

新建 src/styles/sidebar.scss

```scss
#app {

    .main-container {
        min-height: 100%;
        transition: margin-left .28s;
        margin-left: $sideBarWidth;
        position: relative;
    }

    .sidebar-container {
        transition: width 0.28s;
        width: $sideBarWidth !important;
        background-color: $menuBg;
        height: 100%;
        position: fixed;
        font-size: 0px;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;

        // reset element-ui css
        .horizontal-collapse-transition {
            transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
        }

        .scrollbar-wrapper {
            overflow-x: hidden !important;
        }

        .el-scrollbar__bar.is-vertical {
            right: 0px;
        }

        .el-scrollbar {
            height: 100%;
        }

        &.has-logo {
            .el-scrollbar {
                height: calc(100% - 50px);
            }
        }

        .is-horizontal {
            display: none;
        }

        a {
            display: inline-block;
            width: 100%;
            overflow: hidden;
        }

        .svg-icon {
            margin-right: 16px;
        }

        .sub-el-icon {
            margin-right: 12px;
            margin-left: -2px;
        }

        .el-menu {
            border: none;
            height: 100%;
            width: 100% !important;
        }

        // menu hover
        .submenu-title-noDropdown,
        .el-submenu__title {
            &:hover {
                background-color: $menuHover !important;
            }
        }

        .is-active>.el-submenu__title {
            color: $subMenuActiveText !important;
        }

        & .nest-menu .el-submenu>.el-submenu__title,
        & .el-submenu .el-menu-item {
            min-width: $sideBarWidth !important;
            background-color: $subMenuBg !important;

            &:hover {
                background-color: $subMenuHover !important;
            }
        }
    }

    .hideSidebar {
        .sidebar-container {
            width: 50px !important;
        }

        .main-container {
            margin-left: 54px;
        }

        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;

            .el-tooltip {
                padding: 0 !important;

                .svg-icon {
                    margin-left: 20px;
                }

                .sub-el-icon {
                    margin-left: 19px;
                }
            }
        }

        .el-submenu {
            overflow: hidden;

            &>.el-submenu__title {
                padding: 0 !important;

                .svg-icon {
                    margin-left: 20px;
                }

                .sub-el-icon {
                    margin-left: 19px;
                }

                .el-submenu__icon-arrow {
                    display: none;
                }
            }
        }

        .el-menu--collapse {
            .el-submenu {
                &>.el-submenu__title {
                    &>span {
                        height: 0;
                        width: 0;
                        overflow: hidden;
                        visibility: hidden;
                        display: inline-block;
                    }
                }
            }
        }
    }

    .el-menu--collapse .el-menu .el-submenu {
        min-width: $sideBarWidth !important;
    }

    // mobile responsive
    .mobile {
        .main-container {
            margin-left: 0px;
        }

        .sidebar-container {
            transition: transform .28s;
            width: $sideBarWidth !important;
        }

        &.hideSidebar {
            .sidebar-container {
                pointer-events: none;
                transition-duration: 0.3s;
                transform: translate3d(-$sideBarWidth, 0, 0);
            }
        }
    }

    .withoutAnimation {

        .main-container,
        .sidebar-container {
            transition: none;
        }
    }
}

// when menu collapsed
.el-menu--vertical {
    &>.el-menu {
        .svg-icon {
            margin-right: 16px;
        }

        .sub-el-icon {
            margin-right: 12px;
            margin-left: -2px;
        }
    }

    .nest-menu .el-submenu>.el-submenu__title,
    .el-menu-item {
        &:hover {
            // you can use $subMenuHover
            background-color: $menuHover !important;
        }
    }

    // the scroll bar appears when the subMenu is too long
    >.el-menu--popup {
        max-height: 100vh;
        overflow-y: auto;

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
}
```

src/styles/variables.module.scss

```scss
// sidebar
$menuText:#bfcbd9;
$menuActiveText:#409EFF;
$subMenuActiveText:#f4f4f5; //https://github.com/ElemeFE/element/issues/12951

$menuBg:#304156;
$menuHover:#263445;

$subMenuBg:#1f2d3d;
$subMenuHover:#001528;

$sideBarWidth: 210px;

// the :export directive is the magic sauce for webpack
// https://www.bluematador.com/blog/how-to-share-variables-between-js-and-sass
:export {
    menuText: $menuText;
    menuActiveText: $menuActiveText;
    subMenuActiveText: $subMenuActiveText;
    menuBg: $menuBg;
    menuHover: $menuHover;
    subMenuBg: $subMenuBg;
    subMenuHover: $subMenuHover;
    sideBarWidth: $sideBarWidth;
}
```

src/utils/validate.js

```js
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
};
```

# eighth commit

安装 path-to-regexp

```js
yarn add path-to-regexp --save
```

src/layouts/components/Breadcrumb.vue

```html
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { compile } from "path-to-regexp";
import { reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const levelList = ref(null);
const router = useRouter();
const route = useRoute();
const getBreadcrumb = () => {
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  console.log("matched====>", matched);
  const first = matched[0];
  if (first.path !== "/") {
    matched = [{ path: "/home", meta: { title: "首页" } }].concat(matched);
  }
  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );

  console.log("levelList.value===>", levelList.value);
};
const pathCompile = (path) => {
  var toPath = compile(path);
  return toPath(route.params);
};
const handleLink = (item) => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect);
    return;
  }
  router.push(pathCompile(path));
};
getBreadcrumb();
watch(route, getBreadcrumb);
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
```

src/layouts/components/Navbar.vue

```html
<template>
  <div class="navbar">
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <!-- 右侧下拉菜单 -->
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

<script setup>
import Breadcrumb from "./Breadcrumb.vue";
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .breadcrumb-container {
    float: left;
  }

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

src/layouts/components/Sidebar/Link.vue

```html
<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup>
import { isExternal as isExt } from "utils/validate";
import { computed, defineProps } from "vue";
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});
const isExternal = computed(() => isExt(props.to));
// type是一个计算属性
const type = computed(() => {
  if (isExternal.value) {
    return "a";
  }
  return "router-link";
});
const linkProps = (to) => {
  if (isExternal.value) {
    return {
      href: to,
      target: "_blank",
      rel: "noopener",
    };
  }
  return { to };
};
</script>
```
src/router/index.js

```js
import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from 'layout/index.vue'

/**
 * Note: 子菜单仅当路由的children.length >= 1时才出现
 *
 * hidden: true                   设置为true时路由将显示在sidebar中(默认false)
 * alwaysShow: true               如果设置为true则总是显示在菜单根目录
 *                                如果不设置alwaysShow, 当路由有超过一个子路由时,
 *                                将会变为嵌套模式, 否则不会显示根菜单
 * redirect: noRedirect           如果设置noRedirect时，breadcrumb中点击将不会跳转
 * name:'router-name'             name用于<keep-alive> (必须设置!!!)
 * meta : {
    roles: ['admin','editor']    页面可访问角色设置 
    title: 'title'               sidebar和breadcrumb显示的标题 
    icon: 'svg-name'/'el-icon-x' sidebar中显示的图标
    breadcrumb: false            设置为false，将不会出现在面包屑中
    activeMenu: '/example/list'  如果设置一个path, sidebar将会在高亮匹配项
  }
 */
export const routes = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        meta: { title: "导航", icon: "el-icon-s-home" },
        children: [
            {
                path: "home",
                component: () => import('views/home/index.vue'),
                name: "Home",
                meta: { title: "首页", icon: "el-icon-s-home" },
                children: [
                    {
                        path: ":id",
                        component: () => import('views/detail/index.vue'),
                        name: "Detail",
                        hidden: true,
                        meta: { title: "详情", icon: "el-icon-s-home", activeMenu: '/home' },
                    },
                ]
            }
        ],
    },

    {
        path: "/a",
        component: Layout,
        children: [
            {
                path: "",
                component: () => import('views/home/index.vue'),
                name: "PageA",
                meta: { title: "页面A", icon: "el-icon-s-home" },
            }
        ],
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router
```

src/views/detail.vue
 
```html
<template>
  <div>
    detail <span>{{$route.params.id}}</span>
  </div>
</template>

<script setup>
  
</script>

<style scoped>
</style>
```


src/views/home.vue

```html
<template>
  <div>
    <HelloWorld msg="hello vue3 + vite"></HelloWorld>
    <router-link to="/home/1">detail1</router-link>
    <router-link to="/home/2">detail2</router-link>
    <router-view></router-view>
  </div>
</template>

<script setup>
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<style scoped>
</style>
```

# 请求封装

安装 axios

```js
yarn add axios --save
```

src/utils/request.js

```js
import axios from 'axios';

import { Message, Msgbox } from 'element3';

import store from 'store/index.js';

// 创建 axios 实例

const service = axios.create({
    // 在请求地址前面加上 baseURL
    baseURL: import.meta.env.VITE_BASE_API,
    // 当前发送跨域请求时携带 cookie
    withCredentials: true,
    timeout: 5000
});

// 请求拦截
service.interceptors.request.use(
    (config) => {
        // 指定请求令牌
        // if (store.getters.token) {
        // // 自定义令牌的字段名为X-Token，根据咱们后台再做修改
        // config.headers["X-Token"] = store.getters.token;
        // }
        config.headers["X-Token"] = "my token";
        return config;
    },
    (error) => {
        // 请求错误的统一处理
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * 通过判断状态码统一处理响应，根据情况修改
     * 同时也可以通过HTTP状态码判断请求结果
     */
    (response) => {
        const res = response.data;

        // 如果状态码不是20000则认为有错误
        if (res.code !== 20000) {
            Message.error({
                message: res.message || "Error",
                duration: 5 * 1000,
            });

            // 50008: 非法令牌; 50012: 其他客户端已登入; 50014: 令牌过期;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // 重新登录
                Msgbox.confirm("您已登出, 请重新登录", "确认", {
                    confirmButtonText: "重新登录",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    store.dispatch("user/resetToken").then(() => {
                        location.reload();
                    });
                });
            }
            return Promise.reject(new Error(res.message || "Error"));
        } else {
            return res;
        }
    },
    (error) => {
        console.log("err" + error); // for debug
        Message({
            message: error.message,
            type: "error",
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

export default service;
```

mock/test.js

```js
export default [{
    url: '/api/users',
    method: 'get',
    response: () => {
        return {
            code: 20000,
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

src/components/HelloWorld.vue

```html
<template>
  <h1>{{ msg }}</h1>
  <p>{{ $store.state.counter }}</p>
  <el-button @click="state.count++">count is: {{ state.count }}</el-button>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import request from "utils/request";
defineProps({
  msg: String,
});
const state = reactive({ count: 0 });
try {
  const users = await request("/users");
  console.log(users);
} catch (error) {
  console.log(error);
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
```

# 数据管理

mock/test.js

```js
const mockList = [
  { id: 1, name: "tom", age: 18 },
  { id: 2, name: "jerry", age: 18 },
  { id: 3, name: "mike", age: 18 },
  { id: 4, name: "jack", age: 18 },
  { id: 5, name: "larry", age: 18 },
  { id: 6, name: "white", age: 18 },
  { id: 7, name: "peter", age: 18 },
  { id: 8, name: "james", age: 18 },
];

module.exports = [
  {
    url: "/api/getUser",
    type: "get",
    response: () => {
      return {
        code: 20000,
        data: { id: 1, name: "tom", age: 18 },
      };
    },
  },
  {
    url: "/api/getUsers",
    type: "get",
    response: (config) => {
      // 从查询参数中获取分页、过滤关键词等参数
      const { page = 1, limit = 5 } = config.query;

      // 分页
      const data = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );

      return {
        code: 20000,
        data,
        total: mockList.length,
      };
    },
  },
  {
    url: "/api/addUser",
    type: "post",
    response: () => {
      // 直接返回
      return {
        code: 20000,
      };
    },
  },
  {
    url: "/api/updateUser",
    type: "post",
    response: () => {
      return {
        code: 20000,
      };
    },
  },
  {
    url: "/api/deleteUser",
    type: "get",
    response: () => {
      return {
        code: 20000,
      };
    },
  },
];
```

src/components/HelloWorld.vue

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
src/router/index.js

```js
import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "layout/index.vue";

/**
 * Note: 子菜单仅当路由的children.length >= 1时才出现
 *
 * hidden: true                   设置为true时路由将显示在sidebar中(默认false)
 * alwaysShow: true               如果设置为true则总是显示在菜单根目录
 *                                如果不设置alwaysShow, 当路由有超过一个子路由时,
 *                                将会变为嵌套模式, 否则不会显示根菜单
 * redirect: noRedirect           如果设置noRedirect时，breadcrumb中点击将不会跳转
 * name:'router-name'             name用于<keep-alive> (必须设置!!!)
 * meta : {
    roles: ['admin','editor']    页面可访问角色设置 
    title: 'title'               sidebar和breadcrumb显示的标题 
    icon: 'svg-name'/'el-icon-x' sidebar中显示的图标
    breadcrumb: false            设置为false，将不会出现在面包屑中
    activeMenu: '/example/list'  如果设置一个path, sidebar将会在高亮匹配项
  }
 */
export const routes = [
    {
        path: "/",
        redirect: "/home",
        component: Layout,
        meta: { title: "导航", icon: "el-icon-s-home" },
        children: [
            {
                path: "home",
                component: () => import("views/home/index.vue"),
                name: "Home",
                meta: { title: "首页", icon: "el-icon-s-home" },
                children: [
                    {
                        path: ":id",
                        component: () => import("views/detail/index.vue"),
                        name: "Detail",
                        hidden: true,
                        meta: {
                            title: "详情",
                            icon: "el-icon-s-home",
                            activeMenu: "/home",
                        },
                    },
                ],
            },
        ],
    },

    {
        path: "/users",
        component: Layout,
        meta: {
            title: "用户管理",
            icon: "el-icon-user-solid",
        },
        redirect: '/users/list',
        children: [
            {
                path: "list",
                component: () => import("views/users/list.vue"),
                meta: {
                    title: "用户列表",
                    icon: "el-icon-document",
                },
            },
            {
                path: "create",
                component: () => import("views/users/create.vue"),
                hidden: true,
                meta: {
                    title: "创建新用户",
                    activeMenu: "/users/list",
                },
            },
            {
                path: "edit/:id(\\d+)",
                name: "userEdit",
                component: () => import("views/users/edit.vue"),
                hidden: true,
                meta: {
                    title: "编辑用户信息",
                    activeMenu: "/users/list",
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
```
src/components/Detail.vue

```html
<template>
  <div class="container">
    <el-form ref="form" :model="model" :rules="rules">
      <el-form-item prop="name" label="用户名">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item prop="age" label="用户年龄">
        <el-input v-model.number="model.age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element3";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useItem } from "../model/userModel";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // 路由
    const route = useRoute();
    const { model, addUser, updateUser } = useItem(
      props.isEdit,
      route.params.id
    );
    const rules = reactive({
      // 校验规则
      name: [{ required: true, message: "用户名为必填项" }],
    });
    // 表单实例
    const form = ref(null);
    // 提交表单
    function submitForm() {
      // 校验
      form.value.validate((valid) => {
        if (valid) {
          // 提交
          if (props.isEdit) {
            updateUser().then(() => {
              // 操作成功提示信息
              Message.success({
                title: "操作成功",
                message: "更新用户数据成功",
                duration: 2000,
              });
            });
          } else {
            addUser().then(() => {
              // 操作成功提示信息
              Message.success({
                title: "操作成功",
                message: "新增玩家数据成功",
                duration: 2000,
              });
            });
          }
        }
      });
    }
    return {
      model,
      rules,
      form,
      submitForm,
    };
  },
};
</script>

<style scoped>
.container {
  padding: 10px;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
```

src/components/Pagination.vue

```html
<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      },
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:page", "update:limit", "pagination"],
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
    },
  },
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
```

src/views/users/list.vue

```html
<template>
  <div class="app-container">
    <div class="btn-container">
      <!-- 新增按钮 -->
      <router-link to="/users/create">
        <el-button type="success" icon="el-icon-edit">创建用户</el-button>
      </router-link>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column align="center" label="账户名" prop="name">
      </el-table-column>
      <el-table-column align="center" label="年龄" prop="age">
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope)"
            >更新</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-remove"
            @click="handleDelete(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="getList"
    ></pagination>
  </div>
</template>

<script>
import { toRefs } from "vue";
import { useRouter } from "vue-router";
import { Message } from "element3";
import Pagination from "comps/Pagination.vue";
import { useList } from "model/userModel";
export default {
  name: "UserList",
  components: {
    Pagination,
  },
  setup() {
    // 玩家列表数据
    const router = useRouter();
    const { state, getList, delItem } = useList();
    // 用户更新
    function handleEdit({ row }) {
      router.push({
        name: "userEdit",
        params: { id: row.id },
      });
    }
    // 删除玩家
    function handleDelete({ row }) {
      delItem(row.id).then(() => {
        // todo:删除这一行，或者重新获取数据
        // 通知用户
        Message.success("删除成功！");
      });
    }
    return {
      ...toRefs(state),
      getList,
      handleEdit,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.btn-container {
  text-align: left;
  padding: 0px 10px 20px 0px;
}
</style>
```

views/users/create.vue

```html
<template>
  <detail :is-edit="false"></detail>
</template>

<script>
import Detail from "comps/Detail.vue";
export default {
  components: {
    Detail,
  },
};
</script>
```

views/users/edit.vue

```html
<template>
  <detail :is-edit="true"></detail>
</template>

<script>
import Detail from "comps/Detail.vue";
export default {
  components: {
    Detail,
  },
};
</script>
```
src/model/userModel.js

```js
import { reactive, onMounted, ref } from "vue";
import request from "utils/request";

export function useList() {
    // 列表数据
    const state = reactive({
        loading: true, // 加载状态
        list: [], // 列表数据
        total: 0,
        listQuery: {
            page: 1,
            limit: 5,
        },
    });

    // 获取列表
    function getList() {
        state.loading = true;

        return request({
            url: "/getUsers",
            method: "get",
            params: state.listQuery,
        })
            .then(({ data, total }) => {
                // 设置列表数据
                state.list = data;
                state.total = total;
            })
            .finally(() => {
                state.loading = false;
            });
    }

    // 删除项
    function delItem(id) {
        state.loading = true;

        return request({
            url: "/deleteUser",
            method: "get",
            params: { id },
        }).finally(() => {
            state.loading = false;
        });
    }

    // 首次获取数据
    getList();

    return { state, getList, delItem };
}

const defaultData = {
    name: "",
    age: undefined,
};

export function useItem(isEdit, id) {
    const model = ref(Object.assign({}, defaultData));

    // 初始化时，根据isEdit判定是否需要获取玩家详情
    onMounted(() => {
        if (isEdit && id) {
            // 获取玩家详情
            request({
                url: "/getUser",
                method: "get",
                params: { id },
            }).then(({ data }) => {
                model.value = data;
            });
        }
    });

    const updateUser = () => {
        return request({
            url: "/updateUser",
            method: "post",
            data: model.value,
        });
    };

    const addUser = () => {
        return request({
            url: "/addUser",
            method: "post",
            data: model.value,
        });
    };

    return { model, updateUser, addUser };
}
```

# 配置多语言

安装 vue-i18n, @intlify/vite-plugin-vue-i18n

```js
yarn add vue-i18n --save
yarn add @intlify/vite-plugin-vue-i18n --save-dev
```

src/components/HelloWorld.vue

```html
<template>
  <h1>{{ msg }}</h1>
  <p>{{ $store.state.counter }}</p>
  <!-- 国际化 -->
  <form>
    <label>{{ t("language") }}</label>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="ja">ja</option>
    </select>
  </form>
  <p>{{ t("hello") }}</p>
  <el-button @click="state.count++">count is: {{ state.count }}</el-button>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { defineProps, reactive } from "vue";
defineProps({
  msg: String,
});
const state = reactive({ count: 0 });
const { locale, t } = useI18n({
  inheritLocale: true,
});
</script>

<i18n>
{
  "en": {
    "language": "Language",
    "hello": "hello, world!"
  },
  "ja": {
    "language": "言語",
    "hello": "こんにちは、世界！"
  }
}
</i18n>

<style scoped>
a {
  color: #42b983;
}
</style>

```

src/main.js

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

// i18n
import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";
const i18n = createI18n({
    legacy: false,
    locale: "en",
    messages,
});

createApp(App).use(element3).use(router).use(store).use(i18n).mount('#app');

```
vite.config.js

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';
import path from 'path';
import vueI18n from '@intlify/vite-plugin-vue-i18n'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({ supportTs: false }),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './src/locales/**')
    })
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
      "store": path.resolve(__dirname, "src/store"),
      "model": path.resolve(__dirname, "src/model")
    }
  }
});
```




