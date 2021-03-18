# JavaScript规定了几种语言类型

# undefined

- 函数默认返回值

```js
function ret() {
	// 默认是返回 undefined
}
```

- 获取对象不存在的 key

```js
var obj = {}
obj.name
```
- 获取数组不存在的下标

```js
var aa = []

aa[0] undefined
```

- 声明变量，不初始化值
```js
var foo;
```

# null

null 表示的是：“定义了但是为空”。所以，在实际编程时，我们一般不会把变量赋值为 undefined，这样可以保证所有值为 undefined 的变量，都是从未赋值的自然状态。

Null 类型也只有一个值，就是 null，它的语义表示空值，与 undefined 不同，null 是 JavaScript 关键字，所以在任何代码中，你都可以放心用 null 关键字来获取 null 值。

# Boolean

true/false

# number

有一个经典的问题，是 0.1 + 0.2 != 0.3。如何解决精度问题

我们可以这样实现，

- 获取小数点后面的位数
- 然后取最大的位数
- 进行重新计算

```js
function formatFloat (num1, num2) {
        var baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    };
console.log(formatFloat(0.1,0.2))
```

# string

# Symbol
Symbol 是 ES6 中引入的新类型，它是一切非字符串的对象 key 的集合，在 ES6 规范中，整个对象系统被用 Symbol 重塑。

Symbol 可以具有字符串类型的描述，但是即使描述相同，Symbol 也不相等。

创建 Symbol 的方式是使用全局的 Symbol 函数。例如：
```js
 var mySymbol = Symbol("my symbol");
```
