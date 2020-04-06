# 闭包解读
```html
<meta name="2-underscore的闭包解读.html" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<script>

	/**
	 * 闭包的介绍
	 * 闭包是函数和声明该函数的词法环境的组合。
	 * 这样看文字说明好像有点抽象
	 * 其实可以看作一个函数嵌套另一个函数
	 * 内部函数引用外部函数的变量等等关系
	 * 接下来我们看看例子吧
	 * 
	 */
	
	// 第一种情况，一个内部函数引用外部函数的一个变量
	function init(){
		var name = "Ken";//init()函数的内部变量
		function displayName(){//这是一个闭包，他被init()函数包住了，引用name变量
			console.log(name);
		}
		displayName()//执行完打印Ken
	}
	init();
	/**
	 * 总结
	 * 运行代码可以发现 displayName() 内的 console.log() 语句成功的显示了
	 * 在其父函数中声明的 name 变量的值。
	 * 这个词法作用域的例子介绍了引擎是如何解析函数嵌套中的变量的。
	 * 词法作用域中使用的域，
	 * 是变量在代码中声明的位置所决定的。
	 * 嵌套的函数可以访问在其外部声明的变量。
	 */
	
	// 闭包
	function init1(){
		var name = "Ken";//init()函数的内部变量
		function displayName(){//这是一个闭包，他被init()函数包住了，引用name变量
			console.log(name);
		}
		return displayName//执行完打印Ken
	}
	var myFunc = init1();
	myFunc();//ken
	myFunc();


	// 下面是一个更有意思的示例 — makeAdder 函数
	function makeAdder(x){
		return function(y){
			return x + y;
		}
	}


	var add5 = makeAdder(5);
	var add10 = makeAdder(10);

	console.log(add5(2));//7
	console.log(add10(2));//12

	/**
	 * 总结
	 * 因为add5和add10是闭包
	 * 他们会引用函数makeAdder的x变量，因为形成了闭包
	 * 这个变量他不会被释放
	 * 只有当程序结束时才会被释放
	 */
	



	// 实用的闭包
	// 比如循环闭包
	var arr = [];
	for(var i=0;i<10;i++){
		arr[i] = function(){
			console.log(i) 
		}
	}
	arr[6]();//10
	arr[9]();//10
	/**
	 * 本来应该是arr[6]=>6
	 * arr[9]=>9
	 * 但是打印出来全是10
	 * 这是因为i是全局意义上的i变量
	 * 他们都指向同一个i
	 * 所以他们的值才是一样的
	 * 就相当与我一开始定义 var i=0
	 * 后来给他赋值为 i=1,2,3,4,5,6,7,8,9,10
	 * 前面的值都被最后一个覆盖掉了
	 * 那么怎么解决这种情况呢
	 * 其实闭包就可以啦
	 */
	
	// 接下来看看这个例子
	var brr = [];
	for(var i=0;i<10;i++){
		(function(i){
			// 这就相当于内部的函数引用外部函数的i变量
			// 每一次都会创建一个不同的i
			// 这样就可以解决上面的那种情况了
			brr[i] = function(){
				console.log(i)
			}
		})(i)
	}

	brr[6]();//6
	brr[9]();//9



	// 当然学习es6之后，就更简单了
	// es6中引入了块级作用域
	// 只要用let定义变量
	var crr = [];
	for(let j=0;j<10;j++){
		crr[j] = function(){
			console.log(j);
		}
	}

	crr[6]();//6
	crr[9]();//9


	// 用闭包模拟私有方法
	/**
	 * JavaScript 没有这种原生支持，
	 * 但我们可以使用闭包来模拟私有方法。
	 * 私有方法不仅仅有利于限制对代码的访问：
	 * 还提供了管理全局命名空间的强大能力，
	 * 避免非核心的方法弄乱了代码的公共接口部分。
	 */
	var Counter = (function() {
	  var privateCounter = 0;//这个就相当于私有变量，外部是访问不到的
	  function changeBy(val) {
	  	// 私有函数
	  	// 改变私有变量的值
	    privateCounter += val;
	  }
	  return {
	  	// 返回一个接口
	  	// 让外部知道，里面的私有变量的值在改变
	    increment: function() {
	      changeBy(1);
	    },
	    decrement: function() {
	      changeBy(-1);
	    },
	    value: function() {
	      return privateCounter;
	    }
	  }   
	})();

	console.log(Counter.value()); /* logs 0 */
	Counter.increment();
	Counter.increment();
	console.log(Counter.value()); /* logs 2 */
	Counter.decrement();
	console.log(Counter.value()); /* logs 1 */

	// 还有很多地方会用到闭包的

</script>
```