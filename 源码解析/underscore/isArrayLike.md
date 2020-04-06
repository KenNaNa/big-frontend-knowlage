# isArrayLike

```html
<meta charset="utf-8">
<P></P>
<P></P>
<P></P>
<P></P>
<P></P>
<script type="text/javascript">
	<!-- 今天我们来探讨一下如何实现判断一个对象是一个类数组对象 -->
	// 我们还需要用到上次的
	var shallowProperty = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
  	};

  	//首先我们得来弄清楚啥是类数组对
  	var arr = Array();//这是真正的数组具有length属性
  	console.log(arr.length)//0
  	// 真正的数组对象是可以使用Array.prototype对象上的所有方法的
  	// 但是类数组也具有length属性
  	// 但是呢，他们不能使用Array.prototype上的所有方法
  	// 这就是区别所在啊
  	
  	var o = {
  		length:2,
  		name:'ken',
  		age:18
  	}
  	// 那么那些是类数组对象呢
  	// 比如函数参数里面的 arguments
  	// 比如DOM对象，我们通过getElementsBy* 等方式获取的集合都是类数组
  	// 都可以使用下标操作的，
  	
  	// 但是我们要如何判断一个对象是一个类数组对象
  	// 光判断具有length属性是行不通的，
  	// 上面我们说过，他们不具备Array.prototype 上的所有方法
  	// length 属性的值必须是有限的
  	// 下面我们来看看我们underscore.js是如何实现的呢
  	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  	
  	var getLength = shallowProperty('length');
  	var isArrayLike = function(collection) {
  		// 获取length属性
	    var length = getLength(collection);
	    // 判断length的类型是否number类型
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};
	console.log(isArrayLike(o))


	
	// 但是我们感觉也不够精确啊
	// 我觉得应该判断方法
	// 我们自己来实现以下
	var isArrayLike = function(collection){
		var length = getLength(collection);
		return (!(Array.prototype.alice in collection) && !(Array.prototype.split in collection)) && typeof length === 'number' && length>=0 && length<=MAX_ARRAY_INDEX;
	}
	var oPs = document.querySelectorAll("p")
	console.log(isArrayLike(o));//true
	console.log(isArrayLike(oPs));//true


	function call(a,b){
		console.log(isArrayLike(arguments));//true;
	}

	call(1,2);
</script>
```