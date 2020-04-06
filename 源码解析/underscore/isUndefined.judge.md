# isUndefined 判断
```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	//现在来探讨一下那个null
	var a;
	console.log(typeof a);//'undefined'
	console.log(a === undefined);//true
	// 我们来模拟一下
	function isUndefined(obj){
		return obj === void 0;
	}

	console.log(isUndefined(a));//true
</script>
```