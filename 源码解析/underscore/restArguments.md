# restArguments
```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天我们来讲讲es6之前没有出现过 rest 参数之前的模拟写法 -->
	// 就是类似这种function(a,b,...c){}
	// 这种 rest 参数的实现
	// 首先我们还是要来看看 es6 的做法
	function call(a,b,...list){
		console.log("a："+a)
		console.log("b : "+b)
		console.log("list : "+list)
		console.log("length : "+arguments.length);//3
	}

	call(1,2,[1,2,4,5,6,7]);//a=1,b=2,list=[1,2,4,5,6,7] length:3
	call(1,2,4,5,6,7);//a=1,b=2,list=[4,5,6,7] length:6
	call(1,2);//a=1,b=2  length:2

	// 接下来我们来看看 function 是否有 length 属性
	console.log(call.length);//2

	function bbb(){
		console.log(arguments.length);//0
	}
	console.log(bbb.length);//0

	function ccc(a,b,c){
		console.log("length: "+arguments.length);//length : 3
	}
	console.log(ccc.length);//3

	// 到现在我们可以总结出
	// 函数名的 length 属性是指，非 rest 参数的个数
	// 而 arguments 的 length 属性 是指所有参数的个数，包括 rest 参数
	// 接下来我们就来解析一下 underscore.js 里面是如何实现的呢
	var restArguments = function(func, startIndex) {
		// 首先我们判断startIndex是否为null，就是只传入函数 func 第一个参数的时候
		// +startIndex 是将 startIndex 转换为数字 +'0' --> 0 ;
		// +'a' --> NaN,  +'1' --> 1
	    startIndex = startIndex == null ? func.length - 1 : +startIndex;
	    return function() {
	    	// 返回一个函数
	    	// arguments.length 是指所有参数的个数
	    	// arguments.length - startIndex 就是 rest 剩余参数的个数
	    	// rest = Array(length) 创建一个 rest 剩余参数数组
	      var length = Math.max(arguments.length - startIndex, 0),
	          rest = Array(length),
	          index = 0;
	      for (; index < length; index++) {
	      	// 将剩余参数的值，付给 rest 数组
	        rest[index] = arguments[index + startIndex];
	      }
	      switch (startIndex) {
	      	// 判断当非 rest 参数个数为 0,1,2 的时候分别处理
	      	// 处理函数的参数 function(...list){}
	      	// function(a,...list){}
	      	// function(a,b,...list){}
	      	// 处理以上三种情况的函数的参数
	        case 0: return func.call(this, rest);
	        case 1: return func.call(this, arguments[0], rest);
	        case 2: return func.call(this, arguments[0], arguments[1], rest);
	      }

	      // 处理 rest 参数前面的参数
	      // 比如function call(a,b,...list){}
	      // 处理的是 a,b 这两个参数
	      // startIndex其实是指 rest 参数的位置
	      var args = Array(startIndex + 1);
	      for (index = 0; index < startIndex; index++) {
	        args[index] = arguments[index];
	      }

	      // 然后再将非 rest 参数 与 rest 参数整合在一起
	      args[startIndex] = rest;
	      return func.apply(this, args);

	      // 就类似我下面举例 的例子一样
	      // function call(a,b,...c){console.log(a),console.log(b);console.log(c)}
	      // call.apply(this,[1,2,[1,2,4]])
	      // 打印出来的值分别为
	      // a=1
	      // b=2
	      // c=[1,2,4]
	    };
  }; 

  function call(a,b,...c){
  	console.log(a);//1
  	console.log(b);//2
  	console.log(c)//[1,2,4]
  }

  call.apply(this,[1,2,[1,2,4]])


  var f = restArguments(function call(a,b,...c){
  	console.log(a);//1
  	console.log(b);//2
  	console.log(c)//[1,2,4]
  },2);
  console.log('-------------------')
  console.log(f.length)
</script>
```