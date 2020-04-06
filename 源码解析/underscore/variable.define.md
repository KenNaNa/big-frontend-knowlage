# 变量定义

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>
	// 其实变量申明也有很多讲究的
	// 例如 我们申明多个变量时，
	var name = "ken";
	var city = '广东中山';
	var age = 18;
	var obj = {
		name: name,
		city: city,
		age: age
	};

	// 当然你嫌弃每次都打var这个关键字
	var name = "ken",
		city = "广东中山",
		age = 18,
		obj = {
			name: name,
			city: city,
			age: age
		};



	// 当然变量的取法，也有很多关系到性能优化
	// 还有当我们打包压缩时，也有讲究
	// 就比如我们获取页面元素时
	document.body.onclick = function(e){
		console.log(1);
	}

	// 如果我们每次去获取body元素时
	// 都要打document.body
	// 多么麻烦啊
	// 所以我们可以用变量存起来
	// 这样我们就不用写多代码了
	// 这样也可以减少重复获取
	var oBody = document.body;


	// 当然在underscore.js中，也有类似的例子
	// 我来看看吧
	// Save bytes in the minified (but not gzipped) version:
	// 下面这个例子，是因为打包压缩的时候
	// Array.prototype，Oject.prototype，Symbol.prototype会被替换成简单的字符
	// 系统会不认识这些字符了
	// 所以要用变量存起来
  	var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  	var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  	// 创建快捷调用方式
  	// 把数组 push方法，slice方法
  	// 把Object的toString()方法
  	// 把Object的hasOwnProperty
  	// 用变量存起来
  	var push = ArrayProto.push,
      	slice = ArrayProto.slice,
      	toString = ObjProto.toString,
      	hasOwnProperty = ObjProto.hasOwnProperty;
    // 存储数组的静态方法 isArray,
    // 存储Object的静态方法 keys(),create()方法
    var nativeIsArray = Array.isArray,
      	nativeKeys = Object.keys,
      	nativeCreate = Object.create;
</script>
```