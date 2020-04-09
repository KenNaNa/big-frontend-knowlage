# Object.entries

# 语法
```js
Object.entries(obj)

/*
Object.entries()返回一个数组，其元素是与直接在上找到的可枚举字符串键属性对相对应的数组。属性的顺序与手动循环对象的属性值所给出的顺序相同。[key, value]object
*/ 
```

# 例子

```js
const obj = {name: "Ken", sex: "男", hobby: "coder"}

console.log(Object.entries(obj)) // [Array(2), Array(2), Array(2)]

// array like object
const obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.entries(obj)); // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]

// array like object with random key ordering
const anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.entries(anObj)); // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]


// getFoo is property which isn't enumerable
const myObj = Object.create({}, { getFoo: { value() { return this.foo; } } });
myObj.foo = 'bar';
console.log(Object.entries(myObj)); // [ ['foo', 'bar'] ]

// non-object argument will be coerced to an object
console.log(Object.entries('foo')); // [ ['0', 'f'], ['1', 'o'], ['2', 'o'] ]


// returns an empty array for any primitive type, since primitives have no own properties
console.log(Object.entries(100)); // [ ]

// iterate through key-value gracefully
const obj = { a: 5, b: 7, c: 9 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
}


// Or, using array extras
Object.entries(obj).forEach(([key, value]) => {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
});
```

# 将转换Object为Map
该new Map()构造函数接受一个可迭代的entries。使用Object.entries，您可以轻松地从转换Object为Map：
```js
const obj = { foo: 'bar', baz: 42 }; 
const map = new Map(Object.entries(obj));
console.log(map); // Map { foo: "bar", baz: 42 }
```

# 遍历 Object
```js
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj).forEach(([key, value]) => console.log(`${key}: ${value}`)); // "foo: bar", "baz: 42"
```

# Polyfill

```js
if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
  };
}
```