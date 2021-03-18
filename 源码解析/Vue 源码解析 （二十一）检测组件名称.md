# Vue 源码解析 （二十一）检测组件名称

```js
// 检测组件名称是否合法
function checkComponents (options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}
// 
export function validateComponentName (name: string) {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
  // 检测组件名字是否合法
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }
  // 检测是否是内建标签，或者是内部保留标签
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}
```
