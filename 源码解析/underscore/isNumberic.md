# 数字判断
```html

<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	// 首先呢判断是不是一个数字类型
	console.log(typeof 8);//'number'
	console.log(typeof new Number(8));//'object'
	// 所以说这种typeof 方式也是不够准确的
	console.log(typeof Number(8));//'number'
	console.log(typeof Number());//'number'
	console.log(typeof Number().constructor);//'function'却不是'number'
	console.log(typeof (new Number).constructor===Number);//false

	// 所以啊，上面的种种测试，说明这种方式是不够准确的
	// 呢么有没有更准确的方式呢，当然是有的啊
	// 原生js提供了一种方式，就是toString()方式
	console.log(Object.prototype.toString.call(8));//'[object Number]'
	console.log(Object.prototype.toString.call(Number(8)));//'[object Number]'
	console.log(Object.prototype.toString.call(new Number(8)));//'[object Number]'
	console.log(Object.prototype.toString.call(new Number()));//'[object Number]'
	// 那么我们就可以用这种方式来判断是不是数字
	// 我们现在来看看underscore.js是怎么实现的呢
	/**
	 * // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	 */
	
	// 其实呢underscore也是这样去实现的
	// 我们来模拟一下吧
	function isNumberic(obj){
		var toString = Object.prototype.toString;
		return obj && (typeof obj==='number' || typeof obj==='object') && (toString.call(obj)==='[object Number]');
	}

	console.log(isNumberic(8));//true
	console.log(isNumberic(Number(8)));//true
	console.log(isNumberic(new Number(8)));//true
	console.log(isNumberic(new Number()));//true
	console.log(isNumberic(document));//false
	console.log(isNumberic(NaN));//NaN

</script>
```