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


事件监听在DOM层面应用的比较广泛，各类鼠标事件、键盘事件等都是基于事件监听实现的。

消息通讯与事件监听原理类似，背后都是一个总线在调度(DOM事件存在事件冒泡和事件捕获机制)，在跨模块消息通信场景使用的比较多，大部分前端框架都自带消息通讯的功能。

Promise是JavaScript社区为了解决“回调地狱”问题而提出的一种解决方案，并且在ES6中被确立为正式规范。借助Promise对象我们可以将嵌套的异步操作转换为链式操作，大幅优化了复杂异步操作的代码。

ES6中还新增了一个Generator语法，通过合理封装(比如TJ大神的co库)，可以提供一种用同步写法写异步代码的能力。ES7以后ECMA组织将Generator在异步编程中的应用标准化，确立为Async/Await语法。

Async/Await被JavaScript社区公认为异步编程终极解决方案，在未来将逐渐成为异步编程方案首选。

值得一提的是，Async/Await中仍然会使用到Promise对象，Promise在未来的异步编程领域仍然是非常重要的组成部分，所以深刻理解Promise无论是在当下还是在未来，都是一件极具意义的事情。

可能有人觉得Promise很简单，不外乎promise.then().catch().finally()。在很流行的通讯库axios中，axios.then().catch().finally()也用的很多了，这不就够了吗？
  
那么来看几个工作中很可能遇到的问题：

1.	then的resolve/reject方法里返回一个Promise实例，会发生什么？

下列两种写法的结果有什么区别：

2. 	以下代码的输出是怎样的？（流程控制问题）

3.	catch(function(error){})和then(…, function(error){})有什么区别吗？

4.	finally语法的浏览器兼容性比较差(哪怕Chrome也仅在高版本支持)，如何自行实现finally功能？

5.	不同实现的Promise之间可以互相调用吗？比如原生Promise与Axios的协作。

6.	then方法接受两个参数，分别是成功回调函数和失败回调函数，如果不传入函数，会发生什么？

如果没有办法回答上述问题，实在不能大言不惭地宣称自己已经掌握Promise了。要想彻底弄清楚Promise的运作原理，何不亲手实现一个Promise？

Promise本身只是个规范，这几年社区先后提出过Promise/A规范、Promise/B规范、Promise/D规范等等，

当前主流的是Primise/A+规范(https://promisesaplus.com/)，所以本期手撕代码就手把手带大家用ES6实现一个符合Promise/A+规范的Promise对象。


# 基础架构

在Promise的构造函数中，定义几个基本变量，其中的_state负责保存Promise状态，状态仅有pending,resolved,rejected3种，且只允许通过_transition转换。

resolve和reject是个简单的状态变换函数，做为参数传递给executor，这样我们就能够用`new MyPromise((resolve, reject) => {})`的方式创建一个Promise实例。

此外，考虑到执行executor的过程中有可能出错，所以我们用try/catch块给包起来，并且

在出错后以catch到的值reject掉这个Promise


# 核心代码

在Promise/A+规范中，有那么几个关键点：

1.	只定义了then方法的规范，没有catch，race，all等方法，甚至没有构造函数
2.	then方法返回一个新的Promise
3.	不同Promise的实现需要可以相互调用(interoperable)


可以看到，整个Promise最核心的是then方法，接下来我们实现一下then。

then方法返回一个新的Promise实例，在这个新的Promise实例内部，我们将onResolved和onRejected包装为一个调度函数，保存到_callbacks数组里，并且调度函数内部用setTimeout实现异步执行。

为什么这里要异步执行？因为Promise的主体方法executor有可能是异步的，我们要确保then方法添加到executor后面去，就必须让then方法延迟执行，利用JavaScript的事件循环机制。

然后有个关键的方法resolveProcedure，这是做什么的呢？

这个方法的任务是以递归的方式不断地尝试执行返回值的then方法，直到返回值不再为thenable对象。

说的通俗一点，就是如果then中onResolved/onRejected方法返回的值具有then方法，那么就继续执行then方法，直到返回一个不可then的值。

这一步有两个意义：一个是如果then返回新的promise，那么会深入执行下去，直到得到最终值；另一个则是允许了不同实现的Promise之间可以互相调用，只要存在then方法，就会被深入执行，不对Promise的类型做判断。

# 异步调度

上一节中提到了then内部是异步执行的，我用setTimeout简单实现了异步执行，但是这是不准确的。

尽管Promise/A+规范没有明确定义，但原生Promise的实现(无论是浏览器还是nodejs中)都把then的异步置于micro-task中，而不是macro-task。

看不懂不要慌，先来科普一下JavaScript的事件循环机制知识。（这里主要讲浏览器

下的事件循环机制，NodeJS中的有差异，这里不展开。）

JavaScript因为是单线程执行的，所以异步任务都会被添加到事件队列中，当JavaScript引擎空闲的时候，就会轮询事件队列，取出其中就绪的任务执行，这就是所谓的事件循环机制(Event Loop)。

不过，事件队列并不是只有一个，浏览器下事件队列有两个，分别称为微任务队列(micro-task)和宏任务队列(macro-task或者叫task)，JavaScript会优先取微任务执行，直到微任务队列为空，再取一个宏任务出来执行，执行完一个宏任务，又会去检查微任务队列。也就是说微任务的优先级是高于宏任务的(微任务可以插宏任务的队)。


原生Promise是微任务，而我们用setTimeout实现的Promise变成了宏任务，

这样我们写的Promise是没办法插定时器的队的(比如先添加定时器再添加Promise，应当是先执行Promise后执行定时器)，这在有些场景下会存在问题。

这一节主要就是为了解决这个问题，在NodeJS下，我们可以用process.nextTick实现微任务，在浏览器下，一般用MutaionObserver实现。

MutaionObserver(https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)是用于监测DOM节点变化的方法，因为它监测到DOM节点变化后的回调函数是微任务，凑巧可以用来包装微任务方法。

我们实现一个nextTick方法，用这个方法替换之前的setTimeout方法即可实现微任务版本的Promise。

如果你还是不明白这么做到底有什么区别，那么可以分别用两种实现的MyPromise去执行下列代码，查看输出结果。

# 功能完善

其实到这里，Promise就已经实现好了，就像前面说的，Promise/A+规范里只定义了then方法，我们常用的catch, all之类都是不在规范内的。

不过一个好用的Promise实现必然需要一系列方法，这些方法其实都是基于then实现的，动手写写这些代码，可以进一步理解then的强大。


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
