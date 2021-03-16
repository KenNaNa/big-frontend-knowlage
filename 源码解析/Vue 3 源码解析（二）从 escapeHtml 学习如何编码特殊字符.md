# Vue 3 源码解析（二）从 escapeHtml 学习如何编码特殊字符

### 格式化特殊符号
```js
// 定义 ",',&,<,> 这几个字符的正则表达式
const escapeRE = /["'&<>]/

export function escapeHtml(string) {
  // 先将传递进来的参数转成字符串
  const str = '' + string
  // 用 exec 执行，拿到 match
  const match = escapeRE.exec(str)
  // match 不存在直接返回 str
  if (!match) {
    return str
  }

  let html = ''
  let escaped
  let index
  let lastIndex = 0
  // 在匹配到的位置开始循环，替换 ",',&,<,>
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escaped = '&quot;'
        break
      case 38: // &
        escaped = '&amp;'
        break
      case 39: // '
        escaped = '&#39;'
        break
      case 60: // <
        escaped = '&lt;'
        break
      case 62: // >
        escaped = '&gt;'
        break
      default:
        continue
    }
    // 拼接字符串
    if (lastIndex !== index) {
      html += str.substring(lastIndex, index)
    }

    lastIndex = index + 1
    html += escaped
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html
}
```

### 格式化注释内容

```js
// 注释内容正则
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g
// 将注释内容替换成空格
export function escapeHtmlComment(src) {
  return src.replace(commentStripRE, '')
}
```
