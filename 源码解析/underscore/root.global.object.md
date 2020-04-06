# root 全局对象解读

```html
<meta name="1-underscore的root对象解读.html" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	// 这样的话，我们的好好的研究一下windows对象
	// 首先window是一个对象
	// 对象下面还有很多属性
	// 这个是浏览器端的window全局对象
	// 还有一个全局对象就是服务器端的全局对象global
	// 当然我们现在是在浏览器端
	// 此时的global全局对象是不存在的
	// 浏览器端的this , self , 都是window对象
	console.log(this) //window对象
	console.log(self) //window对象
	console.log(window)//window对象
	console.log(window.window)//window对象
	console.log(window.self)//window对象 //引用本窗户window=window.self
	console.log(global)//服务端的window
	console.log(global.global);
	console.log(global.self);
	// 所以
	var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this || {};
    //首先我们先判断这个self 是不是一个对象
    //再判断self.self === self 
    //最后返回self
    //服务器端的global是不是一个对象
    //在判断global.global === global
    //最后返回 global 或者 this对象，如果global，this，self都不存在，就返回{}空对象
</script>
```