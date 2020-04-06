# now

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	<!-- 今天呢我们来探讨这个怎么生成获取描述 -->
	<!-- 在原生的javascript中有一个函数 -->
	console.log(Date.now())

	// 这是另外一种方式
	console.log(new Date().getTime());

	// 现在我们来封装一下
	function now(){
		return Date.now() || new Date().getTime();
	}

	console.log(now());
	// 我们来看看underscore.js是如何实现的呢
	/**
	 * // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	 */
</script>
```