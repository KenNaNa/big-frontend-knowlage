# isFinite 判断
```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	//如何来判断一个有有限的数字呢
	// 当然啦，原生的javascript已经给我们出了一个定义在全局的函数
	// 就是isFinite()函数
	// 所以这个函数使用来把类似数字的东西转换为数字的
	// 我们来试试
	console.log(isFinite(1244));//true
	console.log(isFinite(NaN));//false
	console.log(isFinite(new Number(6)));//true
	console.log(isFinite(new Number()));//treu
	console.log(isFinite(Number(888)));//true
	console.log(isFinite('124454'));//true
	// console.log(isFinite(Symbol(1244)))报错了，报了isFinite不能将Symbol转换成数字
	// 
	// 接下来我们来看看underscore.js是怎么来实现的呢
	/**
	 * // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	 */
	// 看来我们要用到上一节的内容了，
	// 把它拷贝过来
	function isSymbol(obj){
	 	var toString = Object.prototype.toString;
	 	return (toString.call(obj) === '[object Symbol]');
	}

	//我们自己来实现一下
	function _isFinite(obj){
		return !isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
	}

	console.log(_isFinite(1445455))//true
	console.log(_isFinite(NaN))//false
	console.log(_isFinite(new Number(6)))//true
	console.log(_isFinite(new Number()))//true
	console.log(_isFinite(new Number(888)))//ture
	console.log(_isFinite('124556566'))//true

</script>
```
