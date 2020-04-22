# Object.hasOwnProperty

# 注意
hasOwnProperty即使该属性的值为null 或者 undefined，也返回true 。
```js
var obj = new Object()
obj.name = null;
obj.hasOwnProperty('name');   // returns true
obj.hobby = undefined;  
o.hasOwnProperty('hobby');   // returns true
```

# 使用hasOwnProperty测试一个属性的存在

```js
var obj = new Object()
obj.hasOwnProperty('name');   // returns false
obj.hobby = 'coder';  
o.hasOwnProperty('hobby');   // returns true
```

# 直接属性与继承属性
```js
var obj = new Object();
obj.name = 'ken';
obj.hasOwnProperty('name');             // returns true
obj.hasOwnProperty('toString');         // returns false
obj.hasOwnProperty('hasOwnProperty');   // returns false
```

# 遍历对象的属性
```js
var buz = {
  fog: 'stack'
};

for (var name in buz) {
  if (buz.hasOwnProperty(name)) {
    console.log('this is fog (' + 
      name + ') for sure. Value: ' + buz[name]);
  }
  else {
    console.log(name); // toString or something else
  }
}
```


# 使用hasOwnProperty的属性名
JavaScript不保护属性名称hasOwnProperty；因此，如果存在一个对象可能具有使用该名称的属性的可能性，则必须使用外部对象 hasOwnProperty来获得正确的结果：
```js
var foo = {
  hasOwnProperty: function() {
    return false;
  },
  bar: 'Here be dragons'
};

foo.hasOwnProperty('bar'); // always returns false

// Use another Object's hasOwnProperty
// and call it with 'this' set to foo
({}).hasOwnProperty.call(foo, 'bar'); // true

// It's also possible to use the hasOwnProperty property
// from the Object prototype for this purpose
Object.prototype.hasOwnProperty.call(foo, 'bar'); // true
```

