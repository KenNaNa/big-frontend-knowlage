# 手写函数柯里化（Curry）--原理剖析

### 函数柯理化的作用

前端使用柯里化的用途主要就是简化代码结构，提高系统的维护性，一个方法，只有一个参数，强制了功能的单一性，很自然就做到了功能内聚，降低耦合。

### 函数柯理化的优点

降低代码的重复，提高代码的适用性。 （在后面实现应用部分 ajax 会体现出来调用时的代码精简）

### 函数柯理化的实现

调用形式

```js
function add(a,b,c,d){
  return a + b + c + d;
};
var newAdd = Curry(add);    //将add函数柯里化  经过柯理化返回一个新的函数
//柯里化之后的newAdd函数执行方式，传入剩余的参数。
newAdd(1)(2)(3)(4);  
newAdd(1,2)(3,4);
newAdd(1,2,3)(4);
newAdd(1,2,3,4);
newAdd(1)(2,3,4);
newAdd(1)(2,3)(4);

```

实现

```js
function fixedParamsCurry(fn) {
  var _arg = [].slice.call(arguments, 1)
  return fucntino() {
    var newArgs = _arg.concat([].slice.call(arguments, 0))
    return fn.apply(this, newArgs)
  }
}

var newAdd = fixedParamsCurry(add, 1)

console.log(newAdd(2,3,4))
```

[手写函数柯里化（Curry）--原理剖析](https://blog.csdn.net/Ahuagcs/article/details/103910741)
