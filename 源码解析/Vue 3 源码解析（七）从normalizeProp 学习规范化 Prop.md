### isNoUnitNumericStyleProp

```js
export const isNoUnitNumericStyleProp = /*#__PURE__*/ makeMap(
  `animation-iteration-count,border-image-outset,border-image-slice,` +
    `border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,` +
    `columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,` +
    `grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,` +
    `grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,` +
    `line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,` +
    // SVG
    `fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,` +
    `stroke-miterlimit,stroke-opacity,stroke-width`
)
```

### parseStringStyle

解析 string 类型的 style

```js
// 规定正则，// style="color: red; font-size: 16px;" 用于解析
const listDelimiterRE = /;(?![^(]*\))/g 
const propertyDelimiterRE = /:(.+)/

export function parseStringStyle(cssText) {
  const ret = {}
  cssText.split(listDelimiterRE).forEach(item => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE)
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return ret
}

/*
解析的例子
style = "color: red; font-size: 18px"

解析之后

ret = {color: 'red', 'font-size': '18px'}
*/
```

### normalizeStyle

```js
export function normalizeStyle(value) {
  // 检测数组
  if (isArray(value)) {
    const res = {}
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      const normalized = normalizeStyle(
        isString(item) ? parseStringStyle(item) : item
      )
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key]
        }
      }
    }
    return res
  } else if (isObject(value)) {
    return value
  }
}
```

### normalizeClass

```js
export function normalizeClass(value) {
  let res = ''
  if (isString(value)) {
    res = value
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      // 合并多个 class
      const normalized = normalizeClass(value[i])
      if (normalized) {
        res += normalized + ' '
      }
    }
  } else if (isObject(value)) {
    // 判断是否是对象
    for (const name in value) {
      if (value[name]) {
        res += name + ' '
      }
    }
  }
  return res.trim()
}
```
