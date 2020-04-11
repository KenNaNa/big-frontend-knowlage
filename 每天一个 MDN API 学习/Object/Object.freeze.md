# 冻结对象
```js
var obj = {
  prop: function() {},
  foo: 'bar'
}

obj.foo = 'baz'
obj.lumpy = 'woof'
delete obj.prop

// 冻结

var o = Object.freeze(obj)

o === obj // true

Object.isFrozen(obj) // true

// Now any changes will fail
obj.foo = 'quux'; // silently does nothing
// silently doesn't add the property
obj.quaxxor = 'the friendly duck';


// Attempted changes through Object.defineProperty; 
// both statements below throw a TypeError.
Object.defineProperty(obj, 'ohai', { value: 17 });
Object.defineProperty(obj, 'foo', { value: 'eit' });

// It's also impossible to change the prototype
// both statements below will throw a TypeError.
Object.setPrototypeOf(obj, { x: 20 })
obj.__proto__ = { x: 20 }
```

# 冻结数组

```js
let a = [0]
Object.freeze(a)

a[0] = 1

function fail() {
  "use strict"
  a[0] = 1
}

fail()

a.push(2) // 报错
```

被冻结的对象是不可变的。但是，它不一定是常数。下面的示例显示冻结的对象不是恒定的（冻结很浅）

```js
obj1 = {
  internal: {}
};

Object.freeze(obj1);
obj1.internal.a = 'aValue';

obj1.internal.a // 'aValue'
```

# 浅冻结
```js
var employee = {
  name: "Mayank",
  designation: "Developer",
  address: {
    street: "Rohini",
    city: "Delhi"
  }
};

Object.freeze(employee);

employee.name = "Dummy"; // fails silently in non-strict mode
employee.address.city = "Noida"; // attributes of child object can be modified

console.log(employee.address.city) // Output: "Noida"
```

# 深度冻结

```js
function deepFreeze(object) {

  // Retrieve the property names defined on object
  var propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self
  
  for (let name of propNames) {
    let value = object[name];

    if(value && typeof value === "object") { 
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

var obj2 = {
  internal: {
    a: null
  }
};

deepFreeze(obj2);

obj2.internal.a = 'anotherValue'; // fails silently in non-strict mode
obj2.internal.a; // null
```
为了使对象不可变，请递归冻结每个对象类型的属性（深度冻结）。当您知道对象在参考图中不包含循环时，请根据您的设计逐个使用该模式，否则将触发无限循环。对的增强deepFreeze()是拥有一个接收路径（例如Array）参数的内部函数，因此您可以deepFreeze()在对象变为不可变的过程中抑制递归调用。您仍然有冻结不应该冻结的对象的风险，例如[window]