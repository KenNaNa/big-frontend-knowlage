# optimizeCb

```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天我们来研究一下underscore.js的回调函数的优化 -->
	var optimizeCb = function(func, context, argCount) {
		// 参数func 回调函数
		// 上下文context
		// 参数个数argCount
		// 当context不传时返回原函数
		// 例如这样 function foo(){}
		// 我们调用上面这个函数时，foo(),也可以这样调用foo.call()
	    if (context === void 0) return func;

	    switch (argCount == null ? 3 : argCount) {
	      // 当我们传入上下文context时，
	      // 比如我们调用的方式
	      // function foo(a){ console.log(a),console.log(this.name) }
	      // var o = {
	      // 	name:"Ken"
	      // }
	      // 我们这样调用 foo.call(o,o);
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      // The 2-argument case is omitted because we’re not using it.
	      // 两个参数的回调函数没有被适用到，所以忽略
	      case 3: return function(value, index, collection) {
	      	// 就如我们的数组的map函数
	      	// [1,2,4].map((v,i,c)=>{
	      	//  	v -> 值
	      	//  	i -> 索引
	      	//  	c -> 数组
	      	// })
	        return func.call(context, value, index, collection);
	      };
	      // 比如我们的数组的reduce()和reduceRight()方法
	      // [1,2,4,5,6].reduce((ac,v,k,a)=>{console.log(ac,v,k,a)})
	      // 一开始ac是为1的，就相当于我们要求[1,2,4,5]的元素的和
	      // 我们要先把sum赋值为1
	      // var sum = 0
	      // var arr = [1,2,4,5,6]
	      // for(var i=0;i<arr.length;i++){
	      // 	sum += arr[i]
	      // }
	      // 而那个ac就是相当于那个迭代的sum值
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }

	    // 最后我们直接调用
	    // func.apply(context,arguments);
	    return function() {
	      return func.apply(context, arguments);
	    };
  };
</script>
```