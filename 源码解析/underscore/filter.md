# filter

```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 我们来研究一下filter函数 -->
	// 我们来看看原生的js中的filter
	var arr = [1,2,4,5,6,7,8];
	var res = arr.filter(function(num){
		return num % 2 === 0;
	})

	console.log(res);


	// 我们自己来实现一个
	function filter(array,cb){
		if(!array) return ;
		var res = [];
		for( let i=0;i<array.length;i++ ){
			if(cb(array[i])){
				res.push(array[i]);
			}
		}

		return res;
	}

	var res = filter(arr,function(num){
		return num % 2 === 0;
	})

	console.log(res);

	// 我们来分一下filter()
	  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    // 其实predicate就是我们自己实现的回调函数cb，只不过他内部给封装了复杂处理
    predicate = cb(predicate, context);
    // 让每个元素都经过相同的处理
    // 满足条件就往空数组results添加
    // 最终返回除去
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };
</script>
```