要知道 `this` 指向问题，需要知道函数调用栈，函数调用的位置。

先来看看以下这个例子：

```js
function baz() {
    // 当前调用栈：baz
    // 因此，当前调用位置是全局作用域

    console.log("baz")
    bar(); // bar 的调用位置
}

function bar() {
    // 当前调用栈是 baz -> bar
    // 因此，当前调用位置在 baz

    console.log("bar")
    foo(); // foo 调用位置
}

function foo() {
    // 当前调用栈是 baz -> bar -> foo
    // 因此，当前调用位置在 bar 中
    console.log("foo")
}

baz() // baz 的调用位置
```

# 绑定规则

### 独立函数调用

```js
function foo() {
  console.log(this.a)
}

var a = 10
foo() // 10
```

在本例子中 `this` 默认指向了 `window` 全局对象

为什么呢？

因为，函数调用时不带其他修饰的函数调用，使用默认绑定 `this` 到全局 `window` 对象上。

### 隐式绑定

非严格模式下，函数调用 this 指向调用者。

```js
function foo() {
 console.log( this.a );
}
var obj = {
 a: 2,
 foo: foo
};
obj.foo(); // 2
```

### 隐式丢失

把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式。

```js
function foo() {
 console.log( this.a );
}
var obj = {
 a: 2,
 foo: foo
};
var bar = obj.foo; // 函数别名！

var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global" 调用的位置是在全局对象上的，所以 this 指向了 window
```

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时：

```js
function foo() {
 console.log( this.a );
}
function doFoo(fn) {
 // fn 其实引用的是 foo
 fn(); // <-- 调用位置！
}
var obj = {
 a: 2,
 foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo( obj.foo ); // "oops, global" 实际上 this 也是指向 window 的
```

将函数传入内置函数呢：

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a:2,
    foo:foo
}

var a = "oops, global"; // a 是全局对象上的属性
setTimeout(obj.foo, 100) // "oops, global" 也是指向了 window
```

### 显式绑定

使用 call,apply,bind 方式来绑定

```js
function foo() {
 console.log( this.a );
}
var obj = {
 a:2
};
foo.call( obj ); // 2
```

上面这种方式就好像下面这样定义，只是换了一种方式

```js
function foo(){
  console.log(this.a)
}

var obj = {
  a: 2,
  foo: foo
}

obj.foo() // 2
```

如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 `this` 的绑定对象，

这个原始值会被转换成它的对象形式（也就是 `new String(..)`、`new Boolean(..)` 或者 `new Number(..)）`。这通常被称为“装箱”。

```js
function foo() {
 console.log( this.a );
}
var obj = {
 a:2
};
foo.call( 2 ); // undefined
```

### 硬绑定

```js
function foo() {
    console.log( this.a )
}

var obj = {
    a:2
}

var bar = function() {
    foo.call(obj)
}

bar() // 2

setTimeout(bar, 100) // 2
```

硬绑定的典型应用场景就是创建一个包裹函数，负责接收参数并返回值：

```js
function foo(something) {
    console.log(this.a, something)
    return this.a + something
}

var obj = {
    a: 2
}

var bar = function() {
    return foo.apply(obj, arguments)
}

var b = bar(3) // 2 3
console.log(b) // 5
```

另一种使用方法是创建一个可以重复使用的辅助函数：

```js
function foo(something) {
 console.log( this.a, something );
 return this.a + something;
}
// 简单的辅助绑定函数
function bind(fn, obj) {
 return function() {
    return fn.apply( obj, arguments );
 };
}
var obj = {
 a:2
};
var bar = bind( foo, obj );
var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

es6 提供的 bind 方法

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
}

var bar = foo.bind(obj)

var b = bar(3) // 2 3

console.log(b) // 5
```

循环中的 this 绑定

```js
function foo(el) {
    console.log(el, this.id)
}

var obj = {
    id: "awesome"
}

var arr = [1,2,3]

arr.forEach(foo, obj);

// 1 "awesome"
// 2 "awesome"
// 3 "awesome"
```


顺便来看看 forEach, map 的核心区分：

```js
function foo(el) {
    console.log(el, this.id)
}

var obj = {
    id: "awesome"
}

var arr = [1,2,3]

var res = arr.map(foo, obj);

console.log("map===>", res)


var eachRes = arr.forEach(foo, obj)

console.log("each===>", eachRes)


// 1 "awesome"
// 2 "awesome"
// 3 "awesome"
// map===> (3) [undefined, undefined, undefined] // 返回数组
// 1 "awesome"
// 2 "awesome"
// 3 "awesome"
// each===> undefined // 返回undefined
```

new 操作

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。

- 创建（或者说构造）一个全新的对象。
- 这个新对象会被执行 [[Prototype]] 连接。
- 这个新对象会绑定到函数调用的 this。
- 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

以下是我根据上面这个思路实现的代码

```js
function newOP(fn) {
    var obj = Object.create(null)
    var fnProto = Object.create(fn.__proto__)
    obj.__proto__ = fnProto

    var res = fn.apply(obj, arguments)

    return res ? res : obj
}
```

# this词法

箭头函数在创建的过程就绑定了 this 的指向问题，我们可以考虑以下这个问题：

```js
function foo() {
 // 返回一个箭头函数
 return (a) => {
 //this 继承自 foo()
 console.log( this.a );
 };
}
var obj1 = {
 a:2
}; 

var obj2 = {
 a:3
}

var bar = foo.call(obj1)
bar.call(obj2); // 2 而不是 3
```

箭头函数最常用于回调函数中，例如事件处理器或者定时器：

```js
function foo() {
 setTimeout(() => {
 // 这里的 this 在词法上继承自 foo()
 console.log( this.a );
 },100);
}
var obj = {
 a:2
};
foo.call( obj ); // 2
```
