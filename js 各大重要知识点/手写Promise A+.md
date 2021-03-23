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
