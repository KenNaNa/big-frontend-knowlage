# 语法
```js
Object.assign(target, ...sources)
// target 目标对象
// source 原目标
// 返回值 目标对象
```

# 复制一个对象
```js
const obj = {a: 1}
const copy = Object.assign({}, obj)
console.log(copy)
```

# 深拷贝问题
针对深拷贝，需要使用其他办法，因为 Object.assign()拷贝的是属性值。假如源对象的属性值是一个对象的引用，那么它也只指向那个引用
```js
let obj1 = { name: "Ken" , hobby: { code: "前端工程师"}}; 
let obj2 = Object.assign({}, obj1); 
console.log(JSON.stringify(obj2)); // { name: "Ken" , hobby: { code: "前端工程师"}}; 


obj1.name = "KenNaNa"; 
console.log(JSON.stringify(obj1)); // { name: "KenNaNa" , hobby: { code: "前端工程师"}}; 
console.log(JSON.stringify(obj2)); // { name: "Ken" , hobby: { code: "前端工程师"}}; 



obj2.name = "ljw"; 
console.log(JSON.stringify(obj1)); //  { name: "KenNaNa" , hobby: { code: "前端工程师"}}; 
console.log(JSON.stringify(obj2)); // { name: "ljw" , hobby: { code: "前端工程师"}}; 


obj2.hobby.code = "front-end"; 
console.log(JSON.stringify(obj1)); // { name: "KenNaNa" , hobby: { code: "front-end"}}; 
console.log(JSON.stringify(obj2)); // { name: "ljw" , hobby: { code: "front-end"}}; 


// Deep Clone 
obj1 = { name: "Ken" , hobby: { code: "前端工程师"}}; 
let obj3 = JSON.parse(JSON.stringify(obj1)); 
obj1.name = 4; 
obj1.hobby.code = "front-end"; 
console.log(JSON.stringify(obj3)); // { name: "Ken" , hobby: { code: "前端工程师"}}; 
```

# 合并对象
```js
const target = {name: "Ken"}
const source1 = {sex: '男'}
const source2 = {hobby: '投资理财，写代码'}
const obj = Object.assign(target, source1, source2)
console.log(obj) // {name: "Ken", sex: '男', hobby: '投资理财，写代码'}
console.log(target) // {name: "Ken", sex: '男', hobby: '投资理财，写代码'}
```

# 合并具有相同属性的对象
```js
const target = {name: "Ken", hobby: '写代码'}
const source1 = {sex: '男', hobby: '投资理财'}
const source2 = {hobby: '写文章'}
const obj = Object.assign(target, source1, source2)
console.log(obj) // {name: "Ken", sex: '男', hobby: '写文章'}
console.log(target) // {name: "Ken", sex: '男', hobby: '写文章'}
```

# 拷贝 symbol 类型的属性
```js
const target = {name: "Ken"}
const source = {[Symbol('foo')]: 2}
const obj = Object.assign({}, target, source)
console.log(obj) // {name: "Ken", Symbol(foo): 2}
Object.getOwnPropertySymbols(obj) // [Symbol(foo)]
```

# 继承属性和不可枚举属性是不能拷贝的

```js
const obj = Object.create({foo: "Ken"}, // foo 是个继承属性
  {
    bar: {
      value: 2, // bar 是个不可枚举属性
    },
    baz: {
      value: 3,
      enumerable: true  // baz 是个自身可枚举属性。
    }
  }
)

const copy = Object.assign({}, obj)
console.log(copy) // {baz: 3}
```

# 原始类型会被包装为对象
```js
const name = "Ken"
const sex = "男"
const hobby = "coder"
const v4 = Symbol("name")
const obj = Object.assign({}, name, sex, hobby, v4, null, undefined)

console.log(obj) // {0: "c", 1: "o", 2: "d", 3: "e", 4: "r"}
```

# 拷贝访问器
```js
const obj = {
  foo: 1,
  get bar() {
    return 2;
  }
};

let copy = Object.assign({}, obj); 
console.log(copy); // { foo: 1, bar: 2 } copy.bar的值来自obj.bar的getter函数的返回值

// 下面这个函数会拷贝所有自有属性的属性描述符
function completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // Object.assign 默认也会拷贝可枚举的Symbols
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}

copy = completeAssign({}, obj);
console.log(copy);
// { foo:1, get bar() { return 2 } }

```

# Polyfill

```js
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      let to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (let nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
```