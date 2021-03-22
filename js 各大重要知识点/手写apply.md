```js
// 手写 Bind 方法
// var obj = {name: "Ken"}
// function fn() {console.log(this.name)}
// fn.apply(obj, [1,2,3])
if(!Function.prototype.apply) {
  var slice = Array.prototype.slice
  Function.prototype.apply = function() {
    var thatFunc = this // fn
    var thatArg = arguments[0] // 拿到 obj
    var args = Array.from(arguments).slice(1)
    if(typeof thatFunc !== 'function') {
      new TypeError("不是函数")
    }

    thatArg.fn = thatFunc

    var res = thatArg.fn(args)

    delete thatArg.fn

    return res
  }
  
}
```
