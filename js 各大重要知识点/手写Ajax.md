[手写Ajax](https://github.com/ClimbYU/blog/issues/14)

```js
var Ajax = {
  get: function(url, fn) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
        fn.call(this, xhr.responseText)
      }
    }
    xhr.send()
  },
  post: function(url, data, fn) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
        fn.call(this, xhr.responseText)
      }
    }
    xhr.send(data)
  }
}
```

[手写一个ajax请求](https://blog.csdn.net/yesir_mao/article/details/93185843)

1. 需求：手动写一个 ajax 请求
2. 实现如下：
3. 获取异步请求对象

```js
function getXhr() {
  var xhr = null
  if(window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHttp")
  }
  return xhr
}
```

4. 创建 ajax 函数

```js
function ajax({url, type, data, dataType}) {
  return new Promise(function(resolve, reject) {
    // 1. 创建异步请求对象
    var xhr = getXhr()
    
    // 2. 监听事件
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        var res = null
        if(dataType ! == undefined && dataType.toLowerCase() === 'json') {
          res = JSON.parse(xhr.responseText)
        } else {
          res = xhr.responseText
        }
        
        resolve(res)
      } else {
        reject(xhr.responseText)
      }
    }
    
    // 如果请求方式为 get
    if(type.toLowerCase() === 'get' && data !== undefined) {
      url += "?"+data
    }
    
    // 打开链接
    xhr.open(type, url, true)
    
    // 如果是 post
    if(type.toLowerCase() === 'post') {
      xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    }
    
    // 发送请求
    if(type.toLowerCase() === 'post' && data !== undefined) {
      xhr.send(data)
    } else {
      xhr.send(null)
    }
  })
}
```
