# map

```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天来研究一下这个map函数 -->
	var arr = [1,2,3,4,5];
	var o = arr.map((v,k,a)=>{
		console.log(v,'-----',k,'---------',a);
	})
	console.log(o)

	// Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
  	// 生成作用于每个元素的遍历器
    iteratee = cb(iteratee, context);
    // 判断是否是类数组，数组，或者是对象
    // [1,2,4],
    // document.querySelectorAll('p'),
    // {name:'Ken',age:'18'}
    // 当obj是数组，或者是对象时，下面处理，生成keys数组
    var keys = !isArrayLike(obj) && _.keys(obj),
    	// (keys || obj)兼容类数组的处理
        length = (keys || obj).length,
        // 创建数组
        results = Array(length);
    for (var index = 0; index < length; index++) {
    	// 如果keys数组存在则返回 keys[index]
    	// 否则返回 index
      var currentKey = keys ? keys[index] : index;
      // 存储在results数组中
      // 待做返回值
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };
</script>
```