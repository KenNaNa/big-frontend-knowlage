```js
// 手写 call 方法
// var obj = {name: "Ken"}
// function fn() {console.log(this.name)}
// fn.call(obj, 1,2,3)
// Function.prototype.call = null
if(!Function.prototype.call) {
  var slice = Array.prototype.slice
  Function.prototype.call = function() {
    var thatFunc = this // fn
    var thatArg = arguments[0] // 拿到 obj
    var args = Array.from(arguments).slice(1)
    if(typeof thatFunc !== 'function') {
      new TypeError("不是函数")
    }

    thatArg.fn = thatFunc

    var res = thatArg.fn(...args)

    delete thatArg.fn

    return res
  }
  
}
```
