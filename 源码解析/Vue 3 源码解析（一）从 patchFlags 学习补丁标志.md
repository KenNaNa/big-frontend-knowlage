补丁标志是编译器生成的优化提示。
当在差异过程中遇到具有动态儿童的块时，算法
进入“优化模式”。在这种模式下，我们知道vdom是由
编译器生成的渲染函数，因此算法只需要
处理由这些修补程序标志显式标记的更新。

补丁标志可以使用|位运算符组合，并可以检查
使用&运算符，例如。

```js
const flag = TEXT | CLASS
if (flag & TEXT) { ... }
```
检查'../../runtime-core/src/renderer.ts'中的`patchElement`函数，查看如何
标志在差异期间处理。

```js
export const enum PatchFlags {
  /**
   * 指示具有动态textContent的元素（子快速路径）
   */
  TEXT = 1,

  /**
   * 表示具有动态类绑定的元素
   */
  CLASS = 1 << 1,

  /**
   * 指示具有动态样式的元素
   * 编译器将静态字符串样式预编译为静态对象
   * + 检测并提升内联静态对象
   * e.g. style="color: red" and :style="{ color: 'red' }"
   *   const style = { color: 'red' }
   *   render() { return e('div', { style }) }
   */
  STYLE = 1 << 2,

  /**
   * 指示具有非类/样式动态道具的元素。
   * 也可以在具有任何动态 props 的组件上(包括
   * class/style)。当存在此标志时，vnode也有一个动态 props
   * 包含props 键的数组，这些键可能会更改，因此运行时
   * 可以更快地区分它们（而不必担心被移除的props）
   */
  PROPS = 1 << 3,

  /**
   * 指示具有带有动态键的props的元素。当keys改变时，一个完整的
   * 删除旧keys始终需要差异。此标志相互
   * 需要单独提供 class,style,props
   */
  FULL_PROPS = 1 << 4,

  /**
   * 表示具有事件监听器的元素（需要附加事件监听器）
   * 
   */
  HYDRATE_EVENTS = 1 << 5,

  /**
   * 指示其子顺序不变的片段。
   */
  STABLE_FRAGMENT = 1 << 6,

  /**
   * Indicates a fragment with keyed or partially keyed children
   */
  KEYED_FRAGMENT = 1 << 7,

  /**
   * 指示具有无 key 子项的片段。
   */
  UNKEYED_FRAGMENT = 1 << 8,

  /**
   * 指示只需要非props修补的元素，例如ref或
   * 指令（onVnodeXXX钩子）。因为每个修补的vnode都会检查引用
   * 和onVnodeXXX钩子，它只是标记vnode，以便父块
   * 会追踪它的。
   */
  NEED_PATCH = 1 << 9,

  /**
   * 表示具有动态插槽的组件（例如引用v-for的插槽）
   * 迭代值或动态插槽名称)。
   * 具有此标志的组件始终强制更新。
   */
  DYNAMIC_SLOTS = 1 << 10,

  /**
   * 指示仅因为用户已放置
   * 模板根级别的注释。这是一个仅开发的标志，因为
   * 注释在生产中被剥离。
   */
  DEV_ROOT_FRAGMENT = 1 << 11,

  /**
  *特殊旗帜------------------------------------------------------------
  *特殊标志为负整数。它们永远不会与使用相匹配
  *按位运算符(按位匹配应仅发生在以下分支中
  *补丁标志>0)，与互斥。检查特殊情况时
  *标志，只需检查补丁标志===标志。
  */

  /**
  *表示挂起的静态vnode。这是一个提示，水合作用可以跳过
  *整个子树，因为静态内容永远不需要更新。
  */
  HOISTED = -1,
  /**
  *一个特殊标志，指示差异算法应退出
  优化模式的*。例如，在由渲染槽（）创建的块片段上
  *遇到非编译器生成的插槽时(即手动写入
  *渲染函数，应始终完全不同)
  *或手动克隆VNode
  */
  BAIL = -2
}
```

### PatchFlagNames

```js
export const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.HYDRATE_EVENTS]: `HYDRATE_EVENTS`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.DEV_ROOT_FRAGMENT]: `DEV_ROOT_FRAGMENT`,
  [PatchFlags.HOISTED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`
}
```
