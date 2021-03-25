如果你的 JavaScript 经验丰富的话，应该会了解对象是创建无序键 / 值对数据结构 [ 也称为
映射（map）] 的主要机制。但是，对象作为映射的主要缺点是不能使用非字符串值作为键。

举个例子来说，考虑：

```js
  var m = {}
  var x = {id: 1}
  var y = {id: 2}

  m[x] = "foo"
  m[y] = "bar"


  m[x]; // foo
  m[y]; // bar
```

这里发生了什么？ x 和 y 两个对象字符串化都是 "[object Object]"，所以 m 中只设置了一
个键。

在 es6 中 有了 Map

```js
var m = new Map();
var x = { id: 1 }, y = { id: 2 };
m.set( x, "foo" );
m.set( y, "bar" );
m.get( x ); // "foo"
m.get( y ); // "bar"
```

要从 map 中删除一个元素，不要使用 delete 运算符，而是要使用 delete() 方法：

```js
m.set( x, "foo" );
m.set( y, "bar" );
m.delete( y );
```

你可以通过 clear() 清除整个 map 的内容。要得到 map 的长度（也就是键的个数），可以
使用 size 属性（而不是 length）：

```js
m.set( x, "foo" );
m.set( y, "bar" );
m.size; // 2
m.clear();
m.size; // 0

```


