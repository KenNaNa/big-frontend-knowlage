# TodoList 入门探索

## 实验介绍

在本章节实验中，你将会学习到如何从如何安装升级 vue-cli4.4.6，学会如何将 vue2.x 项目升级到 vue3.0，从TodoList入门探索 vue3.0


####  知识点 

- 环境搭建
- 项目创建
- 项目版本升级
- todoList 案例

#### Vue介绍

Vue是用于构建用户界面的渐进框架，具有全家桶 vue-router路由管理，vuex 仓库数据管理，axios 请求库等，Vue3.0 在 Vue2.x 的基础做了一些改进，以及优化，是国内最受欢迎的前端框架之一，给前端开发人员带来了便捷式开发，同学们可以在 [Vue.js 3.0文档：测试版](https://v3.vuejs.org/guide/introduction.html) 看到最新版的 Vue 文档



## 准备环境
#### node 环境测试

在开始工作之前我们需要测试一下环境，我们先使用 Web IDE，请同学使用一下按住键盘组合以下命令 **ctrl + `**，打开我们 IDE 的 控制台，输入以下命令，就会出现 node 版本

```js
node -v
```

![node-v](E:\前端学习\big-frontend-knowlage\code\img\node-V.png)

如果出现版本号，说明环境已经安装，如果没有出现版本号，说明环境没有安装，我们需要到    node  官网进行下载对应的系统的 node 安装包，这里附上 node 的官网，同学们自行安装 [Node.js 中文官网](http://nodejs.cn/download/)                             

![Node.js 安装包](E:\前端学习\big-frontend-knowlage\code\img\node.png)

#### vue 环境测试

同样我们输入以下命令

```vue
vue -V
```

我们发现实验环境的 vue-cli 版本为 3.11.0

![vue-cli-v](E:\前端学习\big-frontend-knowlage\code\img\Vue.png)

明显不符合我们的要求，所以我们要升级一下 vue-cli，同学们输入以下命令，先卸载 vue-cli 

```vue
npm uninstall @vue/cli
```

再重新安装 vue-cli 

```vue
npm install @vue/cli -g
```

然后我们再次输入以下命令

```vue
vue -V
```

发现 vue-cli 升级到了 4.4.6 版本

![vue-cli-v4.4.6](E:\前端学习\big-frontend-knowlage\code\img\vue-V.png)

ok，至此我们的环境已经准备好了，万事俱备只欠东风了，接下来我们就来搭建一个 vue 初始化项目



## 项目创建

首先我们新建一个 code 目录，我们进入 code 的目录

![cd-code](E:\前端学习\big-frontend-knowlage\code\img\cd-code.png)

输入以下命令

```vue
vue create .
```

我们选择我们需要的选项

- Babel es6 转换器
- Router 路由
- Vuex 仓库
- CSS Pre-processors 样式预处理器
- Linter/Formatter 格式化

![select](E:\前端学习\big-frontend-knowlage\code\img\vue-create-code.png)

然后一步步回车，所有输入都选择输入`y`，在`CSS Pre-processors`预处理器那里选择 `node-sass`安装即可，进入项目创建

![create-pro](E:\前端学习\big-frontend-knowlage\code\img\Snipaste_2020-07-28_23-03-39.png)

创建之后，我们去看看 vue2.x 目录结构

![code](E:\前端学习\big-frontend-knowlage\code\img\Snipaste_2020-07-28_23-07-49.png)

此时的`package.json`

```json
{
  "name": "code",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^2.6.11",
    "vue-router": "^3.2.0",
    "vuex": "^3.4.0"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^4.4.0",
    "@vue/cli-plugin-eslint": "^4.4.0",
    "@vue/cli-service": "^4.4.0",
    "babel-eslint": "^10.1.0",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^6.2.2",
    "node-sass": "^4.12.0",
    "sass-loader": "^8.0.2",
    "vue-template-compiler": "^2.6.11"
  }
}
```

在这个基础之上，我们来将此项目进行代码升级，升级到我们 Vue3.0 版本，同学们输入以下命令

```vue
vue add vue-next
```

![](E:\前端学习\big-frontend-knowlage\code\img\vue-add-vue-next.png)

升级之后，我们再来看看`package.json`

```json
{
  "name": "code",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^3.0.0-beta.1",
    "vue-router": "^4.0.0-alpha.6",
    "vuex": "^4.0.0-alpha.1"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~4.4.0",
    "@vue/cli-plugin-eslint": "~4.4.0",
    "@vue/cli-plugin-router": "~4.4.0",
    "@vue/cli-plugin-vuex": "~4.4.0",
    "@vue/cli-service": "~4.4.0",
    "@vue/compiler-sfc": "^3.0.0-beta.1",
    "babel-eslint": "^10.1.0",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^7.0.0-alpha.0",
    "node-sass": "^4.12.0",
    "sass-loader": "^8.0.2",
    "vue-cli-plugin-vue-next": "~0.1.3"
  }
}
```

对比之后，我们发现 vue 项目已经升级完成了



