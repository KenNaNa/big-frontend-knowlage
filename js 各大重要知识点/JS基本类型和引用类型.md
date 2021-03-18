# 内存分类

1. 栈内存

数据在栈内存中的存储方式，遵循后进先出的原则。栈内存包括了变量的标识符和变量的值，在栈内存中存储的数据的大小及生存周期是必须确定的

```js
var a = 2

a 即是变量标识符
2 即是变量的值
```

2. 堆内存

数据在堆内存中存储的顺序随意，堆内存用来存放所有引用类型的的数据，它的存储空间较大，在栈内存中存储的数据的大小无需固定。

```js
var obj = {
  name: "小仙女",
  sex: "女"
}

obj 即是变量的标志
对应的值是指向 obj 的地址
```

看个简单的例子：

```js
// 例子1
console.log(b)
function b() { }
var b = 2

// 例子2
console.log(b)

var b = 2

function b() { }
```

3. 引用即地址

# 基本数据类型

在 JavaScript 中有 undefined, null, string, number, boolean, symbol

像这些基本数据类型都会存在栈内存中，

```js
var u = undefined
var n = null
var str = "Ken"
var num = 2
var bool = true
var sym = Symbol("ken")
```

```js
     堆内存
变量标志 | 变量的值
u            undefined
n            null
str          "Ken"
num          2
bool         true
sym          Symbol("Ken")
```

# 引用类型

除了基本类型，其他都是引用类型

1. Function
2. Object
3. Array
4. Date
5. RegExp

引用类型存在栈内存中的是对应的地址，即所谓的指针。

引用类型的存储需要内存的栈内存和堆内存共同完成，栈内存用来保存变量标识符和指向堆内存中该对象的指针，也可以说是该对象在堆内存的地址。

堆内存中保存对象的内容。而它们的内存地址（指针）和堆内存中的值是对应的。

```js
var a=[1,2,3];
var b={ m: 1 }; 
```

如下图，数组a和对象b的变量标识符和指针保存在栈内存中，而它们的具体值保存在堆内存中。

![](https://github.com/zhangxinmei/summary/raw/master/img/p7.png)

# 基本类型赋值问题

```js
var a = 20;
var b = 30;
var c = b;
var c = 40
console.log(a); // 20
console.log(b); // 30
console.log(40); // 40
```

在面试过程中，我可能经常会被问道这是为啥？这是因为在栈内存中，数据发生赋值的情况，系统会自动为其创建新的内存，两个值是互相独立的，没有影响，尽管 c 的值被修改了。

![](https://github.com/zhangxinmei/summary/raw/master/img/p3.png)

# 引用类型赋值问题

```js
var a = {name: "Ken"}
var b = a
b.name = "小仙女"
console.log(a); // {name: "小仙女"}
console.log(b); // {name: "小仙女"}
```
对于引用类型赋值问题，因为我们已经知道引用类型的存储是栈内存和堆内存共同完成的，

一开始m保存了一个实例化的对象，这时将m赋值给n后，m和n都指向了这个实例化的对象，

虽然他们的内存地址不一样，但是他们指向的对象是一样的，因此只要其中一个引用类型改变另一个引用类型也会跟着改变。

![](https://github.com/zhangxinmei/summary/raw/master/img/p4.png)


# 发出疑问

请谈谈深复制跟浅复制？

