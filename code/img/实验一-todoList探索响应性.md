---
show: step
version: 1.0
enable_checker: true
---

# `TodoList` 入门探索

## 实验介绍

在本章节实验中，你将会学习到如何从如何安装升级 `vue-cli4.4.6` ，学会如何将 `vue2.x` 项目升级到 `vue3.0` ，从 `TodoList` 入门探索  `vue3.0` 。

####  知识点 

- 环境搭建
- 项目创建
- 版本升级
- `todoList` 案例

## `Vue` 介绍

`Vue` 是用于构建用户界面的渐进框架，具有全家桶 `vue-router` 路由管理， `vuex`  仓库数据管理， `axios` 请求库等， `Vue3.0` 在  `Vue2.x`  的基础做了一些改进，以及优化，是国内最受欢迎的前端框架之一，给前端开发人员带来了便捷式开发，同学们可以在 [Vue.js 3.0文档：测试版](https://v3.vuejs.org/guide/introduction.html) 看到最新版的 `Vue` 文档 。

## 准备环境

### `node` 环境测试

在开始工作之前我们需要测试一下环境，我们先使用 `Web IDE` ，请同学使用一下按住键盘组合以下命令 **ctrl + `**，打开我们 `IDE` 的 控制台，输入以下命令，就会出现 `node` 版本 。

```js
node -v
```

![node-v](.\node-V.png)

如果出现版本号，说明环境已经安装，如果没有出现版本号，说明环境没有安装，我们需要到 `node` 官网进行下载对应的系统的 `node` 安装包，这里附上 `node` 的官网，同学们自行安装 [Node.js 中文官网](http://nodejs.cn/download/)   。                          

![Node.js 安装包](.\node.png)

### `vue` 环境测试

同样我们输入以下命令 。

```vue
vue -V
```

我们发现实验环境的 `vue-cli` 版本为 `3.11.0` 。

![vue-cli-v](.\Vue.png)

明显不符合我们的要求，所以我们要升级一下 `vue-cli` ，同学们输入以下命令，先卸载 `vue-cli`  。

```vue
npm uninstall @vue/cli
```

再重新安装 `vue-cli`  。

```vue
npm install @vue/cli -g
```

然后我们再次输入以下命令 。

```vue
vue -V
```

发现 `vue-cli` 升级到了 `4.4.6` 版本 。

![vue-cli-v4.4.6](.\vue-V.png)

ok，至此我们的环境已经准备好了，万事俱备只欠东风了，接下来我们就来搭建一个 `vue` 初始化项目 。

## 项目创建

首先我们新建一个 `code` 目录，我们进入 `code` 的目录 。

![cd-code](.\cd-code.png)

输入以下命令 。

```vue
vue create .
```

我们选择我们需要的选项 。

- `Babel es6` 转换器
- `Router`路由
- `Vuex` 仓库
- `CSS Pre-processors` 样式预处理器
- `Linter/Formatter` 格式化

![select](.\Snipaste_2020-07-29_22-19-11.png)

然后一步步回车，所有输入都选择输入 `y` ，在 `CSS Pre-processors` 预处理器那里选择 `node-sass` 安装即可，进入项目创建 。

![create-pro](.\Snipaste_2020-07-28_23-03-39.png)

创建之后，我们去看看 `vue2.x` 目录结构 。

![code](.\Snipaste_2020-07-28_23-07-49.png)

此时的 `package.json` 如下图所示，我们可以看到 `dependencies` 中关于 `vue` 是 `2.6.11` 版本的，`vue-router` 是 `3.2.0` 版本的， `vuex` 是 `3.4.0` 版本的 。

![](.\Snipaste_2020-08-01_21-40-30.png)



## 版本升级

在这个基础之上，我们来将此项目进行代码升级，升级到我们 `Vue3.0` 版本，同学们输入以下命令 。

```vue
vue add vue-next
```

![](.\vue-add-vue-next.png)

升级之后，我们再来看看 `package.json`，我们发现 `vue` 版本为 `3.0 beta`  ,  ` vue-router 4.0 alpha` ， `vuex 4.0 alpha` ， 多了 `@vue/compile-sfc ^3.0.0-beta.1`  `"eslint-plugin-vue": "^7.0.0-alpha.0"`  `"vue-cli-plugin-vue-next": "~0.1.3"`， 其中值得我们注意的是 `"vue-cli-plugin-vue-next": "~0.1.3"`  对比之后，我们发现 vue 项目已经升级完成了 。

![](.\Snipaste_2020-08-01_21-45-51.png)

## 案例

接下来同学们跟着我来实现一个简单的 `todoList` 名单清单列表，麻雀虽小，却可以让我们了解到 `vue3`  的 `reactive` 响应式与 `vue2.x`  `reactive` 响应式的区别，我们先新建一个 `todoList.vue`  , 可以实现性别，姓名输入，添加生成名单列表，对名单列表进行增删改，来了解我们 `vue3.x` 的响应式的强大之处 。 

###  新建模板

可以让用户输入姓名，性别

生成添加，编辑，更新，删除，清空按钮，我们在 `src/views` 目录新建 `TodoList.vue`

![](.\Snipaste_2020-08-03_15-06-21.png)

```html
<template>
  <div>
    <input type="text" v-model="name" placeholder="请输入名字" />
    &nbsp; &nbsp;
    <input type="text" v-model="sex" placeholder="请输入性别" />
    &nbsp; &nbsp;
    <button @click="add" v-if="index === null">添加</button>
    <button @click="update" v-else>更新</button>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <span>名字为：{{ item.name }}</span>
        &nbsp; &nbsp;
        <span>性别为：{{ item.sex }}</span>
        &nbsp; &nbsp;
        <button @click="edit(index)">编辑</button>
        &nbsp; &nbsp;
        <button @click="del(index)">删除</button>
      </li>
    </ul>
    <button @click="clear">清空数组</button>
  </div>
</template>
```

### 功能实现

定义操作的数据，以及操作的方法，

在 `vue2.x` 中 所有的数据都是定义在 `data()` 函数 `return` 一个 `object` 。

![](\Snipaste_2020-08-03_15-09-52.png)

```js
<scri.pt>
export default {
  name: "todoList",
  data() {
    return {
      list: [],
      name: "",
      sex: "",
      index: null
    };
  },
};
</script>
```

- `add` 添加操作，我们在输入框输入姓名，性别之后，点击添加按钮，下边就会生成一条姓名清单 

![](.\Snipaste_2020-08-03_15-11-28.png)

```js
<script>
export default {
  ...,
  methods: {
    add() {
      if (!this.name || !this.sex) {
        return;
      }
      this.list.push({
        name: this.name,
        sex: this.sex
      });
      this.name = "";
      this.sex = "";
    },
  }
};
</script>
```

![](.\Snipaste_2020-07-29_22-44-49.png)

- `edit` 编辑操作，我们点击编辑，下面的内容会出现在输入框中，这就是我们 `v-model` 指令的强大之处，在 `vue2.x` 中 `vue` 内部双向绑定的机制是用`Object.defineProperty()` 递归覆盖数据对象内所有属性的 `getter / setter` 。除了正常运行外，它还会在所有设置器中注入一个触发器，并在所有获取器中注入一个跟踪器。此外，它 `Dep` 每次都会在内部创建一个小实例，以记录所有依赖于此属性的计算 。



- 每当我们在属性中设置一个值时，它将调用 `setter`，该 `setter` 将重新评估 `Dep` 实例中的那些相关计算。然后，您可能会问我们如何记录所有相关的计算。事实是，每当我们定义一个 `watch` 函数或 `DOM` 更新函数之类的计算时，它都会首先运行一次-有时它作为初始化运行，有时只是空运行。在运行过程中，它将触碰其所依赖的吸气剂中的每个跟踪器。每个跟踪器会将当前的计算功能推入相应的 `Dep` 实例 。



- 因此，下一次当某些数据更改时，它将在对应的 `Dep` 实例中找出所有相关的计算，然后再次运行它们 。因此，这些计算的效果将自动更新 。

![](.\Snipaste_2020-08-03_15-13-02.png)

```js
edit(index) {
    let item = this.list[index];
    this.name = item.name;
    this.sex = item.sex;
    this.index = index;
    console.log(index);
},
```

![](.\Snipaste_2020-07-29_22-58-19.png)

- `update` 更新操作，我们是通过下表拿到元素对象，对元素的 `key` 值进行修改，我们知道如果是 `vue2.x` 我们这样做是不会及时更新到 `DOM`，是因为 `Object.defineProperty()` 局限性，没有及时更新到 `DOM` 上面，但是在 `vue3`，我们可以清楚的看到是及时响应上去的 。

![](.\Snipaste_2020-08-03_15-14-57.png)



```js
update() {
    if (!this.name || !this.sex) {
        return;
    }
    this.list[this.index].name = this.name;
    this.list[this.index].sex = this.sex;
    this.sex = "";
    this.name = "";
    this.index = null;
},
```

我们将性别`男`修改为性别 `女`，然后点击 `更新` 按钮，发现下面修改了 。

![](.\Snipaste_2020-07-29_23-02-55.png)

- `del` 删除操作

![](.\Snipaste_2020-08-03_15-16-07.png)

```js
del(index) {
    this.list.splice(index, 1);
    console.log(index);
},
```

点击删除之后，我们发现下面的姓名清单没有了 。

![](.\Snipaste_2020-07-29_23-06-33.png)

- `clear` 清空操作，我们先新建几个姓名清单

![](.\Snipaste_2020-08-03_15-17-46.png)

```js
clear() {
    this.list.length = 0
    // this.list = []
}
```

![](.\Snipaste_2020-07-29_23-08-16.png)

点击清空按钮按钮之后，我们发现所有数据都清空，如果我们使用的是 `vue2.x` 版本，我们会发现 `this.list.length = 0` 没有效果，下面的姓名清单没有被清空，只有我们这样设置的时候 `this.list = []` 才会被清空，这是为什么呢？

这是由于 `Object.defineProperty` 我们无法观察到某些数据更改，例如：

- 通过将值分配给某个索引来设置数组项。（例如 `arr[0] = value`）。
- 设置数组的长度。（例如 `arr.length = 0`）。
- 向对象添加新属性。（例如 `obj.newKey = value`），因此它需要一些补充性的 `API`，例如 `Vue.$set(obj, newKey, value)`  。
- 由于普通 `JavaScript` 数据结构的局限性，对于每个反应对象，都会有一个名为的不可数的属性 `__ob__`，在某些极端情况下可能会导致冲突 。
- 它不支持更多数据类型，例如 `Map` 和 `Set` 。没有其他非普通 `JavaScript` 对象 。
- 性能是一个问题。当数据很大时，使其初始化时将花费可见时间，从而使其具有反应性。有一些技巧可以降低初始成本，但有些棘手 。

讲到这里，不知道同学们有没有发现，在 `Vue3` 的响应机制下，我们发现在 `Vue2.x` 不能触发响应的操作都能够触发了，这更加说明，`Vue` 在进步，更加强大了

这意味着我们可能不再需要 `Vue.$set` 这样的补充 `API` 了 。

- 给一个对象属性设置值，我们不再需要这样设置了

```js
<script>
export default {
	data() {
        return {
            obj: {
                name: null
            }
        }
    },
    methods: {
        setName() {
            this.$set(this.obj, 'name', 'Ken')
            this.$set(this.obj, 'sex', 18)
        }
    }
}    
</script>
```

在 `Vue3` 中，我们可以这样直接给对象赋值了 。

```js
this.obj.name = 'Ken'
this.obj.sex = 18
```

- 直接修改数组元素

```js
this.list[index] = {name: 'ken', sex: '男'}
```

- 设置数组 length 属性

```js
this.list.length = 0
```

- 使用 `Map/Set`

![](.\Snipaste_2020-08-03_15-19-53.png)

```html
<template>
  <div>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <span>{{ item }}</span>
        <button @click="remove(item)">移除</button>
      </li>
    </ul>
    <button @click="add">添加</button>
    <button @click="clean">清空</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    list: new Set([
      'Ken',
      '志学Python',
      '前端工程师'
    ])
  }),
  created() {
    console.log(this.list)
  },
  methods: {
    remove(item) {
      this.list.delete(item)
    },
    add() {
      const newItem = prompt('Input a new item')
      if (newItem) {
        this.list.add(newItem)
      }
    },
    clean() {
      this.list.clear()
    }
  }
}
</script>

```

![](.\Snipaste_2020-07-29_23-28-39.png)

我们可以发现，其实上面是 `vue2.x` 的写法，在 `vue3.0` 一样是兼容的，接下来我们就来改造一下代码，将 `todoList` 的代码升级到 `vue3.0` 版本  。

## 升级 `todoList` 代码

在升级过程中，我们将会学习到几个 `composition-api` 

- `ref`  接受一个内部值并返回一个反应性且可变的ref对象。ref对象具有 `.value` 指向内部值的单个属性
- `reactive` 返回对象的反应性副本 `object`
- `setup` 内部启动函数

![](.\Snipaste_2020-08-03_15-22-38.png)

### 定义数据

```js
import { ref, reactive } from "vue";
setup() {
    let list = ref([]);
    let name = ref("");
    let sex = ref('')
    let indexObj = reactive({ index: null });
    return {
        list,
        name,
        sex,
        indexObj
    }
}
```

### 在模板中使用

```	html
<template>
  <div>
    <input type="text" v-model="name" placeholder="请输入名字" />
    &nbsp; &nbsp;
    <input type="text" v-model="sex" placeholder="请输入性别" />
    &nbsp; &nbsp;
    <button @click="add" v-if="indexObj.index === null">添加</button>
    <button @click="update" v-else>更新</button>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <span>名字为：{{ item.name }}</span>
        &nbsp; &nbsp;
        <span>性别为：{{ item.sex }}</span>
        &nbsp; &nbsp;
        <button @click="edit(index)">编辑</button>
        &nbsp; &nbsp;
        <button @click="del(index)">删除</button>
      </li>
    </ul>
    <button @click="clear">清空数组</button>
  </div>
</template>
```

![](.\Snipaste_2020-07-30_00-00-35.png)



### 定义姓名清单操作

```js
<script>
import { ref, reactive } from "vue";
export default {
  name: "todoList",
  setup() {
    let list = ref([]); // 定义数组
    let name = ref(""); // 定义 name
    let sex = ref(''); // 定义 sex
    let indexObj = reactive({ index: null }); // 定义对象
    const edit = index => { // 编辑
      let item = list.value[index];
      name.value = item.name;
      sex.value = item.sex;
      indexObj.index = index;
      console.log(index);
    };
    const del = index => { // 删除
      list.value.splice(index, 1);
    };
    const update = () => { // 更新
      if (!name.value || !sex.value) {
        return;
      }
      list.value[indexObj.index].name = name.value;
      list.value[indexObj.index].sex = sex.value;
      sex.value = "";
      name.value = "";
      indexObj.index = null;
    };
    const add = () => { // 添加
      if (!name.value || !sex.value) {
        return;
      }
      list.value.push({
        name: name.value,
        sex: sex.value
      });
      name.value = "";
      sex.value = "";
    };
    const clear = () => { // 清空
      list.value.length = 0;
    };
    return {
      list,
      name,
      sex,
      indexObj,
      add,
      edit,
      update,
      del,
      clear
    };
  }
};
</script>
```

我们可以看到，实现的效果跟我们未升级之前的代码的效果是一模一样的，只不过我们把数据，操作数据的方法都定义在 `setup()` 函数中，然后最后一起通过一个 `object` `return` 出去了 。

## 总结

本实验就此结束了，我们来总结一下，我们会学到，项目环境搭建，项目版本升级，学习到了 `vue2.x` 与 `vue3.0` 数据更改的差别，在 `vue3.0` 我们可能不再需要 `Vue.$set` 这样的全局 `API`，可以直接给对象赋值，可以直接给数组 `length` 属性设置，可以直接通过下标的方式对数组元素进行修改，可以操作 `Map/Set` , `ref` 定义响应式单个变量， `reactive` 定义响应式对象， `setup()` 方法的初使用 。

