# `Object.defineProperty()` 用来直接在一个 `Object` 对象上定义一个新的属性，或者修改属性

我们都知道，像 `Vue2.0` 这样的框架，数据都具有响应式，就是使用 `Object.defineProperty()` 作了拦截，重新对数据进行处理，但是我们似乎对其是怎么拦截的，重新定义一个属性，属性是否可以修改，遍历，等等都是一知半解的，今天有幸学习

### 基本语法
```js
Object.defineProperty(obj, prop, descriptor)

// obj 要修改属性的对象
// prop 要修改的属性
// descriptor 对这个属性一些规则的指定
```

### 规则指定
1. `configurable` 当且仅当其值为 `true` 时，才能被修改，删除
2. `enumerable` 当且仅当其值为 `true` 时，才会出现在对象的枚举属性中
3. `value` 该属性对应的值, 默认为 `undefined`
4. `writable` 当且仅当其值为 `true` 时，才能被赋值运算
5. `get` 其实就是获取的意思
6. `set` 其实就是设置的意思


### 注意点

记住，这些选项不一定是自身属性，也要考虑继承来的属性。为了确认保留这些默认值，在设置之前，可能要冻结 `Object.prototype`，明确指定所有的选项，或者通过 `Object.create(null)` 将 `__proto__` 属性指向 `null`。


### 使用 `__proto__`
```js
var obj = {};
var descriptor = Object.create(null); // 没有继承的属性
// 默认没有 enumerable，没有 configurable，没有 writable
descriptor.value = 'static';
Object.defineProperty(obj, 'key', descriptor);
console.dir(descriptor)

/**
Object
  value: "static"
**/
```

### 显示定义
```js
var obj = {}
Object.defineProperty(obj, "key", {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "static"
});
console.dir(obj)
/**
Object 
  key: "static" 
  __proto__: Object
    constructor: ƒ Object()
    hasOwnProperty: ƒ hasOwnProperty()
    isPrototypeOf: ƒ isPrototypeOf()
    propertyIsEnumerable: ƒ propertyIsEnumerable()
    toLocaleString: ƒ toLocaleString()
    toString: ƒ toString()
    valueOf: ƒ valueOf()
    __defineGetter__: ƒ __defineGetter__()
    __defineSetter__: ƒ __defineSetter__()
    __lookupGetter__: ƒ __lookupGetter__()
    __lookupSetter__: ƒ __lookupSetter__()
    get 
      __proto__: ƒ __proto__()
    set __proto__: ƒ __proto__()
**/ 
```

### 循环使用同一对象
```js
// 循环使用同一对象
var obj = {}
function withValue(value) {
  var d = withValue.d || (
    withValue.d = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
  );
  d.value = value;
  return d;
}
// ... 并且 ...
Object.defineProperty(obj, "key", withValue("static"));
cosole.dir(obj)
```

### freeze
```js
// 如果 freeze 可用, 防止后续代码添加或删除对象原型的属性
// （value, get, set, enumerable, writable, configurable）
(Object.freeze||Object)(Object.prototype);
```

### 在对象中添加一个属性与数据描述符的示例
```js
// 在对象中添加一个属性与数据描述符的示例
var cO = {}
Object.defineProperty(cO, 'name', {
  value : 'Ken',
  writable : true,
  enumerable : true,
  configurable : true
})

console.dir(cO) // Object
console.log(cO.name) // Ken
cO.name = "KenNaNa" // writable: true 可赋值
for(let key in cO) { // enumerable: true 可枚举
  console.log(cO[key]) // KenNaNa
}
```

### 在对象中添加一个设置了存取描述符属性的示例
```js
var Co = {}
var name = 'Ken';
Object.defineProperty(Co, "name", {
  // 使用了方法名称缩写（ES2015 特性）
  // 下面两个缩写等价于：
  // get : function() { return bValue; },
  // set : function(newValue) { bValue = newValue; },
  get() { return name; },
  set(newName) { name = newName; console.log("重新设置了 name 属性")},
  enumerable : true,
  configurable : true
});
console.log(Co.name) // Ken
console.log(Co.name == name) // true
console.log(Co.name === name) // true

Co.name = "KenNaNa"
/*
Ken
true
true
重新设置了 name 属性
"KenNaNa"
*/ 
```

### 数据描述符和存取描述符不能混合使用
```js
var Co = {}
Object.defineProperty(Co, 'name', {
  value: "Ken",
  get(){return "KenNaNa"}
})
/*
报错
Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute, #<Object>
    at Function.defineProperty (<anonymous>)
    at <anonymous>:2:8
*/ 
```

### 修改属性
当 writable 属性设置为 false 时，该属性被称为“不可写的”。它不能被重新赋值
```js
var Co = {}
Object.defineProperty(Co, 'name', {
  value: "Ken",
  writable: false
})
Co.name = "KenNaNa"
/*
Co.name = "KenNaNa"
"KenNaNa"
Co.name
"Ken"
*/ 
```

### strict mode
```js
(function() {
  'use strict';
  var Co = {}
  Object.defineProperty(Co, 'name', {
    value: "Ken",
    writable: false
  })
  Co.name = "KenNaNa"
})()
/*
Uncaught TypeError: Cannot assign to read only property 'name' of object '#<Object>'
    at <anonymous>:8:11
    at <anonymous>:9:3
*/ 
```

### Enumerable 属性
```js
// 可以被 for in 或者 Object.keys() 进行遍历
var Co = {};
Object.defineProperty(Co, "name", { value : "Ken", enumerable: true });
Object.defineProperty(Co, "age", { value : 18, enumerable: false });
Object.defineProperty(Co, "sex", { value : "男" }); // enumerable 默认为 false
Co.hobby = "coder"; // 如果使用直接赋值的方式创建对象的属性，则 enumerable 为 true
Object.defineProperty(Co, Symbol.for('e'), {
  value: 5,
  enumerable: true
});
Object.defineProperty(Co, Symbol.for('f'), {
  value: 6,
  enumerable: false
});

for (var i in Co) {
  console.log(i);
}
// logs 'a' and 'd' (in undefined order)

Object.keys(Co); // ['a', 'd']

Co.propertyIsEnumerable('name'); // true
Co.propertyIsEnumerable('age'); // false
Co.propertyIsEnumerable('sex'); // false
Co.propertyIsEnumerable('hobby'); // true
Co.propertyIsEnumerable(Symbol.for('e')); // true
Co.propertyIsEnumerable(Symbol.for('f')); // false

var p = { ...Co }
p.name // 1
p.age // undefined
p.sex // undefined
p.hobby // 4
p[Symbol.for('e')] // 5
p[Symbol.for('f')] // undefined
```

### Configurable 属性
configurable 特性表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改

```js
var Co = {};
Object.defineProperty(Co, 'a', {
  get() { return 1; },
  configurable: false
});

Object.defineProperty(Co, 'a', {
  configurable: true
}); // throws a TypeError
Object.defineProperty(Co, 'a', {
  enumerable: true
}); // throws a TypeError
Object.defineProperty(Co, 'a', {
  set() {}
}); // throws a TypeError (set was undefined previously)
Object.defineProperty(Co, 'a', {
  get() { return 1; }
}); // throws a TypeError
// (even though the new get does exactly the same thing)
Object.defineProperty(Co, 'a', {
  value: 12
}); // throws a TypeError // ('value' can be changed when 'configurable' is false but not in this case due to 'get' accessor)

console.log(Co.a); // logs 1
delete Co.a; // Nothing happens
console.log(Co.a); // logs 1
```

### 自定义 Setters 和 Getters
```js
function Teacher() {
  var className = null
  var students = []

  Object.defineProperty(this, 'className', {
    get: function() {
      console.log('get!');
      return className;
    },
    set: function(value) {
      className = value;
      students.push({ val: className });
    }
  })

  this.getStudents = function() { return students; };
}
var arc = new Teacher();
arc.className; // 'get!'
arc.className = 11;
arc.className = 13;
arc.getStudents(); // [{ val: 11 }, { val: 13 }]
```




