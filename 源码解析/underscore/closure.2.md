# 闭包解读
```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	// 其实把
	// 在underscore.js这个框架中
	// 也使用到了闭包
	// 闭包可以是的把作用域独立出来
	// 不暴露给全局
	// 这样就可以不污染全局了
	(function(){
		console.log("我是闭包");
	})();//立即执行函数，执行完之后就会打印出‘我是闭包’


	// 在jquery这个框架中也是使用这样的闭包
	(function(window,document){
		console.log(window);//打印出window对象
		console.log(document);//打印出document对象
	})(window,document,undefined)
</script>
```