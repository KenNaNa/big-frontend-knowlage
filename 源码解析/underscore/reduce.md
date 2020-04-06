# reduce

```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天我们来研究一下reduce() -->
	// 我们来看看原生js中的reduce()数组方法
	var arr = [1,2,4,5,6] ;
	var res = arr.reduce((memo,num)=>{
		console.log(memo,num);
		return memo + num;
	})

	console.log(res);

	// 我们自己来编写一个属于自己的reduce
	function reduce(array,cb){
		if(!cb){
			return ;
		}
		var memo = 0;
		for(i=0;i<array.length;i++){
			memo = memo + array[i];
			cb(memo,array[i]);
		}
		// 返回上一次相加的和 memo
		return memo;
	}


	var sum = reduce(arr,function(memo,num){
		console.log(memo,num);
	})

	console.log(sum);


	// 接下来我们来看看underscore.js里的实现
	// Create a reducing function iterating left or right.
  function createReduce(dir) {
  	// dir表示从那个元素的索引开始
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
    	// index += dir表示从第几个元素的索引开始
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      // 返回上一次相加的和 memo
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      // 当obj是数组，或者是对象时，下面处理，生成keys数组
      var keys = !isArrayLike(obj) && _.keys(obj),
      	  // (keys || obj)兼容类数组的处理
          length = (keys || obj).length,
          // 计算出从数组对象的最左边开始
          // 还是从数组对象的最右边开始
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }
</script>
```