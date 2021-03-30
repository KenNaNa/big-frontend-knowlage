# 手写 JSONP

```js
const jsonp = function(url, data) {
  return new Promise((resolve, reject) => {
    // 初始化
    let dataString = url.indexOf('?') === -1 ? '?' : '&'
    let callbackName = `jsonpCB_${Date.now}`
    url += `${dataString}callback=${callbackName}`
    if(data) {
      // 有请求参数，依次添加到 url
      for(let k in data) {
        url += `&${k}=${data[k]}`
      }
    }
    let jsNode = document.createElement('script')
    jsNode.src = url
    // 触发 callback，触发后删除 js 标签和绑定在 window 上的 callback
    window[callbackName] = result => {
      delete window[callbackName]
      document.body.removeChild(jsNode)
      if(result) {
        resolve(result)
      } else {
        reject("没有返回数据")
      }
    }
    // js 加载异常的情况
    jsNode.addEventListener('error', () => {
      delete window[callbackName]
      document.body.removeChild(jsNode)
      reject("JavaScript资源加载失败")
    }, false)

    // 添加 js 节点到 document 上时，开始请求
    document.body.appendChild(jsNode)
  })
}

jsonp('http://192.168.0.103:8081/jsonp', {a: 1, b: 'heiheihei'})
      .then(result => { console.log(result) })
      .catch(err => { console.error(err) })
```
