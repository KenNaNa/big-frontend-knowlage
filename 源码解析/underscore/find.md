# find
```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 我们来研究一下那个find()方法 -->
	// 就是找到满足条件的第一个元素
	// 当然我们需要一个函数
	var arr = [1,2,4,5,6]
	function find(array,cb){
		if(!array) return ;
		for(let [i,k] of array.entries()){
			if(cb(k)===true){
				return k;
				break;
			}
		}
	}

	var num = find(arr,function(num){
		return num % 2 === 0;
	})

	console.log(num);//2

	// 我们来分析一下那个underscore.js里面的find()
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      // 判断穿进来的是不是类数组对象
	      // 查找满足条件的index
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      // 闯进来的是对象
	      key = _.findKey(obj, predicate, context);
	    }
	    // 如果key不为undefined或者-1条件满足
	    // 就返回值
	    if (key !== void 0 && key !== -1) return obj[key];
	  };


	    // Generator function to create the findIndex and findLastIndex functions
	  function createIndexFinder(dir) {
	    return function(array, predicate, context) {
	      // 返回一个作用于所有元素的遍历器
	      predicate = cb(predicate, context);
	      // 判断是否传进来数组，保证数组不为空，数组长度存在
	      var length = array != null && array.length;
	      // 从哪里开始查找索引
	      // 大于零则让index = 0从左边开始查找
	      // 小于零则让index = length-1从右边开始查找
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	      	// 找满足条件之后，就返回该索引index
	        if (predicate(array[index], index, array)) return index;
	      }
	      // 找不到就返回 -1
	      // 跟那个indexOf()有点像是
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createIndexFinder(1);

	  _.findLastIndex = createIndexFinder(-1);
</script>
```