# isSymbol 判断

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	 //判断Symbol对象
	 console.log(typeof Symbol);//'function'
	 // console.log(typeof new Symbol());//报错了，他不能new操作
	 console.log( typeof Symbol());//'symbol'

	 console.log(Symbol() instanceof Symbol);//false

	 // 我们来看看undecscore.js是怎么实现的呢
	 /**
		* _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
		    _['is' + name] = function(obj) {
		      return toString.call(obj) === '[object ' + name + ']';
		    };
		 });
	  */
	 
	 console.log(Object.prototype.toString.call(Symbol));//[object Function]
	 console.log(Object.prototype.toString.call(Symbol()));//[object Symbol]
	 console.log(Object.prototype.toString(Symbol));//[object Object]
	 console.log(Object.prototype.toString(Symbol()));//[object Object]

	 // 当我们传入实例化Symbol()是才是[object Symbol]
	 function isSymbol(obj){
	 	var toString = Object.prototype.toString;
	 	return obj && (toString.call(obj) === '[object Symbol]');
	 }

	 console.log(isSymbol(Symbol('Ken')));//true
	 console.log(isSymbol(Symbol()));//true
	 console.log(isSymbol(Symbol));//false
</script>
```