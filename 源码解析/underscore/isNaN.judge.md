# isNaN 判断

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	//判断一个数字是不是NaN，首先判断他是不是一个数字
	function isNumberic(obj){
		var toString = Object.prototype.toString;
		return toString.call(obj)==='[object Number]';
	}

	console.log(typeof NaN);//'number'

	// 所以很奇怪的是NaN竟然是一个数字来着
	// 他本身的意思就是就是一个不是数字的数字
	// 总之很奇怪就是了
	console.log(NaN===NaN);//false
	console.log(NaN==='a');//false
	console.log(NaN!==NaN);//true;

	// 当然javascript原生的js也实现了对NaN的判断
	// console.log(isNaN(NaN));//true
	// 很神奇啊
	// 不管了
	// 我们来看看如何准确的实现判断某个数是不是NaN
	function _isNaN(obj){
		return isNumberic(obj) && isNaN(obj);
	}

	console.log(_isNaN(NaN));//true
</script>
```