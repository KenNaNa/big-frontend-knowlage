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

