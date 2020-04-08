# Object.create

# 语法
```js
Object.create(proto, [ propertiesObject ])
```

# 继承 Object.create()
```js
// Shape - superclass
function Shape() {
  this.x = 0
  this.y = 0
}

// superclass method
Shape.prototype.move = function(x,y) {
  this.x += x
  this.y += y
}

// Rectangle - subclass
function Rectangle() {
  Shape.call(this); // call super constructor.
}

// subclass extends superclass
Rectangle.prototype = Object.create(Shape.prototype);

//If you don't set Rectangle.prototype.constructor to Rectangle,
//it will take the prototype.constructor of Shape (parent).
//To avoid that, we set the prototype.constructor to Rectangle (child).
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle); // true
console.log('Is rect an instance of Shape?', rect instanceof Shape); // true
rect.move(1, 1); // Outputs, 'Shape moved.'
```
# 如果您希望从多个对象继承，则可以使用mixins
```js
function MyClass() {
  SuperClass.call(this);
  OtherSuperClass.call(this);
}

// inherit one class
MyClass.prototype = Object.create(SuperClass.prototype);
// mixin another
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// re-assign constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
  // do something
};
```

# 使用参数
```js
var o ;
o = Object.create(null)
o = {}
o = Object.create(Object.prototype)


o = Object.create(Object.prototype, {
  // foo is a regular 'value property'
  foo: {
    writable: true,
    configurable: true,
    value: 'hello'
  },
  // bar is a getter-and-setter (accessor) property
  bar: {
    configurable: false,
    get: function() { return 10; },
    set: function(value) {
      console.log('Setting `o.bar` to', value);
    }
/* with ES2015 Accessors our code can look like this
    get() { return 10; },
    set(value) {
      console.log('Setting `o.bar` to', value);
    } */
  }
});


function Constructor() {}
o = new Constructor();
// is equivalent to:
o = Object.create(Constructor.prototype);
// Of course, if there is actual initialization code
// in the Constructor function, 
// the Object.create() cannot reflect it


// Create a new object whose prototype is a new, empty
// object and add a single property 'p', with value 42.
o = Object.create({}, { p: { value: 42 } });

// by default properties ARE NOT writable,
// enumerable or configurable:
o.p = 24;
o.p;
// 42

o.q = 12;
for (var prop in o) {
  console.log(prop);
}
// 'q'

delete o.p;
// false

// to specify an ES3 property
o2 = Object.create({}, {
  p: {
    value: 42,
    writable: true,
    enumerable: true,
    configurable: true
  }
});
/* is not equivalent to:
This will create an object with prototype : {p: 42 }
o2 = Object.create({p: 42}) */ 
```

# 自定义和空对象
```js
oco = Object.create( {} );   // create a normal object
ocn = Object.create( null ); // create a "null" object

> console.log(oco) // {} -- Seems normal
> console.log(ocn) // {} -- Seems normal here too, so far

oco.p = 1; // create a simple property on normal obj
ocn.p = 0; // create a simple property on "null" obj

> console.log(oco) // {p: 1} -- Still seems normal
> console.log(ocn) // {p: 0} -- Still seems normal here too. BUT WAIT...


> alert(oco) // shows [object Object]
> alert(ocn) // throws error: Cannot convert object to primitive value

> oco.toString() // shows [object Object]
> ocn.toString() // throws error: ocn.toString is not a function

> oco.valueOf() // shows {}
> ocn.valueOf() // throws error: ocn.valueOf is not a function

> oco.hasOwnProperty("p") // shows "true"
> ocn.hasOwnProperty("p") // throws error: ocn.hasOwnProperty is not a function

> oco.constructor // shows "Object() { [native code] }"
> ocn.constructor // shows "undefined"
```

# polyfill

```js
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject != 'undefined') {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
        }

        function F() {}
        F.prototype = proto;

        return new F();
    };
}
```