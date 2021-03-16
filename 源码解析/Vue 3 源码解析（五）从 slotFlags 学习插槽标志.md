```js
export const enum SlotFlags {
  /**
  *仅引用插槽道具或上下文状态的稳定插槽。插槽
  *可以完全捕获它自己的依赖关系，因此当传递到父级时，父级将不会
  *需要强制孩子更新。
  */
  STABLE = 1,
  /**
  *引用作用域变量（v-for或外部插槽props）的插槽，或
  *具有条件结构（v-if、v-for）。父级将需要强制
  *要更新的子项，因为插槽未完全捕获其依赖项。
  */
  DYNAMIC = 2,
  /**
  * `<slot/>`转发到子组件中。父级是否需要
  *更新子项取决于父项本身的插槽类型
  *收到。这必须在运行时进行改进，当子节点的vnode
  *正在创建（在`标准化child'中）
  */
  FORWARDED = 3
}

/**
 * Dev only
 */
export const slotFlagsText = {
  [SlotFlags.STABLE]: 'STABLE',
  [SlotFlags.DYNAMIC]: 'DYNAMIC',
  [SlotFlags.FORWARDED]: 'FORWARDED'
}

```
