# Promise 

我们就不再讲 Promise 的一堆 API

我们来讲讲能解决什么问题？

一个最大的特点就是解决回调地狱的问题，回调嵌套太深的问题


可能隐藏的一个出错问题

- 就比如一个 Promise 请求成功之后，在 then 处理中出问题，还是会被 catch 捕捉到错误

# 单一值得情况

```js
new Promise((resolve, reject) => {
  resolve(x)
})
```

# 　无法取消的 Promise

一旦创建了一个 Promise 并为其注册了完成和 / 或拒绝处理函数，如果出现某种情况使得
这个任务悬而未决的话，你也没有办法从外部停止它的进程。

