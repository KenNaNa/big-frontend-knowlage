# 前言
Vue的响应式原理虽然实现的很精妙，但是受限于JavaScript机制，存在部分不够优雅的地方。Vue的作者已经宣布，下一代Vue将使用ES6的Proxy语法来实现响应式系统，彻底解决ES5 defineProperty语法的缺陷。当然，因为ES6的Proxy是个不能polyfill的新特性，这种响应式系统无法兼容低版本浏览器。

浏览器兼容是新一代数据绑定机制的主要阻力，不过我们还是可以期待一下，未来的数据绑定一定会是基于Proxy实现的，毕竟这种实现是真香啊！

Vue 3.0里正式发布尚且还早，甚至有很多人给Vue作者尤大留言让其别出新版本了，前端开发人员真的学不动了……当然这只是个调侃:）。

本期手撕代码尝试使用ES6的Proxy语法实现一个数据绑定机制，这个看起来很恢宏的目标其实并不难。

# Proxy是什么

简单理解下，Proxy的get/set和defineProperty的get/set有些相似，主要区别是defineProperty修改的是原对象，是强侵入性的语法，而Proxy不修改原对象，生成一个代理对象，是无侵入性的语法。

此外Proxy可以完美解决数组**的问题，一切都非常优雅。

# 实现
其实基于Proxy的数据绑定与Vue现有的基于defineProperty的数据绑定基本一致，所以首先我们先搞一份基于defineProperty的数据绑定代码（自己写的或者网上搜的都可以）。

然后，实现基于Proxy的数据绑定只需要将defineProperty的部分替换为Proxy语法，移除数组的特殊处理代码，继承观察者模式的那套写法，基本就可以了。

```js
class Observer {
  constructor(obj) {
    const dep = new Dep()
    let proxy = new Proxy(obj, {
      get (target, key, receiver) {
        const val = Reflect.get(target, key, receiver)
        if (key === '__ob__') return val
        if (Array.isArray(val) || Object.prototype.toString.apply(val) === '[object Object]') {
          if (val.hasOwnProperty('__ob__')) {
            return val['__ob__']
          } else {
            return new Observer(val)
          }
        }
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set (target, key, value, receiver) {
        Reflect.set(target, key, value, receiver)
        dep.notify()
        return true
      },
      deleteProperty(target, prop) {
        Reflect.deleteProperty(target, prop)
        dep.notify()
      }
    })

    Object.defineProperty(obj, '__ob__', {
      enumerable: false,
      writable: false,
      configureable: true,
      value: proxy
    })

    return proxy
  }
}

class Watcher {
  constructor(fn) {
    this.update = function() {
      Dep.target = this
      fn()
      Dep.target = null
    }
    this.update()
  }
}

class Dep {
  constructor() {
    this.subs = []
    this.addSub = function(watcher) {
      this.subs.push(watcher)
    }
    this.notify = function() {
      this.subs.forEach(watcher => {
        watcher.update()
      })
    }
  }
}

window.onload = function() {
  var data = {
    a: [],
    b: 'Test data'
  }
  window.proxy = new Observer(data)
  new Watcher(function() {
    document.querySelector("#output_value").innerHTML = window.proxy.b;
  })
  new Watcher(function() {
    document.querySelector("#output_array").innerHTML = window.proxy.a.length;
  })
}
```

index.html

```html
<!DOCTYPE html>
<html>
<head>
  <title>Proxy响应式原理</title>
  <script type="text/javascript" src="./proxy-reactive.js"></script>
  <style type="text/css">
    .container {
      width: 400px;
      margin: 200px auto;
    }
    button {
      width: 100px;
      height: 60px;
    }
    p {
      margin-left: 10px;
    }
    span {
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class='container'>
    <p>Proxy响应式原理</p>
    <p style="margin-bottom: 30px">按F12在控制台修改全局变量proxy，查看界面变化</p>
    <div style="margin-bottom: 30px">
      <span>变量b的值为：</span>
      <span id='output_value'></span>
    </div>
    <div>
      <span>数组a的长度为：</span>
      <span id='output_array'></span>
    </div>
  </div>
</body>
</html>
```


