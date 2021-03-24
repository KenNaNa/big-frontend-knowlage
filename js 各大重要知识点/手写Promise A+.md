```js
// 实现三种状态："pending", "fulfilled", "rejected"
// 实现 then 方法两种回调函数处理
class Promise {
  constructor(excutorCallback) {
    this.status = "pending" // 初始状态 "pending"
    this.value = undefined // 保存值
    this.fulfillAry = [] // fulfilled 回调函数数组
    this.rejectedAry = [] // rejected 回调函数数组
    // 执行
    let resolveFn = result => {
      if(this.status !== 'pending') return ;
      let timer = setTimeout(() => {
        this.status = 'fulfilled'
        this.value = result
        this.fulfillAry.forEach(item => item(this.value))
      }, 0)
    }

    let rejectFn = reason => {
      if(this.status !== 'pending') return ;
      let timer = setTimeout(() => {
        this.status = 'rejected'
        this.value = reason
        this.rejectedAry.forEach(item => item(this.value))
      }, 0)
    }
    // 执行回调函数
    try {
      excutorCallback(resolveFn, rejectFn)
    } catch(err) {
      rejectFn(err)
    }
  }
  // 实现 then 方法
  then(fulfilledCallback, rejectedCallback) {
    this.fulfillAry.push(fulfilledCallback)
    this.rejectedAry.push(rejectedCallback)
  }
}
```
  
# 测试代码
  
```js
// 测试代码

let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    Math.random()<0.5?resolve(100):reject(-100);
  }, 1000)
}).then(res => {
  console.log(res);
}, err => {
  console.log(err);
})
```
  
# 完成链式效果
  
[手写Promise A+](https://blog.csdn.net/weixin_42098339/article/details/90291285)

# 手写 Promise

### 基本结构

本期手撕代码，我准备来玩一下Promise，在玩Promise之前，有必要先了解一下异步编程的知识。

对于前端开发来说，会遇到很多异步的场景，比如发起网络请求、定时器、DOM事件等。由于JavaScript解释引擎是单线程的，为了避免触发阻塞操作时(网络请求、文件读写、延时函数等)造成的程序卡死现象，我们必须使用异步编程的方式来处理阻塞操作。

JavaScript的发展过程中，异步编程的方式大致有以下几种：

- 1.	回调函数
- 2.	事件监听
- 3.	消息通讯
- 4.	Promise对象
- 5.	Generator的异步应用
- 6.	Async/Await


回调函数是最基础的异步编程方式，通常我们将一个异步操作分为两部分，第一部分发起异步操作，异步操作完成后，执行第二部分。

这里执行的第二部分，我们称为回调函数。当然，回调函数不意味着异步，同步操作也是可以使用回调函数机制的，

只是回调函数的形式非常适合用来处理异步操作，所以我们看到大量的异步编程代码都采用了这种方式。

回调函数的问题在于，当异步操作比较复杂的时候，会出现回调函数层层嵌套的情况，非常混乱，难以管理，被称为“回调地狱”。




```js
/**
 * 一个符合Promise/A+规范的自定义Promise对象
 */
class MyPromise {
  // Promise基础框架
  constructor(executor) {
    this._state = 'pending' // Promise当前的状态
    this._value = undefined // Promise的值
    this._callbacks = [] // Promise的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面

    if (typeof executor === 'function') {
      const resolve = (value) => {
        this._transition('resolved', value)
      }
      const reject = (reason) => {
        this._transition('rejected', reason)
      }
      try {
        executor(resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
  }

  /**
   * 状态转移方法
   * 保证状态只能从pending转移resolved或rejected
   */
  _transition(state, value) {
    if (this._state === 'pending') {
      this._state = state
      this._value = value
      this._callbacks.forEach((callback) => callback())
    }
  }

  /**
   * then是Promise对象的核心方法
   */
  then(onResolved, onRejected) {
    // then方法永远返回一个新的Promise对象
    let newPromise = new MyPromise((resolve, reject) => {
      const scheduleFn = () => {
        // then内部必须异步执行且原生Promise在事件循环中属于micro-task
        // 浏览器环境可以用MutationObserver实现micro-task
        // nodejs环境可以通过process.nextTick实现micro-task
        // 如果没有可用的micro-task实现方式，则降级使用setTimeout来异步执行
        // 由于setTimeout属于macro-task，所以效果跟原生Promise会有些许差异
        nextTick(() => {
          // 实现值的穿透
          onResolved = typeof onResolved === 'function' ? onResolved : v => v
          onRejected = typeof onRejected === 'function' ? onRejected : v => { throw v }
          try {
            const x = this._state === 'resolved' ? onResolved(this._value) : onRejected(this._value)
            resolveProcedure({
              resolve,
              reject,
              newPromise
            }, x)
          } catch (e) {
            reject(e)
          }
        })
      }
      // 处于pending状态时将执行方法压入栈中
      if (this._state === 'pending') {
        this._callbacks.push(scheduleFn)
      } else {
        scheduleFn()
      }
    })
    return newPromise
  }

  /**
   * Promise/A+规范只定义了then，以下方法都是基于then的扩展
   */

  /**
   * catch方式是只有reject处理的then方法
   */
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * finally方法无论状态为resolved还是rejected都会执行一次指定函数
   */
  finally(fn) {
    const p = this.constructor
    return this.then(
      value => p.resolve(fn()).then(() => value),
      error => p.reject(fn()).then(() => { throw error })
    )
  }

  /**
   * resolve返回一个一定是resolved状态的Promise对象
   */
  static resolve(value) {
    return new MyPromise((resolve, reject) => resolveProcedure({
      resolve,
      reject: resolve
    }, value))
  }

  /**
   * reject返回一个一定是rejected状态的Promise对象
   */
  static reject(reason) {
    return new MyPromise((resolve, reject) => resolveProcedure({
      resolve: reject,
      reject
    }, reason))
  }

  /**
   * 当所有Pormise执行完后执行
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const done = 0
      const total = promises.length
      for (const promise of promises) {
        MyPromise.resolve(promise).then((value) => {
          done++
          if (done === total) {
            return resolve(value)
          }
        }, (reason) => {
          return reject(reason)
        })
      }
    })
  }

  /**
   * 任意一个promise执行完就执行
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      for (const promise of promises) {
        MyPromise.resolve(promise).then((value) => {
          return resolve(value)
        }, (reason) => {
          return reject(reason)
        })
      }
    })
  }

  /**
   * Promise测试例promises-aplus-tests的执行入口
   */
  static deferred() {
    const dfd = {}
    dfd.promise = new MyPromise((resolve, reject) => {
      dfd.resolve = resolve
      dfd.reject = reject
    })
    return dfd
  }
}

/**
 * 正确链式处理Promise的关键方法
 * 若then方法返回一个thenable对象(即可以继续执行then函数的对象)，尝试执行then方法
 * 直到返回一个非thenable的值或抛出异常
 */
function resolveProcedure({
  resolve,
  reject,
  newPromise
}, x) {
  // 避免循环依赖
  if (newPromise === x) {
    reject(new TypeError(x))
  }

  // 返回值仍然是MyPromise对象则尝试继续执行then
  if (x instanceof MyPromise) {
    x.then((value) => resolveProcedure({
      resolve,
      reject,
      newPromise
    }, value), (reason) => reject(reason))
  } else if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
    // 只要返回的函数拥有then方法，都会尝试以Promise的形式继续执行
    // 这就保证了不同实现Promise之间可以相互调用
    let resovleOrRejected = false
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, (value) => {
          if (!resovleOrRejected) {
            resolveProcedure({
              resolve,
              reject,
              newPromise
            }, value)
            resovleOrRejected = true
          }
        }, (reason) => {
          if (!resovleOrRejected) {
            reject(reason)
            resovleOrRejected = true
          }
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (!resovleOrRejected) {
        reject(e)
      }
    }
  } else {
    resolve(x)
  }
}

/**
 * 异步处理方法
 * 尽量使用micro-task的方式出触发异步
 * 浏览器环境用MutationObserver实现micro-task
 * nodejs环境用process.nextTick实现micro-task
 */
function nextTick(fn) {
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }
  if (typeof window === 'undefined') {
    process.nextTick(fn)
  } else if (typeof window.MutationObserver !== 'undefined') {
    const node = document.createTextNode('')
    new MutationObserver(fn).observe(node, { characterData: true })
    node.data = true
    console.log('here')
  } else if (typeof Promise !== 'undefined' && isNative(Promise)) {
    Promise.resolve(undefined).then(fn)
  } else {
    setTimeout(fn, 0)
  }
}

try {
  module.exports = MyPromise
} catch (e) {}
```

测试代码：

```js
const MyPromise = require('./my-promise')

console.log('MyPromise Test')
const myPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log('Executor')
    resolve('then')
  }, 0)
}).then(data => {
  console.log(data)
  throw new Error('catch')
}).catch(e => {
  console.log('catch')
})

console.log('Event Loop Test')
console.log(1)
setTimeout(() => {
  console.log(2)
})
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log(3)
    setTimeout(() => {
      console.log(4)
    })
    resolve()
  })
}).then(() => {
  console.log(5)
})
console.log(6)

new Promise((resolve, reject) => {
  reject('Error')
}).then(value => {
  console.log(value)
}).catch(error => {
  console.log(error)
})

new Promise((resolve, reject) => {
  resolve('Test')
})
.then()
.then()
.then()
.then(value => {
  console.log(value)
})
```
