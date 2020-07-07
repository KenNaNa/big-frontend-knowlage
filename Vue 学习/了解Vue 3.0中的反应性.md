撰写本文仅出于我对Vue最酷的部分：反应系统的了解和理解。

### 背景
众所周知，Vue.js团队正在研究3.0。最近，它发布了第一个Beta版本。这意味着核心技术设计足够稳定。现在，我认为是时候逐步了解Vue 3.0中的内容。那是我最喜欢的部分之一：反应系统。

### 什么是反应性？
简而言之，反应性意味着，当数据更改时，取决于某些特定数据的计算结果将自动更新。

在现代Web开发中，我们始终需要呈现一些与数据相关或与状态相关的视图。因此，显然，使数据具有响应性可以给我们带来很多好处。在Vue中，反应性系统从其早期版本一直存在到现在。我认为这是Vue如此受欢迎的最大原因之一。

首先让我们看一下Vue早期版本中的反应系统。

### Vue的反应性从0.x到1.x
我第一次接触Vue是在2014年左右，我猜是Vue 0.10。那时，您可以通过dataoption 将普通的JavaScript对象传递到Vue组件中。然后，您可以在一个文档片段中将它们用作具有反应性的模板。一旦data发生变化时，视图将自动更新。您也可以使用computed和watch选项以更灵活的方式从反应系统中受益。与更高版本的Vue 1.x相同。


```js
new Vue({
  el: '#app',
  template: '<div @click="x++">{{x}} + {{y}} = {{z}}</div>',
  data() {
    return { x: 1, y: 2 }
  },
  computed: {
    z() { return this.x + this.y }
  },
  watch: {
    x(newValue, oldValue) {
      console.log(`x is changed from ${oldValue} to ${newValue}`)
    }
  }
})
```

您可能会发现这些API到目前为止并没有太大变化。因为它们完全相同。

那么它是怎样工作的？如何使普通的JavaScript对象自动响应？

幸运的是，在JavaScript中，我们有一个API Object.defineProperty()可以覆盖对象属性的getter / setter方法。因此，要使它们具有反应性，可能需要3个步骤：

用于Object.defineProperty()递归覆盖数据对象内所有属性的getter / setter。除了正常运行外，它还会在所有设置器中注入一个触发器，并在所有获取器中注入一个跟踪器。此外，它Dep每次都会在内部创建一个小实例，以记录所有依赖于此属性的计算。
每当我们在属性中设置一个值时，它将调用setter，该setter将重新评估Dep实例中的那些相关计算。然后，您可能会问我们如何记录所有相关的计算。事实是，每当我们定义一个watch函数或DOM更新函数之类的计算时，它都会首先运行一次-有时它作为初始化运行，有时只是空运行。在运行过程中，它将触碰其所依赖的吸气剂中的每个跟踪器。每个跟踪器会将当前的计算功能推入相应的Dep实例。
因此，下一次当某些数据更改时，它将在对应的Dep实例中找出所有相关的计算，然后再次运行它们。因此，这些计算的效果将自动更新。
使用观察数据的简单实现Object.defineProperty类似于：


```js
// data
const data = { x: 1, y: 2 }

// real data and deps behind
let realX = data.x
let realY = data.y
const realDepsX = []
const realDepsY = []

// make it reactive
Object.defineProperty(data, 'x', {
  get() {
    trackX()
    return realX
  },
  set(v) {
    realX = v
    triggerX()
  }
})
Object.defineProperty(data, 'y', {
  get() {
    trackY()
    return realY
  },
  set(v) {
    realY = v
    triggerY()
  }
})

// track and trigger a property
const trackX = () => {
  if (isDryRun && currentDep) {
    realDepsX.push(currentDep)
  }
}
const trackY = () => {
  if (isDryRun && currentDep) {
    realDepsY.push(currentDep)
  }
}
const triggerX = () => {
  realDepsX.forEach(dep => dep())
}
const triggerY = () => {
  realDepsY.forEach(dep => dep())
}

// observe a function
let isDryRun = false
let currentDep = null
const observe = fn => {
  isDryRun = true
  currentDep = fn
  fn()
  currentDep = null
  isDryRun = false
}

// define 3 functions
const depA = () => console.log(`x = ${data.x}`)
const depB = () => console.log(`y = ${data.y}`)
const depC = () => console.log(`x + y = ${data.x + data.y}`)

// dry-run all dependents
observe(depA)
observe(depB)
observe(depC)
// output: x = 1, y = 2, x + y = 3

// mutate data
data.x = 3
// output: x = 3, x + y = 5
data.y = 4
// output: y = 4, x + y = 7
```

在Vue 2.x和更早的版本中，该机制大致类似于上面，但是更好地进行了抽象，设计和实施。

为了支持更复杂的情况，例如数组，嵌套属性或同时变异两个以上的属性，Vue内部有更多的实现和优化细节，但基本上，与我们前面提到的机制相同。

### Vue 2.x中的反应性
从1.x到2.x，这是完全重写。它引入了一些非常酷的功能，例如虚拟DOM，服务器端渲染，低级渲染功能等。但是有趣的是，反应性系统并没有太大变化，但是，上面的用法完全不同：

从0.x到1.x，呈现逻辑取决于维护文档片段。在该文档片段中，每个动态元素，属性和文本内容都有一些DOM更新功能。因此，反应性系统通常在数据对象和这些DOM更新功能之间工作。由于这些函数都是真正的DOM函数，因此性能不是很好。在Vue 2.x中，Vue组件的呈现逻辑成为了一个完整的纯JavaScript呈现函数。因此，它将首先返回虚拟节点，而不是真实的DOM节点。然后，它将基于针对虚拟DOM节点的快速变异差异算法的结果来更新实际DOM。它比以前更快。
在Vue 2.6中，它引入了一个独立的API Vue.observalue(obj)来生成反应式普通JavaScript对象。因此，您可以在render函数或computed属性中使用它们。使用起来更加灵活。
同时，Vue社区中有一些讨论，涉及将反应性系统抽象到一个独立的程序包中以供更广泛的使用。但是当时还没有发生。

### 3.0之前的反应系统的局限性
到目前为止，Vue并未改变反应机制。但这并不意味着当前的解决方案是理想的。据我个人了解，有一些警告：

由于限制，Object.defineProperty我们无法观察到某些数据更改，例如：
通过将值分配给某个索引来设置数组项。（例如arr[0] = value）
设置数组的长度。（例如arr.length = 0）
向对象添加新属性。（例如obj.newKey = value），因此它需要一些补充性的API，例如Vue.$set(obj, newKey, value)。
由于普通JavaScript数据结构的局限性，对于每个反应对象，都会有一个名为的不可数的属性__ob__，在某些极端情况下可能会导致冲突。
它不支持更多数据类型，例如Map和Set。没有其他非普通JavaScript对象。
性能是一个问题。当数据很大时，使其初始化时将花费可见时间，从而使其具有反应性。有一些技巧可以降低初始成本，但有些棘手。
### Vue 3.0中的反应系统
简而言之，在Vue 3.0中，作为一个独立的软件包，使用新的机制和新的抽象完全重写了反应性系统。而且它还支持更现代的JavaScript数据类型。

您可能熟悉，也许还不熟悉。别担心。让我们通过创建一个Vue 3.0项目来快速看一下它。

### 创建一个Vue 3.0项目
到目前为止，还没有稳定的功能齐全的项目生成器，因为它仍处于Beta中。我们可以通过名为“ vite”的实验项目来尝试Vue 3.0：


```js
https://github.com/vitejs
```


只需在下面运行以下命令：


```js
$ npx create-vite-app hello-world
$ cd hello-world
$ npm install
$ npm run dev
```

然后，您可以通过http：// localhost：3000访问您的Vue 3.0应用。

您可以看到已经有一个Vue组件App.vue：


```js
<template>
  <p>
    <span>Count is: {{ count }}</span>
    <button @click="count++">increment</button>
    is positive: {{ isPositive }} 
  </p>
</template>

<script>
export default {
  data: () => ({ count: 0 }),
  computed: {
    isPositive() { return this.count > 0 } 
  }
}
</script>
```

有一个反应性count，它显示在中。当用户单击“增加”按钮时，该属性count将增加，计算出的属性isPositive也将被重新计算，并且UI将自动更新。

到目前为止，它似乎与以前的版本没有什么不同。

现在，让我们尝试早期版本的Vue中不可能的事情。

1.添加新属性
如前所述，在Vue 2.x及更早版本中，我们无法自动观察新添加的属性。例如：


```js
<template>
  <p>
    <span>My name is {{ name.given }} {{ name.family }}</span>
    <button @click="update">update name</button>
  </p>
</template>

<script>
export default {
  data: () => ({
    name: {
      given: 'Jinjiang'
    }
  }),
  methods: {
    update() {
      this.name.family = 'Zhao'
    }
  }
}
</script>
```

该update方法无法正常工作，因为family无法观察到新属性。因此，添加此新属性时，将不会重新计算render函数。如果您需要这项工作，则应手动使用另一个补充API作为Vue.$set(this.name, ‘family’, ‘Zhao’)。

但是在Vue 3.0中，它也已经可以正常工作了。您不再需要Vue.$set了。

2.通过索引将项目分配给数组
现在，让我们尝试将值设置为数组的索引：


```js
<template>
  <ul>
    <li v-for="item, index in list" :key="index">
      {{ item }}
      <button @click="edit(index)">edit</button>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      list: [
        'Client meeting',
        'Plan webinar',
        'Email newsletter'
      ]
    }
  },
  methods: {
    edit(index) {
      const newItem = prompt('Input a new item')
      if (newItem) {
        this.list[index] = newItem
      }
    }
  }
}
</script>
```


在Vue公司2.x和更早版本，当您单击列表中的项目，并输入一个新的作品的文本字符串的“编辑”按钮，则此视图将不会改变，因为设定项目与索引一样this.list[index] = newItem不能被跟踪。您应该改写Vue.$set(this.list, index, newItem)。但是在Vue 3.0中，它也可以工作。

3.设置数组的length属性
另外，如果我们在上面的示例中添加另一个按钮来清理所有项目：


```js
<template>
  <ul>...</ul>
  <!-- btw Vue 3.0 supports multi-root template like this -->
  <button @click="clean">clean</button>
</template>

<script>
export default {
  data: ...,
  methods: {
    ...,
    clean() { this.list.length = 0 }
  }
}
</script>
```

它在Vue 2.x及更早版本中将不起作用，因为this.list.length = 0无法跟踪设置数组的长度。因此，您必须使用其他方法，例如this.list = []。但是在Vue 3.0中，上述所有方式均有效。

4.使用ES set/map
让我们看一下ES Set的类似示例：


```js
<template>
  <div>
    <ul>
      <li v-for="item, index in list" :key="index">
        {{ item }}
        <button @click="remove(item)">remove</button>
      </li>
    </ul>
    <button @click="add">add</button>
    <button @click="clean">clean</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    list: new Set([
      'Client meeting',
      'Plan webinar',
      'Email newsletter'
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

现在我们使用a Set而不是数组。幸运的是，在Vue 2.x和更早的版本中，可以第一次正确渲染它。但是，当您删除，添加或清除视图时，将不会对其进行更新，因为不会对其进行跟踪。因此通常在Vue 2.x及更早版本中不使用Set或Map。在Vue 3.0中，相同的代码将按您的意愿工作，因为它完全支持它们。

5.使用非反应性
如果我们在Vue组件中有一些一次性消耗大量数据的数据，则可能不需要进行反应，因为一旦初始化，它就不会改变。但是在Vue 2.x及更早版本中，无论您再次使用它们，都将跟踪其中的所有属性。因此有时会花费可见的时间。实际上，我们还有其他一些解决方法，但这有点棘手。

在Vue 3.0中，它提供了专用的API来实现- markRaw：


```js
<template>
  <div>
    Hello {{ test.name }}
    <button @click="update">should not update</button>
  </div>
</template>

<script>
import { markRaw } from 'vue'
export default {
  data: () => ({
    test: markRaw({ name: 'Vue' })
  }),
  methods: {
    update(){
      this.test.name = 'Jinjiang'
      console.log(this.test)
    }
  }
}
</script>
```

在这种情况下，我们通常markRaw要告诉反应系统，无需跟踪属性测试及其后代属性。因此，将跳过跟踪过程。同时，对它们的任何进一步更新都不会触发重新渲染。

此外，还有另一个“双胞胎” API-  readonly。该API可以防止数据被突变。例如：


```js
import { readonly } from 'vue'

export default {
  data: () => ({
    test: readonly({ name: 'Vue' })
  }),
  methods: {
    update(){
      this.test.name = 'Jinjiang'
    }
  }
}
```

然后突变到this.test将失败。

到目前为止，我们已经在Vue 3.0中看到了反应系统的强大功能和魔力。实际上，有更强大的方法可以使用它。但是我们不会立即继续前进，因为在掌握它们之前，了解它在Vue 3.0之后的工作原理也很高兴。

这个怎么运作
简而言之，Vue 3.0中的反应系统适合ES2015！

### 第一部分：简单的数据观察器
自ES2015起，有一对API-  Proxy和Reflect。它们是反应系统的天生！Vue 3.0反应系统只是基于此构建的。

有了它，Proxy您可以设置一个“陷阱”以观察对某个JavaScript对象的任何操作。


```js
const data = { x: 1, y: 2 }

// all behaviors of a proxy by operation types
const handlers = {
  get(data, propName, proxy) {
    console.log(`Get ${propName}: ${data[propName]}!`)
    return data[propName]
  },
  has(data, propName) { ... },
  set(data, propName, value, proxy) { ... },
  deleteProperty(data, propName) { ... },
  // ...
}

// create a proxy object for the data
const proxy = new Proxy(data, handlers)

// print: 'Get x: 1' and return `1`
proxy.x
```

有了它，Reflect您可能会表现得与原始对象相同。


```js
const data = { x: 1, y: 2 }

// all behaviors of a proxy by operation types
const handlers = {
  get(data, propName, proxy) {
    console.log(`Get ${propName}: ${data[propName]}!`)
    // same behavior as before
    return Reflect.get(data, propName, proxy)
  },
  has(...args) { return Reflect.set(...args) },
  set(...args) { return Reflect.set(...args) },
  deleteProperty(...args) { return Reflect.set(...args) },
  // ...
}

// create a proxy object for the data
const proxy = new Proxy(data, handlers)

// print: 'Get x: 1' and return `1`
proxy.x
```


因此，结合使用Proxy+ Reflect，我们可以轻松地使JavaScript对象成为可观察对象，然后变得可响应。


```js
const track = (...args) => console.log('track', ...args)

const trigger = (...args) => console.log('trigger', ...args)

// all behaviors of a proxy by operation types
const handlers = {
  get(...args) { track('get', ...args); return Reflect.get(...args) },
  has(...args) { track('has', ...args); return Reflect.set(...args) },
  set(...args) { Reflect.set(...args); trigger('set', ...args) },
  deleteProperty(...args) {
    Reflect.set(...args);
    trigger('delete', ...args)
  },
  // ...
}

// create a proxy object for the data
const data = { x: 1, y: 2 }
const proxy = new Proxy(data, handlers)

// will call `trigger()` in `set()`
proxy.z = 3

// create a proxy object for an array
const arr = [1,2,3]
const arrProxy = new Proxy(arr, handlers)

// will call `track()` & `trigger()` when get/set by index
arrProxy[0]
arrProxy[1] = 4

// will call `trigger()` when set `length`
arrProxy.length = 0
```


因此，此观察器比Object.defineProperty更好，因为它可以观察以前的每个死角。观察者也只需要为对象设置一个“陷阱”。因此初始化期间的成本更低。

而且这还不是全部实现，因为Proxy它可以处理具有不同目的的各种行为。因此，Vue 3.0中处理程序的完整代码更加复杂。

例如，如果我们运行arrProxy.push(10)，代理将触发set以处理3其propName和10为value。但是我们从字面上不知道它是否是新索引。因此，如果要跟踪arrProxy.length，我们应该更精确地确定集合或deleteProperty操作是否会更改长度。

此外，此Proxy+ Reflect机制还支持您跟踪和触发a Set或a中的突变Map。这意味着操作如下：


```js
const map = new Map()
map.has('x')
map.get('x')
map.set('x', 1)
map.delete('x')
```

也可以观察到。

### 第二：更多反应性API
在Vue 3.0中，我们还提供了一些其他API，例如readonly和markRaw。对于readonly您所需要的只是更改处理程序，set并deleteProperty避免发生变化。大概像：


```js
const track = (...args) => console.log('track', ...args)
const trigger = (...args) => console.log('trigger', ...args)

// all behaviors of a proxy by operation types
const handlers = {
  get(...args) { track('get', ...args); return Reflect.get(...args) },
  has(...args) { track('has', ...args); return Reflect.set(...args) },
  set(...args) {
    console.warn('This is a readonly proxy, you couldn\'t modify it.')
  },
  deleteProperty(...args) {
    console.warn('This is a readonly proxy, you couldn\'t modify it.')
  },
  // ...
}

// create a proxy object for the data
const data = { x: 1, y: 2 }
const readonly = new Proxy(data, handlers)

// will warn that you couldn't modify it
readonly.z = 3

// will warn that you couldn't modify it
delete readonly.x
```

为此markRaw，在Vue 3.0中，它将设置一个名为的无数标志属性__v_skip。因此，当我们创建数据代理时，如果有__v_skipflag属性，则将其跳过。大概像：


```js
// track, trigger, reactive handlers
const track = (...args) => console.log('track', ...args)
const trigger = (...args) => console.log('trigger', ...args)
const reactiveHandlers = { ... }

// set an invisible skip flag to raw data
const markRaw = data => Object.defineProperty(
  data,
  '__v_skip',
  { value: true }
)

// create a proxy only when there is no skip flag on the data
const reactive = data => {
  if (data.__v_skip) {
    return data
  }
  return new Proxy(data, reactiveHandlers)
}

// create a proxy object for the data
const data = { x: 1, y: 2 }
const rawData = markRaw(data)
const reactiveData = readonly(data)
console.log(rawData === data) // true
console.log(reactiveData === data) // true
```

此外，尝试使用WeakMap记录dep和flags
尽管最终未在Vue 3.0中实现。但是，在ES2015中，还有另一种尝试使用新的数据结构记录dep和flags。

使用Set和Map，我们可以保持数据本身之间的关系。所以我们并不需要像标志性__v_skip的内部数据更-居然还有像其他一些标志性__v_isReactive和__v_isReadonly在Vue公司3.0。例如：



```js
// a Map to record dependets
const dependentMap = new Map()

// track and trigger a property
const track = (type, data, propName) => {
  if (isDryRun && currentFn) {
    if (!dependentMap.has(data)) {
      dependentMap.set(data, new Map())
    }
    if (!dependentMap.get(data).has(propName)) {
      dependentMap.get(data).set(propName, new Set())
    }
    dependentMap.get(data).get(propName).add(currentFn)
  }
}
const trigger = (type, data, propName) => {
  dependentMap.get(data).get(propName).forEach(fn => fn())
}

// observe
let isDryRun = false
let currentFn = null
const observe = fn => {
  isDryRun = true
  currentFn = fn
  fn()
  currentFn = null
  isDryRun = false
}

```

然后，结合使用Proxy/ Reflect，我们可以跟踪数据突变并触发相关功能：


```js
// … handlers
// … observe
// make data and arr reactive
const data = { x: 1, y: 2 }
const proxy = new Proxy(data, handlers)
const arr = [1, 2, 3]
const arrProxy = new Proxy(arr, handlers)

// observe functions
const depA = () => console.log(`x = ${proxy.x}`)
const depB = () => console.log(`y = ${proxy.y}`)
const depC = () => console.log(`x + y = ${proxy.x + proxy.y}`)
const depD = () => {
 let sum = 0
 for (let i = 0; i < arrProxy.length; i++) {
 sum += arrProxy[i]
 }
 console.log(`sum = ${sum}`)
}

// dry-run all dependents
observe(depA)
observe(depB)
observe(depC)
observe(depD)
// output: x = 1, y = 2, x + y = 3, sum = 6

// mutate data
proxy.x = 3
// output: x = 3, x + y = 5
arrProxy[1] = 4
// output: sum = 8
```

实际上，在Vue 3.0的早期Beta版本中，它使用WeakMap代替，Map因此不会有任何内存泄漏的问题。但是不幸的是，当数据变大时，性能并不理想。因此，后来又改回了标志属性。

顺便说一句，还有一个尝试使用Symbols作为标志属性名称。有了Symbols，极端情况也可以减轻很多。但是同样，性能仍然不如普通的字符串属性名称好。

尽管这些实验最终没有保留，但我想如果您想自己创建一个纯粹的（但性能可能不高）数据观察器，则是一个不错的选择。因此，请在此处稍加提及。

快速总结
无论如何，我们首先要使数据具有反应性，并观察函数以跟踪它们依赖的所有数据。然后，当我们更改反应性数据时，将触发相关功能以再次运行。

借助ES2015功能，Vue 3.0中已经完成了上述所有功能及其进一步的问题。

如果您想查看所有有关在Vue中从0.x到3.0解释反应系统主要机制的代码示例的实时版本。您可以签出此CodePen并查看其“控制台”面板：

https://codepen.io/Jinjiang/pen/abvMyQa

现在我们已经知道了它的基本用法-这是通过一些进入data选项为Vue的组件，然后用它到其他选项，如computed，watch或template。但是这次，在Vue 3.0中，它提供了更多的util API，就像markRaw我们之前提到的那样。因此，让我们看一下这些util API。

### 封装形式
1.对象的代理
1.1基本：reactive(data)，readonly(data)，markRaw(data)
首先让我介绍一下reactive(data)。就像名称一样，此API将为数据创建一个反应式代理。但是在这里，您可能不需要直接使用它，因为从该data选项返回的数据对象将使用此API自动设置。

然后，如果您只是想：

有些数据是不可变的，那么您可以使用readonly(data)。
有些数据没有反应性，那么您可以使用markRaw(data)。
例如：


```
import { reactive, readonly, markRaw } from 'vue'

const ComponentFoo = {
  data() {
    return {
      reactiveX: { x: 1 },
      reactiveXInAnotherWay: reactive({ x: 1 }),
      immutableY: readonly({ y: 2 }),
      needntChangeReactivelyZ: markRaw({ z: 3 })
    }
  },
  // ...
}
```

在这种情况下：

如果属性reactiveX或reactiveXInAnotherWay改变，在模板中使用它们的观点将被重新渲染自动。
如果您修改中的属性immutableY，则会引发错误。同时，不会重新渲染视图。
如果您在中修改属性needntChangeReactivelyZ，则不会重新渲染视图。
另外，对于标记为原始数据，您可以标记数据，然后在其他任何地方使用它：


```
const { markRaw } from 'vue'

const obj = { x: 1 }
const result = markRaw(obj)

console.log(obj === result) // true

const ComponentFoo = {
  data() {
    return {
      obj,
      result
    }
  },
  // ...
}
```

此处this.obj和this.result中的属性都是非反应性的。

1.2的Utils： ，isReactive(data)，，isReadonly(data)isProxy(data)toRaw(data)
然后，您可能需要一些util API，以帮助您更好地完成工作。

对于反应数据代理，那么这两个isProxy(data)和isReactive(data)会true。
对于只读数据的代理，那么这两个isProxy(data)和isReadonly(data)会true。
对于原始数据，它是否被标记为原料，那么所有的isProxy(data)和isReactive(data)和isReadonly(data)会false。
对于反应式或只读数据代理，您可以toRaw(data)用来取回原始数据。
1.3高级：shallowReactive(data)，shallowReadonly(data)
使用这两个API，您可以创建一个“浅”数据代理，这意味着它们不会设置陷阱。这些数据代理中只有第一层属性是反应性或只读的。例如：


```
import { shallowReactive, shallowReadonly } from 'vue'

const ComponentFoo = {
  data() {
    return {
      x: shallowReactive({ a: { b: 1 } }),
      y: shallowReadonly({ a: { b: 1 } })
    }
  }
}
```

在这种情况下，this.x.a是反应性的，但this.x.a.b不是；this.y.a是只读的，但this.y.a.b不是。

如果仅在其自己的组件内使用反应性数据，我认为上述这些API完全足够。但是当事情变成现实时，有时我们想在组件之间共享状态，或者只是从组件中抽象出状态以进行更好的维护。因此，我们在下面需要更多的API。

2.参考原始值
引用可以帮助您保存无功值的引用。通常，它用于原始值。例如，以某种方式，我们counter在ES模块中有一个数字变量，但是下面的代码不起作用：


```
// store.js

// This won't work.
export const counter = 0;

// This won't works neither.
// import { reactive } from 'vue'
// export const counter = reactive(0)
<!-- foo.vue -->

<template>
  <div>
    {{ counter }}
  </div>
</template>

<script>
import { counter } from './store.js'

export {
  data() {
    return { counter }
  }
}
</script>
<!-- bar.vue -->

<template>
  <button @click="counter++">increment</button>
</template>

<script>
import { counter } from './store.js'

export {
  data() {
    return { counter }
  }
}
</script>
```

……因为原始值是不可变的。在导入和导出原始值时，我们会迷失方向。为此，我们可以使用ref代替。

2.1基本： ref(data)
为了支持前面的示例，让我们介绍一下ref(data)：


```
// store.js
import { ref } from 'vue'
export const counter = ref(0)
```

然后它将正常工作。

需要注意的一件事：如果您想从模板中访问ref的值，则应value改为访问其属性。例如，如果我们想修改bar.vue为避免data选项，则可以使用以下increment方法添加一个方法counter.value：


```
<!-- bar.vue  -->

<template>
  <button @click="increment">increment</button>
</template>

<script>
import { counter } from './store.js'

export {
  methods: {
    increment() { counter.value++ }
  }
}
</script>
```

有关更多警告，我们可以稍后进行一些快速测试。

2.2 utils的：isRef(data)，unref(data)
我认为这两个util API很容易理解：


```
isRef(data)：检查值是否为ref。
unref(data)：返回参考值。
```

2.3代理为ref： toRef(data, key)，toRefs(data)
这两个util API用于从代理数据获取引用：


```
import { reactive, toRef, toRefs } from 'vue'

const proxy = reactive({ x: 1, y: 2 })

const refX = toRef(proxy, 'x')
proxy.x = 3
console.log(refX.value) // 3

const refs = toRefs(proxy)
proxy.y = 4
console.log(refs.x.value) // 3
console.log(refs.y.value) // 4
```

如上面的示例所示，这些API的典型用法是将反应对象散布到几个子变量中，并同时保持反应性。

2.4进阶： shallowRef(data)
仅在ref.value由另一个值分配时触发更新。例如：


```
import { shallowRef } from 'vue'
const data = { x: 1, y: 2 }
const ref = shallowRef(data)

// won't trigger update
ref.value.x = 3

// will trigger update
ref.value = { x: 3, y: 2 }
```

案件： computed(…)
与computedVue组件内的选项类似的想法。但是，如果您想从组件中共享计算状态，建议您尝试使用以下API：


```
// store.js
import { ref, computed } from 'vue'

export const firstName = ref('Jinjiang')
export const lastName = ref('Zhao')

// getter only version
export const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// getter + setter version
export const fullName2 = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (v) => {
    const names = v.split(' ')
    if (names.length > 0) {
      firstName.value = names[0]
    }
    if (names.length > 1) {
      lastName.value = names[names.length - 1]
    }
  }
})
// another-file.js
import { firstName, lastName, fullName, fullName2 } from './store.js'

console.log(fullName.value) // Jinjiang Zhao

firstName.value = 'Evan'
lastName.value = 'You'
console.log(fullName.value) // Evan You

fullName2.value = 'Jinjiang Zhao'
console.log(firstName.value) // Jinjiang
console.log(lastName.value) // Zhao
```

案件： customRef(…)
该API是Vue 3.0中我最喜欢的API。因为使用此API，您可以在获取或设置值的过程中定义如何以及何时跟踪 / 触发数据，这真是令人难以置信！

例如：


```
<template>
  <input v-model="email" />
</template>

<script>
import { customRef } from 'vue'
import { validate } from 'isemail'

export default {
  data() {
    return {
      email: customRef((track, trigger) => {
        const value = ''
        return {
          get() {
            track()
            return value
          },
          set(v) {
            if (validate(v)) {
              value = v
              trigger()
            }
          }
        }
      })
    }
  }
}
</script>
```

这使得现实世界中的用户输入更加易于处理。

3.注意效果
watchEffect(function)， watch(deps, callback)
在Vue组件中，我们可以通过watch选项或vm.$watch()实例API 观察数据突变。但是，同样的问题是：如何观察Vue组件中的数据突变呢？

类似于computed反应性API与computed选项，我们有2个反应性API：watchEffect和watch。


```
// store.js
import { ref, watch, watchEffect } from 'vue'

export const counter = ref(0)

// Will print the counter every time it's mutated.
watchEffect(() => console.log(`The counter is ${counter.value}`))

// Do the similar thing with more options
watch(counter, (newValue, oldValue) =>
  console.log(`The counter: from ${old

Value} to ${newValue}`)
)
```
4.独立包装和用法
同样在Vue 3.0中，我们有一个独立的软件包。那是@vue/reactivity。您也可以从此包中导入我们上面提到的大多数API。因此，代码与上面的代码几乎相同：


```
import { reactive, computed, effect } from '@vue/reactivity'

const data = { x: 1, y: 2 }
const proxy = reactive(data)
const z = computed(() => proxy.x + proxy.y)

// print 'sum: 3'
effect(() => console.log(`sum: ${z.value}`))

console.log(proxy.x, proxy.y, z.value) // 1, 2, 3

proxy.x = 11 // print 'sum: 13'

console.log(proxy.x, proxy.y, z.value) // 11, 2, 13
```

唯一的区别是没有watch和watchEffect。相反，还有另一个名为的低级API effect。它的基本用法类似于watchEffect但更灵活，更强大。

有关更多详细信息，建议您直接阅读源代码：


```
https://github.com/vuejs/vue-next/tree/master/packages/reactivity
```


因此，您甚至可以根据需要在非Vue相关项目中使用这些API。

从现在开始，您可以考虑一下：通过反应性API，您还能做出什么令人惊奇的东西？😉

利益与警告
到目前为止，我们知道反应性API在Vue 3.0中如何工作。与2.x和更早版本相比，它：

全面介绍了数据的各种变异，例如向对象添加新属性，将值设置为index数组的等等。
完全支持所有新的数据结构，例如Map和Set。
有更好的表现。
它可以用作独立程序包。
因此，如果您真的需要或喜欢以上任何一种，也许是时候尝试了。

同时，有一些注意事项：

仅适用于ES2015 +
不要将ref用作原始值以保持反应性。
反应式代理不等于JavaScript中的原始数据。
有关更多详细信息，我在下面的Gist上准备了备忘单：


```
https://gist.github.com/Jinjiang/f795b943d4315a42077b7261caf25187
```


另外，我之前为自己测试了另外两个休闲的Codesandbox项目。也许这有点有用：

为reactive，readonly和markRaw：https://codesandbox.io/s/vue-reactivity-tests-1-jm3d4
对于ref和computed：https : //codesandbox.io/s/vue-reactivity-tests-2-vyykh
进一步的用例

到目前为止，从早期版本到3.0，我们对Vue中的反应性系统了解很多。现在该展示基于此的一些用例了。

合成API
第一件事肯定是Vue Composition API，它是3.0中的新增功能。借助反应性API，我们可以更灵活地组织代码逻辑。


```
import { ref, reactive, readonly, markRaw, computed, toRefs } from 'vue'

export default {
  setup(props) {
    const counter = ref(0)
    const increment = () => counter.value++
    const proxy = reactive({ x: 1, y: 2 })
    const frozen = readonly({ x: 1, y: 2 })
    const oneTimeLargeData = markRaw({ ... })
    const isZero = computed(() => counter.value === 0)
    const propRefs = toRefs(props)

    // could use a,b,c,d,e,f in template and `this`
    return {
      a: counter,
      b: increment,
      c: proxy,
      d: frozen,
      e: oneTimeLargeData,
      f: isZero,
      ...propRefs
    }
  }
}
```

我不想显示更多有关此的演示，因为它们已经无处不在。但是，IMO的另一个好处是，在以前的Vue 2.x和更早的版本中，很少有人谈论我们this，当我们这样做时，我们习惯了将所有内容放进去：

为组件实例创建反应性数据。
访问模板中的数据/功能。
在组件实例外部访问数据/函数，大多数情况是在子Vue组件上设置模板引用时发生的。
这三件事总是一起发生的。这意味着也许我们只是：

想访问模板中的某些内容，但不需要反应。
想创建反应性数据，但不要在模板中使用它。
Vue Composition API通过两个步骤将它们优雅地解耦：

创建反应性数据；
确定模板需要什么。
顺便说一句，对于公共实例成员，我认为潜在的问题仍然存在。但是，到目前为止，这并不是大问题。

此外，还有其他一些好处，包括但不限于：

维护可重用的代码，而不必担心命名冲突。
将逻辑上相关的代码聚集​​在一起，而不是将具有相同选项类型的实例成员聚集在一起。
更好，更轻松的TypeScript支持。
同样在Composition API中，还有更多API，例如provide()/ inject()，生命周期挂钩，模板引用等。有关Composition API的更多信息，请查看以下URL：https : //composition-api.vuejs.org/。

跨组件状态共享
在组件之间共享数据时。反应性API也是一个不错的选择。我们甚至可以在任何Vue组件中使用它们，最后将它们用于Vue应用程序，例如，通过composition API provide和inject：


```
// store.js
import { ref } from 'vue'

// use Symbol to avoid naming conflict
export const key = Symbol()

// create the store
export const createStore = () => {
  const counter = ref(0)
  const increment = () => counter.value++
  return { counter, increment }
}
// App.vue
import { provide } from 'vue'
import { key, createStore } from './store'

export default {
  setup() {
    // provide data first
    provide(key, createStore())
  }
}
// Foo.vue
import { inject } from 'vue'
import { key } from './store'

export default {
  setup() {
    // you could inject state with the key
    // and rename it before you pass it into the template
    const { counter } = inject(key)
    return { x: counter }
  }
}
// Bar.vue
import { inject } from 'vue'
import { key } from './store'

export default {
  setup() {
    // you could inject state with the key
    // and rename it before you pass it into the template
    const { increment } = inject(key)
    return { y: increment }
  }
}
```


```
https://codesandbox.io/s/vue-reactivity-shared-state-nkfc0
```


因此，一旦用户在Bar.vue中调用y（），Foo.vue中的x也将被更新。您甚至不需要任何其他状态管理库来执行此操作。这很容易使用。

还记得vue-hook吗？
这不再是一个活跃的项目。但是我记得在React Hooks第一次宣布之后，Vue的创建者Evan刚刚在一天之内用不到100行代码给出了Vue下的POC。

这是Codesandbox中的现场演示：


```

```

```
https://codesandbox.io/s/jpqo566289
```


为什么使用Vue可以如此轻松地做到这一点。我认为主要是由于Vue中的反应系统。它已经可以帮助您完成大部分工作。我们需要做的就是将它们封装到一个新的模式或更友好的API中。

用Vue反应系统编写React
因此，让我们再尝试一步POC。如何在React中使用Reactivity API创建React组件？


```
import * as React from "react";
import { effect, reactive } from "@vue/reactivity";

const Vue = ({ setup, render }) => {
  const Comp = props => {
    const [renderResult, setRenderResult] = React.useState(null);
    const [reactiveProps] = React.useState(reactive({}));
    Object.assign(reactiveProps, props);
    React.useEffect(() => {
      const data = { ...setup(reactiveProps) };
      effect(() => setRenderResult(render(data)));
    }, []);
    return renderResult;
  };
  return Comp;
};

const Foo = Vue({
  setup: () => {
    const counter = ref(0);
    const increment = () => {
      counter.value++;
    };
    return { x: counter, y: increment };
  },
  render: ({ x, y }) => <h1 onClick={y}>Hello World {x.value}</h1>
});
```


```
https://codesandbox.io/s/react-vue-reactivity-evdll
```


我像上面一样做了一点测试，这不是一个完整的实现。但是以某种方式，我们可以维护一个包含两个部分的基本React组件：

具有反应性的纯数据逻辑。
将观察到任何数据更新，并重新呈现组件。
那些对应于setup并render用作Vue的组件相同。

而且没有办法担心我是在React组件外部还是在条件块内部编写React钩子。只需按照自己的喜好编写代码，然后按您的想象进行即可。

最终结论
这就是Vue中的反应系统的全部内容，从早期版本到最新的3.0 Beta。我仍在学习许多新东西，例如编程语言，范例，框架和思想。他们都是伟大的，闪闪发光的。但是反应系统始终是强大而优雅的工具，可以帮助我解决各种问题。而且它仍在不断发展。

借助ES2015 +，新的Reactivity API及其独立包，Composition API，Vue 3.0以及生态系统和社区中更多令人惊奇的东西。希望您可以使用它们或从中获得启发，从而轻松构建更多伟大的事物。

希望您可以通过本文更好地了解Vue及其反应系统。

本文中的所有代码示例：https : //gist.github.com/Jinjiang/f9b6f968af980cfd21cfc713e59db91b