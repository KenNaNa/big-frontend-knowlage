# each
```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天我们来研究一下undescore.js的_.each() -->
	// 首先我们先来自己实现以下一个each函数
	function each(obj,fun){
        if(!fun)
            return;
        if(obj instanceof Array){
        	// 遍历数组的
            for(var i=0;i<obj.length;i++){
                if(fun.call(obj[i],i)==false)//函数中的this指向obj[i] i为索引
                    break;
            }
        }else if(typeof obj === 'object'){
            var j = null;
            for(j in obj){
                if(fun.call(obj[j],j))//函数中的this指向obj[j] j为属性名
                    break;
            }
        }
    }
    // 调用
    var arr = ['a','b','c'];
    each(arr,function(index){
        console.log(index +"=" +this);
    });

    var obj = {name:'liu',age:12,salary:8000,address:'广州'};
    each(obj,function(index){
        console.log(index +"=" +this);
    });

    // 来研究underscore.js的_.each()
    _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
        // 类数组对象的遍历
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      // 对象的遍历
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    // 最后不管怎么样都返回原始对象
    return obj;
  };
</script>
```