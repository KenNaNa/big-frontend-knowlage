# deepGet

```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天我们来探讨一下获取深层次的属性 -->
	var o = {
		title:{
			a:{
				name:{
					aaa:{
						a:"Ken"
					}
				}
			}
		}
	}

   // 那我们如果要如何去遍历这个对象呢
   // 当然我们可以使用递归的方式，、
   // 但是我们有一种简单的方式，underscore.js也是使用这种方式是想的
   // 首先我们把要遍历的键放在一个数据里面
   var arr = ["title","a","name","aaa","a"]
   for(var i=0;i<arr.length;i++){
   		o = o[arr[i]];
   		console.log(o);
   		// 总共遍历四次
   }

   // 当然我们也可以使用递归的方式
   function callback(obj){
   		var res = null;
   		
   		for(let key in obj){
   			if(typeof obj[key] ==="object"){
   				callback(obj[key]);
   			}else{
   				console.log(obj);
   				break;
   			}
   		}
   		

   }
   (callback(o));//"ken"


   // 在underscore.js 里面是这样实现的
   var deepGet = function(obj, path) {
   	// path是一个数组包含所有键名的数组
   	// 获取他的数组的长度
    var length = path.length;
    for (var i = 0; i < length; i++) {
    	// 如果obj为null
    	// 则返回undefined
      if (obj == null) return void 0;
      // 否则就继续查找
      obj = obj[path[i]];

    }
    // 最后返回obj或者undefined
    return length ? obj : void 0;
  };


  console.log(deepGet(o,arr))
</script>
```