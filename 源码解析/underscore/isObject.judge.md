# 对象判断

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	//我们来判断一下对象的数据类型
	console.log(typeof Object);//'function'
	console.log(typeof new Object);//'object'
	console.log(typeof {});//'object'
	console.log({} instanceof Object);//'true'
	console.log(typeof new Object({}));//'object'
	console.log({}.constructor===Object);//true
	// 所以还是不是很准确啊
	// 我们还是可以用toString()方式来判断一个东西是不是对象
	console.log(typeof document);//'object'
	console.log(typeof window);//'object'
	console.log(typeof document.body);//'object'
	// 等等上面这些都会对对象类型判断产生干扰的
	// 所以这种方式也是不太适合的
	
	// 我们来看看toString()
	console.log(Object.prototype.toString.call({}));//'[object Object]'
	console.log(Object.prototype.toString.call(new Object({})));//'[object Object]'
	console.log(Object.prototype.toString.call(new Object()));//'[object Object]'
	console.log(Object.prototype.toString.call(Object));//'[object Function]'
	console.log(Object.prototype.toString.call(new Object(999)));//'[object Number]'

	// 接下来我们来模拟一下
	function isObject(obj){
		var toString = Object.prototype.toString;
		return obj && (typeof obj==='object' || typeof obj==='function') && !!obj;
	}
	console.log('此时')

	console.log(isObject(Object));//true
	console.log(isObject(new Object()));//true
	console.log(isObject(new Object({})));//true
	console.log(isObject(new Object(88)));//true
	console.log(isObject({}));//true
	console.log(isObject([]));//true
	console.log(isObject(document));//true
	console.log(isObject(window));//true
	console.log(isObject(new Date));//true

	console.log(isObject());//undefined
</script>
```