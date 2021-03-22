```js
// 手写 Bind 方法
// var obj = {name: "Ken"}
// function fn() {console.log(this.name)}
// fn.bind(obj)(1,2,3)


if(!Function.prototype.bind) {
  var slice = Array.prototype.slice;
  Function.prototype.bind = function() {
    var thatFunc = this
    var thatArg = arguments[0]
    if(typeof thatFunc !== 'function') {
      throw new TypeError("不是函数")
    }

    return function() {
      // slice.call(arguments) 将参数转成 数组
      var funArgs = arguments.concat(slice.call(arguments))
      return thatFunc.apply(thatArg, funArgs)
    }
  }
}
```
