# Vue 源码解析 （十三）$nextTick 源码分析

# flushCallbacks

用于处理回调函数调用方法
- 先拷贝了 callbacks.slice(0)
- callbacks.length = 0
- 循环调用 callback()

```js
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```
//这里我们使用微任务异步延迟包装器。
//在2.5中，我们使用了（宏）任务（与微任务结合使用）。
//但是，当状态在重新上色之前更改时，它有微妙的问题
//（例如。#6813，出入转换）。
//另外，在事件处理程序中使用（宏）任务会导致一些奇怪的行为
//无法规避（例如。#7109, #7153, #7546, #7834, #8109）.
//所以我们现在在任何地方都使用微任务。
//这种权衡的一个主要缺点是存在一些场景
//其中微任务的优先级太高，并且可能在两者之间触发
//顺序事件（例如。#4521, #6690，有规避措施）
//甚至是同一事件的冒泡之间（ #6566 ）。


# 兼容 Promise

```js
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
}
```

//nextTick行为利用微任务队列，可以访问
//通过本机承诺.then或Mutation观察者。
//Mutation观察者有更广泛的支持，但它被严重窃听
//iOS中的UIWebView>=9.3.3在触摸事件处理程序中触发。
//触发几次后完全停止工作...所以，如果是本地的
//承诺可用，我们将使用它：

# 兼容 MutationObserver

```js
else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
}
```

# 兼容 setImmediate

```js
else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
}
```

# 兼容 setTimeout

```js
else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```

# nextTick

- 先把回调放进一个 callbacks 队列中
- 然后再集体进行宏任务或者微任务调用

```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

所以，从源码分析我们可以知道，为什么官网会有有两种方式：


- 一种给 nextTick(cb) 传递回调函数
- 一种是 不给 nextTick() 传递参数，里面默认是使用 Promise
