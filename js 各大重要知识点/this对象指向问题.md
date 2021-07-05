# 什么情况下会涉及 `this`

- **函数作用域的情况下，才会有 `this` 绑定问题**
- **或者 `class` 类**
- **使用 `call,apply, bind`**

1. 严格模式 "use strict"
2. 非严格模式


# 严格模式下的 `this` 指向问题

1. 普通函数，`this` 指向 `undefined`，不使用 `call,bing,apply` 改变其 `this` 指向的情况下

```js
console.log("window===>",this) // Window 对象
function foo() {
    function bar() {
        console.log("bar ===>",this) // window
    }
    console.log("foo", this) // window
    return bar
}
var bar = foo();

bar()

var a = () => {
    console.log("a===>", this) // window 对象

    var b = () => {console.log("b===>", this)}
    b() // window 对象

    function c() {console.log("c===>", this)}
    c() // window
}

a()
```

2. 箭头函数：在不使用 `call,apply,bind` 改变 `this` 情况下，`this` 指向 window

```js
"use strict";

var a = () => {
    console.log("a===>", this) // window 对象

    var b = () => {console.log("b===>", this)}
    b() // window 对象

    function c() {console.log("c===>", this)}
    c() // undefined
}

a()
```

# 非严格模式下

1. 普通函数，`this` 指向 `window`，不使用 `call,bing,apply` 改变其 `this` 指向的情况下

```js
function foo() {
    function bar() {
        console.log("bar ===>",this) // window
    }
    console.log("foo", this) // window
    bar()
}
foo();
```

2. 箭头函数：在不使用 `call,apply,bind` 改变 `this` 情况下，`this` 指向 window

```js
var a = () => {
    console.log("a===>", this) // window

    var b = () => {console.log("b===>", this)}
    b() // window

    function c() {console.log("c===>", this)}
    c() // window
}

a()
```

# 非严格模式下，`this` 指向问题

在一个 obj 中定义一个函数：

```js
var a = "Ken"
var obj = {
    a: "小仙女",
    fn: function() {console.log("fn===>", this.a)}
}

obj.fn() // "小仙女" // 此时 this 指向 obj

// 变体 1
var fn = obj.fn 
fn() // "Ken" 此时 this 指向 window

// 变体 2

var a = "Ken"
var obj = {
    a: "小仙女",
    fn: () => {console.log("fn===>", this.a)}
}

obj.fn() // "Ken" this 指向 window

var fn = obj.fn
fn() // “Ken” this 指向 window

// 变体 3

var a = "Ken"
var obj = {
    a: "小仙女",
    b: {
        a: "===>obj.b",
        fn: function() {console.log("obj.b===>", this.a)}
    }
}

obj.b.fn() // "===>obj.b" this 指向 obj.b

var fn = obj.b.fn
fn() // Ken this 指向 window

// 变体 4

var a = "Ken"
var obj = {
    a: "小仙女",
    b: {
        a: "===>obj.b",
        fn: () => {console.log("obj.b===>", this.a)}
    }
}

obj.b.fn() // "Ken" this 指向 window

var fn = obj.b.fn
fn() // "Ken" this 指向 window
```

# 在严格模式下：

```js
"use strict";
var a = "Ken"
var obj = {
    a: "小仙女",
    fn: function() {console.log("fn===>", this.a)}
}

obj.fn() // "小仙女" // 此时 this 指向 obj

// 变体 1
var fn = obj.fn 
fn() // Uncaught TypeError: Cannot read property 'a' of undefined


// 变体 2

"use strict";
var a = "Ken"
var obj = {
    a: "小仙女",
    fn: () => {console.log("fn===>", this.a)}
}

obj.fn() // “Ken” this 指向 window

var fn = obj.fn
fn() // "Ken" this 指向 window

// 变体 4

        "use strict";
var a = "Ken"
var obj = {
    a: "小仙女",
    b: {
        a: "===>obj.b",
        fn: () => {console.log("obj.b===>", this.a)}
    }
}

obj.b.fn() // "Ken" this 指向 window

var fn = obj.b.fn
fn() // "Ken" this 指向 window
```

从上面的观察，以及实践，我们或许可以得出一个结论：

-  **箭头函数 `this` 指向问题跟作用域有关系，他会沿着作用域链一层层往外找，最先找到那个具有作用域，就将 `this` 绑定在那个作用域上，如果找不到，就直接绑定在全局作用域上**

- **普通函数的 `this` 指向，取决于在那个对象上执行，this 就执行谁**

# call,apply.bind

发现个小问题，貌似 箭头函数无法在执行阶段改变 `this` 指向问题

```js
var a = "Ken"
var obj = {
    a: "小仙女",
    b: {
        a: "===>obj.b",
        fn: () => {console.log("obj.b===>", this.a)}
    }
}

obj.b.fn() // "Ken" this 指向 window

var fn = obj.b.fn
fn.call(obj) // "Ken" this 指向 window
fn.apply(obj) // "Ken" this 指向 window
fn.bind(obj)() // "Ken" this 指向 window
```

非箭头函数情况：

```js
var a = "Ken"
var obj = {
    a: "小仙女",
    b: {
        a: "===>obj.b",
        fn: function() {console.log("obj.b===>", this.a)}
    }
}

obj.b.fn() // "====>obj.b" this 指向 obj.b

var fn = obj.b.fn
fn.call(obj) // this 指向 obj // "小仙女"

fn.apply(obj) // this 指向 obj // "小仙女"

fn.bind(obj)() // this 指向 obj // "小仙女"
```

# class 类

```js
class Person {
    constructor(name) {
        this.name = name
        console.log("Person===>", this) // this 指向实例对象
    }
}


var p = new Person("小仙女")
```

