- for..in 循环可以用来遍历对象的可枚举属性列表（包括 [[Prototype]] 链）

```js
Array.prototype.has = function(){} // 实际开发，千万不要这样写
var arr = [1,2,3]
for(var i in arr) {
    console.log(arr[i])
}

// 1
// 2
// 3
// ƒ (){}
```

这个问题之前在开发的时候，碰到过，就是有的人使用 Array 在原型上定义了一些全局污染原型的方法，因为我们的项目大多数都是 用的 for in 循环导致数据渲染出问题了。

所以千万不要自作主张的在 原型上定义方法，做出污染原型链的方式。

- forEach

忽略返回值

```js
Array.prototype.has = function(){} // 实际开发，千万不要这样写
var arr = [1,2,3]
for(var i in arr) {
    console.log(arr[i])
}

arr.forEach(console.log)
// 1 0 (3) [1, 2, 3]
// 2 1 (3) [1, 2, 3]
// 3 2 (3) [1, 2, 3]
```

- map

有返回数组值

```js
Array.prototype.has = function(){} // 实际开发，千万不要这样写
var arr = [1,2,3]
var res = arr.map(console.log)
// 1 0 (3) [1, 2, 3]
// 2 1 (3) [1, 2, 3]
// 3 2 (3) [1, 2, 3]

console.log("res", res)
```

- every

会一直运行直到回调函数返回 false（或者“假”值）

```js
Array.prototype.has = function(){} // 实际开发，千万不要这样写
var arr = [1,2,3]
// for(var i in arr) {
//     console.log(arr[i])
// }

var res = arr.every(function(item) {
    console.log("item", item)
})

console.log(res)
```

- some

会一直运行直到回调函数返回 true（或者
“真”值）

```js
Array.prototype.has = function(){} // 实际开发，千万不要这样写
var arr = [1,2,3]
// for(var i in arr) {
//     console.log(arr[i])
// }

var res = arr.every(function(item) {
    console.log("item", item)
})
// 1 0 (3) [1, 2, 3]
// 2 1 (3) [1, 2, 3]
// 3 2 (3) [1, 2, 3]

var res = arr.some(function(item) {
    console.log(item)
})

console.log("res", res)
```

- for of

循环迭代器


