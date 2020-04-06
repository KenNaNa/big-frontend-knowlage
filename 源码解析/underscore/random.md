# random

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	// 一般呢我们使用的是原生的javascript的Math.random()
	// 但是他只能产生0-1之间的单个随机数
	console.log(Math.random());
	// 当然比如我们要重申1-5的随机数
	console.log(Math.random()*4+1);

	// 所以我们可以风转一个函数
	// @min  起始值
	// @max  最终值
	function random(min,max){
		if(!max){
			max = min;
			min = 0;
		}
		return Math.floor(Math.random() * (max-min + 1));
	}

	console.log(random(0,5));
</script>
```