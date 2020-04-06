# isNull 判断

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	//现在来探讨一下那个null
	var a = null;
	console.log(typeof a);//'object'
	console.log(a === null);//true
	// 我们来模拟一下
	function isNull(obj){
		return obj === null;
	}

	console.log(isNull(a));//true
</script>
```