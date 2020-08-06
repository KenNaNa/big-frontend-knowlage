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

#### 环境准备

在开始开发之前，我们先测试一下环境配置是否完整，输入以下命令，就会出现 `node` 版本 。

```js
node -v
```

![node-v](.\node-V.png)

如果出现上图所示结果，说明环境已安装 node ，若大家本地环境中未安装 node ，可以到 [Node.js 中文官网](http://nodejs.cn/download/) 下载对应的系统 `node` 安装包。                          

![Node.js 安装包](.\node.png)

同理我们输入以下命令，检测 vue 安装情况。

```vue
vue -V
```

可以看出环境中安装的 `vue-cli` 版本为 `3.11.0` 。

![vue-cli-v](.\Vue.png)

不符合我们的开发需求，所以我们需要升级一下 `vue-cli` ，首先，同学们输入以下命令，先卸载 `vue-cli` ：

```vue
npm uninstall @vue/cli
```

再重新安装 `vue-cli` 。

```vue
npm install @vue/cli -g
```

然后我们再次输入以下命令查看版本。

```vue
vue -V
```

发现 `vue-cli` 升级到了 `4.4.6` 版本。

![vue-cli-v4.4.6](.\vue-V.png)

ok，至此我们的环境已经准备好了，万事俱备只欠东风了，接下来我们就来搭建一个 `vue` 初始化项目。

## 项目创建

首先我们新建一个 `code` 目录，我们进入 `code` 的目录。

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

然后一步步回车，所有输入都选择输入 `y` ，在 `CSS Pre-processors` 预处理器那里选择 `node-sass` 安装即可，进入项目创建。

![create-pro](.\Snipaste_2020-07-28_23-03-39.png)

创建之后，我们去看看 `vue2.x` 目录结构。

![code](.\Snipaste_2020-07-28_23-07-49.png)

此时的 `package.json` 如下图所示，我们可以看到 `dependencies` 中关于 `vue` 是 `2.6.11` 版本的，`vue-router` 是 `3.2.0` 版本的， `vuex` 是 `3.4.0` 版本的 。

![](.\Snipaste_2020-08-01_21-40-30.png)

### 版本升级

在这个基础之上，我们来将此项目进行代码升级，升级到我们 `Vue3.0` 版本，同学们输入以下命令。

```vue
vue add vue-next
```

![](.\vue-add-vue-next.png)

升级之后，我们再来看看 `package.json` ，其中值得我们注意的是 `"vue-cli-plugin-vue-next": "~0.1.3"`，出现下图所示的内容，对比之后，我们发现 `vue` 项目已经升级完成了。

![](.\Snipaste_2020-08-01_21-45-51.png)

## 实现 `todoList` 姓名性别清单列表

接下来同学们跟着我来实现一个简单的 `todoList` 姓名性别清单列表，麻雀虽小，却可以让我们了解到 `vue3` 的 `reactive` 响应式与 `vue2.x` ， `reactive` 响应式的区别，我们先新建一个 `todoList.vue` ,可以实现性别，姓名输入，添加生成姓名性别列表，对姓名性别列表进行增删改，来了解我们 `vue3.x` 的响应式的强大之处。 

####  新建模板

我们来分析一下，我们的需求是要让用户可以输入姓名，性别，然后可以生成一个列表，用户可以对这些列表进行 `增删改`。那么我们需要 `姓名输入框`，`性别输入框` 让用户输入姓名，性别，`添加按钮` 让用户可以添加，`编辑按钮` 让用户可以编辑，`修改按钮` 让用户可以修改，`删除按钮` 让用户可以删除，对此分析之后，我们就清楚我们接下来需要做的事情了。

我们在 `src/views` 目录新建 `TodoList.vue` 。从上面分析可以知道我们需要 `name` 来保存用户输入的姓名，`sex` 来保存用户输入的性别，`list` 来保存用户添加之后的数据，`index` 来保存用户 `编辑`，`更新` 的姓名清单的下标。

**需要注意的点**：在 `vue2.x` 我们是使用 `data()` 函数 `return` 一个 `object`， 为什么要在一个函数 `return` 一个 `object`，是因为如果直接使用 `object` 会导致数据公用的问题，`data()` 函数每次执行都会创建一个 `object`，这样就不会导致数据公用，所以代码如下所示：

```html
<template>
  <div>
    <input type="text" v-model="name" placeholder="请输入名字" />
    &nbsp; &nbsp;
    <input type="text" v-model="sex" placeholder="请输入性别" />
    &nbsp; &nbsp;
    <button @click="add" v-if="index === null">添加</button>
    <button @click="update" v-else>更新</button>
    <button @click="clear">清空数组</button>
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
  </div>
</template>
<script>
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

运行 `npm run serve`，我们可以看到界面如下所示：

![](.\Snipaste_2020-08-06_06-24-38.png)

#### 添加操作

有了以上的准备工作之后，接下来我们需要让用户可以点击 `添加按钮` 对自己输入的`姓名`，`性别` 进行添加操作。**需要注意的是**：如果输入框有一个为空我们就不让用户进行 `添加` 处理，添加成功之后，我们需要把 `name` ，`sex` 上次保存的数据清空，以免重复添加，在这里我们直接使用数组的 `push` 来进行添加数据，我们在上面代码的基础上，在 `data(){}` 函数的下面添加一个 `methods` 对象，将添加方法 `add(){}`  写在里面，代码如下所示：

```js
<script>
export default {
  name: 'todoList',
  data() {
  	list: [],
    name: '',
    sex: '',
    index: null,
  },
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

运行 `npm run serve`，一顿操作之后的效果如下所示：

![](.\GIF 2020-8-6 星期四 6-45-28.gif)

#### 编辑操作

接下来我们就对我们上面添加的三条姓名性别清单进行编辑操作，我们点击清单中的 `编辑按钮` 之后，数据会同步到两个输入框中，此时的 `添加按钮` 变为 `更新按钮` ，对数据修改完成之后，点击 `更新按钮` 会对数据进行修改保存，这个操作我们需要注意以下几点：

- `edit` 编辑操作，我们点击编辑，下面的内容会出现在输入框中，这就是我们 `v-model` 指令的强大之处，在 `vue2.x` 中 `vue` 内部双向绑定的机制是用`Object.defineProperty()` 递归覆盖数据对象内所有属性的 `getter / setter` 。除了正常运行外，它还会在所有设置器中注入一个触发器，并在所有获取器中注入一个跟踪器。此外，它 `Dep` 每次都会在内部创建一个小实例，以记录所有依赖于此属性的计算。

- 每当我们在属性中设置一个值时，它将调用 `setter` ，该 `setter` 将重新评估 `Dep` 实例中的那些相关计算。然后，您可能会问我们如何记录所有相关的计算。事实是，每当我们定义一个 `watch` 函数或 `DOM` 更新函数之类的计算时，它都会首先运行一次-有时它作为初始化运行，有时只是空运行。在运行过程中，它将触碰其所依赖的吸气剂中的每个跟踪器。每个跟踪器会将当前的计算功能推入相应的 `Dep` 实例。

- 因此，下一次当某些数据更改时，它将在对应的 `Dep` 实例中找出所有相关的计算，然后再次运行它们 。因此，这些计算的效果将自动更新。

同样，我们在 `todoList.vue` 中 `methods` 对象里面，在 `add(){}` 添加方法下面写下如下代码：在 `edit(){}` 方法中，我们会通过 `index` 下标拿到 `list` 的当前用户点击 `编辑按钮` 的数据 `item` ，将 `item.name` 赋值给 `this.name` ，`item.sex` 赋值给 `this.sex` ，这样数据就同步到输入框中，我们就可以对数据进行修改了。

```js
<script>
export default {
  name: 'todoList',
  data() {
  	list: [],
    name: '',
    sex: '',
    index: null,
  },
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
  },
  edit(index) {
     let item = this.list[index];
     this.name = item.name;
     this.sex = item.sex;
     this.index = index;
     console.log(index);
  },
};
</script>

```

运行 `npm run serve`，我们对三条清单进行操作之后的效果如下所示：

![](.\GIF 2020-8-6 星期四 6-59-32.gif)

#### 更新操作

在 `编辑操作` 中，我们保存了当前 `index` 索引，编辑完成之后，我们需要把数据更新会 `list` 数组中，需要注意的是：

- `this.name` ，`this.sex` 如果没有输入内容，或者清空，不让用户更新，避免更新完之后没有数据
- 更新完之后，需要把 `this.name = ''`，`this.sex = ''` 清空，避免重复更新
- 同时需要把 `this.index = null` ，将 `更新按钮` 变为 `添加按钮`

- 我们知道如果是 `vue2.x` 我们这样做是不会及时更新到 `DOM`，是因为 `Object.defineProperty()` 局限性，没有及时更新到 `DOM` 上面，但是在 `vue3`，我们可以清楚的看到是及时响应上去的。

同样，我们在 `edit(){}` 下面添加 `update(){}` 方法，代码如下：

```js
<script>
export default {
  name: 'todoList',
  data() {
  	list: [],
    name: '',
    sex: '',
    index: null,
  },
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
  },
  edit(index) {
     let item = this.list[index];
     this.name = item.name;
     this.sex = item.sex;
     this.index = index;
     console.log(index);
  },
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
};
</script>

```

运行 `npm run serve`，我们对三条清单进行姓名修改，效果如下：

![](.\GIF 2020-8-6 星期四 7-14-05.gif)

#### 删除操作

除了编辑操作之外，我们还有对我们不需要的清单列表进行删除，我们只需要拿到当前删除的 `index`，对数组 `list` 进行 `splice` 删除操作就行了。同样我们在 `update(){}` 方法下面添加 `del(){}` 函数代码：

```js
del(index) {
    this.list.splice(index, 1);
    console.log(index);
},
```

点击删除之后，我们发现下面的姓名清单没有了 。

![](.\GIF 2020-8-6 星期四 7-18-46.gif)

#### 清空操作

当然，如果用户都不需要之前添加或者编辑过的数据，我们留了一个批量操作的 `清空按钮`，直接将 `list` 数组清空 `this.list = []`， 或者 `this.list.length = 0`，同样我们在 `del(){}` 下面添加 `clear(){}` 清空方法，代码如下所示：

```js
clear() {
    this.list.length = 0
    // this.list = []
}
```

运行 `npm run serve`，先添加三条清单，然后再点击 `清空按钮`，效果如下所示：

![](.\GIF 2020-8-6 星期四 7-27-00.gif)

#### 值得关注的点

点击清空按钮按钮之后，我们发现所有数据都清空，如果我们使用的是 `vue2.x` 版本，我们会发现 `this.list.length = 0` 没有效果，下面的姓名清单没有被清空，只有我们这样设置的时候 `this.list = []` 才会被清空，这是为什么呢？

这是由于 `Object.defineProperty` 我们无法观察到某些数据更改，例如：

- 通过将值分配给某个索引来设置数组项。（例如 `arr[0] = value`）。
- 设置数组的长度。（例如 `arr.length = 0`）。
- 向对象添加新属性。（例如 `obj.newKey = value`），因此它需要一些补充性的 `API`，例如 `Vue.$set(obj, newKey, value)` 。
- 由于普通 `JavaScript` 数据结构的局限性，对于每个反应对象，都会有一个名为的不可数的属性 `__ob__`，在某些极端情况下可能会导致冲突。
- 它不支持更多数据类型，例如 `Map` 和 `Set` 。没有其他非普通 `JavaScript` 对象。
- 性能是一个问题。当数据很大时，使其初始化时将花费可见时间，从而使其具有反应性。有一些技巧可以降低初始成本，但有些棘手。

讲到这里，不知道同学们有没有发现，在 `Vue3` 的响应机制下，我们发现在 `Vue2.x` 不能触发响应的操作都能够触发了，这更加说明，`Vue` 在进步，更加强大了。

这意味着我们可能不再需要 `Vue.$set` 这样的补充 `API` 了。

- 给一个对象属性设置值，我们不再需要这样设置了。

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

- 设置数组 `length` 属性

```js
this.list.length = 0
```

- 使用 `Map/Set`

我们可以使用 `Map/Set` 对数组进行操作，我们现在 `data(){}`  使用 `new Set()` 初始化三个元素，使用 `remove` 对 `list` 进行删除操作，使用 `add` 对 `list` 进行添加操作，使用 `clear` 对 `list` 进行清空操作，将下面代码替换掉我们 `todoList.vue` 文件的内容：

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

运行 `npm run serve` ，我们可以对 `list` 清单进行增删改，效果如下：

![](.\GIF 2020-8-6 星期四 7-33-25.gif)

我们可以发现，其实上面是 `vue2.x` 的写法，在 `vue3.0` 一样是兼容的，接下来我们就来改造一下代码，将 `todoList` 的代码升级到 `vue3.0` 版本  。

## 升级 `todoList` 代码

在升级过程中，我们将会学习到几个 `composition-api` 

- `ref`  接受一个内部值并返回一个反应性且可变的 `ref` 对象。`ref` 对象具有 `.value` 指向内部值的单个属性，可以这样理解，`ref` 是用来定义单个变量，像 `Number` 数字类型，`String` 字符串类型，`Boolean` 布尔类型 ，`Array` 数组类型
- `reactive` 返回对象的反应性副本 `object` ，`reactive` 用来定义像 `Object` ，定义多个变量
- `setup` 内部启动函数，有点类似 `vue2,x` 的 `data(){}` ，同样 `return` 一个 `Object`

#### 模板

这部分代码跟 `vue2.x` 的代码没有什么不同之处，照着搬过来就行了

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

![](.\Snipaste_2020-08-06_06-24-38.png)

#### 数据变量定义

在 `vue3.0`， 我们不再需要 `data(){}` 了，所有的变量定义都在 `setup(){}` 里面定义，在定义变量之前我们需要引入 `ref`，`reactive`。

```js
<script>
import {ref, reactive} from 'vue'    
</script>
```

同样，我们要对姓名，性别清单进行各种操作之前我们需要 `name`，`sex`，`list` ，`indexObj`，来保存用户输入的姓名，性别，数据，索引，通常在 `vue3.0` 我们就像普通定义变量一样来定义，这里我们使用 `ref` 来定义 `list`，`name`，`sex`，用 `reactive` 来定义 `indexObj`， 最后 `return` 出来一个 `Object`，这一点跟 `data(){}` 本质没什么区别。


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
    return {
      list,
      name,
      sex,
      indexObj
    };
  }
};
</script>
```

#### 添加操作

我们在 `setup(){}` 函数里面定义一个 `add(){}` 添加函数，来处理用户的添加操作，在 `vue2.x` 我们是将 `add(){}` 函数定义在 `methods` 对象中，在 `vue3.x` 中我们是将 `add(){}` 定义在 `setup(){}` 方法中，在使用 `ref` 定义的变量之后，我们在给变量赋值的时，需要访问变量的 `value` 属性，是因为 `ref` 返回了一个 对象副本，最后我们将 `add(){}` 放在 `Object` 返回出去，给模板 `todoList.vue` 中的按钮使用。

```js
<script>
import { ref, reactive } from "vue";
export default {
  name: "todoList",
  setup() {
    let list = ref([]);
    let name = ref("");
    let sex = ref("");
    let indexObj = reactive({ index: null });
    const add = () => {
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
    return {
      list,
      name,
      sex,
      indexObj,
      add,
    };
  }
};
</script>
```

运行 `npm run serve` 之后，我们看到的效果如下：

![](.\GIF 2020-8-7 星期五 7-09-55.gif)

#### 编辑操作

同样，我们需要在 `setup(){}` 函数中定义一个 `edit(){}` 编辑函数，在 `vue2.x` 我们取 `list` 的值是通过 `this.list`， 现在 `vue3.0` 是通过 `list.value`，获取索引是通过 `indexObj.index`，保存姓名是通过给 `name.value` 赋值，保存性别是通过给 `sex.value` 赋值，最后我们需要在 `return` 出去的 `object` ， 将 `edit` 写进去。

```js
setup() {
    let list = ref([]);
    let name = ref("");
    let sex = ref("");
    let indexObj = reactive({ index: null });
    const add = () => {
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
    const edit = index => {
      let item = list.value[index];
      name.value = item.name;
      sex.value = item.sex;
      indexObj.index = index;
      console.log(index);
    };
    return {
      list,
      name,
      sex,
      indexObj,
      add,
      edit
    };
  }
```

运行 `npm run serve` ，我们看到的效果如下：

![](E:\前端学习\big-frontend-knowlage\code\img\玩转 Vue.js 3 新特性进阶实战（2.0）\玩转 Vue.js 3 新特性进阶实战（2.0）\img\GIF 2020-8-7 星期五 7-19-01.gif)

#### 更新操作

同样，我们也需要在 `setup(){}` 函数定义一个 `update(){}`，最终在 `return` 出去的 `object` 对象写进去，我们依然需要对数据进行非空判断，`!name.value`，`!sex.value`。

```js
const update = () => {
    if (!name.value || !sex.value) {
        return;
    }
    list.value[indexObj.index].name = name.value;
    list.value[indexObj.index].sex = sex.value;
    sex.value = "";
    name.value = "";
    indexObj.index = null;
};
```

运行 `npm run serve   ` ，我们看到的效果如下：

![](.\GIF 2020-8-7 星期五 7-19-01.gif)   

#### 删除操作

我们也需要在 `setup(){}` 中定义一个 `del(){}` ，最终在 `return` 出去的 `object` 将 `del(){}` 返回出去。删除时，我们需要拿到当前点击的所在的索引 `index` ，然后通过拿到 `list.value`，对数组进行 `splice` 删除操作。删除之后，我们也需要将 `indexObj.index` 置为 `null`，将 `name.value` 清空，将 `sex.value` 清空。

```js
const del = index => {
    list.value.splice(index, 1);
    indexObj.index = null;
    name.value = "";
    sex.value = "";
};
```

运行 `npm run serve`，我们看到的效果如下：

![](.\GIF 2020-8-7 星期五 7-32-17.gif)

#### 清空操作

其实很简单，就是将数组数据置为空数据 `list.value = []` 或者 `list.value.length = 0`。同样我们也将 `clear(){}` 定义在 `setup(){}` 函数中，最终暴露出去给模板使用。

```js
const clear = () => {
    list.value.length = 0;
    // list.value = [];
};
```

![](.\GIF 2020-8-7 星期五 7-38-03.gif)

#### 最终的代码

我们可以看到，实现的效果跟我们未升级之前的代码的效果是一模一样的，只不过我们把 `数据`，`操作数据的方法` 都定义在 `setup()` 函数中，然后最后一起通过一个 `object` `return` 出去了。

```html
<template>
  <div class="todo-list">
    <div class="header">todoList</div>
    <input type="text" v-model="name" placeholder="请输入名字" />
    &nbsp; &nbsp;
    <input type="text" v-model="sex" placeholder="请输入性别" />
    &nbsp; &nbsp;
    <button @click="add" v-if="indexObj.index === null">添加</button>
    <button @click="update" v-else>更新</button>
    &nbsp; &nbsp;
    <button @click="clear">清空数组</button>
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
  </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  name: "todoList",
  setup() {
    let list = ref([]);
    let name = ref("");
    let sex = ref("");
    let indexObj = reactive({ index: null });
    const edit = index => {
      let item = list.value[index];
      name.value = item.name;
      sex.value = item.sex;
      indexObj.index = index;
      console.log(index);
    };
    const del = index => {
      list.value.splice(index, 1);
      indexObj.index = null;
      name.value = "";
      sex.value = "";
    };
    const update = () => {
      if (!name.value || !sex.value) {
        return;
      }
      list.value[indexObj.index].name = name.value;
      list.value[indexObj.index].sex = sex.value;
      sex.value = "";
      name.value = "";
      indexObj.index = null;
    };
    const add = () => {
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
    const clear = () => {
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

<style lang="scss" scoped>
.todo-list {
  width: 600px;
  margin: auto;
  .header {
    height: 30px;
    line-height: 30px;
  }
  ul {
    li {
      // display: flex;
      // justify-content: space-between;
      text-align: left;
      margin-bottom: 10px;
    }
  }
}

li {
  list-style: none;
}
</style>
```

## 总结

本实验就此结束了，我们来总结一下，我们会学到，项目环境搭建，项目版本升级，学习到了 `vue2.x` 与 `vue3.0` 数据更改的差别，在 `vue3.0` 我们可能不再需要 `Vue.$set` 这样的全局 `API`，可以直接给对象赋值，可以直接给数组 `length` 属性设置，可以直接通过下标的方式对数组元素进行修改，可以操作 `Map/Set` , `ref` 定义响应式单个变量， `reactive` 定义响应式对象， `setup()` 方法的初使用。

