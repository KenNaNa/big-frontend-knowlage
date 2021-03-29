# Promise

Promise 是异步编程的一种解决方案，比传统的解决方案回调函数和事件更合理和更强大。

有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

一个Promise的当前状态必须为以下三种状态中的一种：等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected），状态的改变只能是单向的，且变化后不可在改变。

一个Promise必须提供一个 then 方法以访问其当前值、终值和据因。

promise.then(onFulfilled, onRejected)回调函数只能执行一次，且返回 promise 对象

Promise的每个操作返回的都是Promise对象，可支持链式调用。

通过 then 方法执行回调函数，Promise的回调函数是放在事件循环中的微队列。

Promise的具体用法如下（背代码）：

```js
 function fn(){
     return new Promise((resolve, reject)=>{
         成功时调用 resolve(数据)
         失败时调用 reject(错误)
     })
 }
 fn().then(success1, fail1).then(success2, fail2)
```

# Promise.all

Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
Promise.all([promise1, promise2]).then(success1, fail1)
```

promise1和promise2都成功才会调用success1

# Promise.race

Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
 Promise.race([promise1, promise2]).then(success1, fail1)

```

promise1和promise2只要有一个成功就会调用success1
