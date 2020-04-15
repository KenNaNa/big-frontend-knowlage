# Object.getOwnPropertyDescriptor

# 语法

```js
Object.getOwnPropertyDescriptor(obj, prop)
```

# 例子
```js
var o, d;

o = { get foo() { return 17; } };
d = Object.getOwnPropertyDescriptor(o, 'foo');
// d is {
//   configurable: true,
//   enumerable: true,
//   get: /*the getter function*/,
//   set: undefined
// }

```

```js
o = { bar: 42 };
d = Object.getOwnPropertyDescriptor(o, 'bar');
// d is {
//   configurable: true,
//   enumerable: true,
//   value: 42,
//   writable: true
// }

o = { [Symbol.for('baz')]: 73 }
d = Object.getOwnPropertyDescriptor(o, Symbol.for('baz')); 
// d is {
//   configurable: true,
//   enumerable: true,
//   value: 73,
//   writable: true
// }
```

```js
o = {};
Object.defineProperty(o, 'qux', {
  value: 8675309,
  writable: false,
  enumerable: false
});
d = Object.getOwnPropertyDescriptor(o, 'qux');
// d is {
//   value: 8675309,
//   writable: false,
//   enumerable: false,
//   configurable: false
// }
```