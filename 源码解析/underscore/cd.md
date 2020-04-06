# cd
```html

<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天还研究一下underscore.js内部的callback函数 -->
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


    // 对原型的扩展
    function _each(fun){
        if(!fun)
            return;
        if(this instanceof Array){
            for(var i=0;i<this.length;i++){
                if(fun.call(this[i],i)==false)//函数中的this指向obj[i] i为索引
                    break;
            }
        }else if(typeof this === 'object'){
            var j = null;
            for(j in this){
                if(fun.call(this[j],j))//函数中的this指向obj[j] j为属性名
                    break;
            }
        }
    }
	Array.prototype.each = Object.prototype.each = _each;
	var arr = ['a','b','c'];
	    arr.each(function(index){
	        console.log(index +"=" +this);
	    });

	    var obj = {name:'liu',age:12,salary:8000,address:'广州'};
	    obj.each(function(index){
	        if(typeof this === 'function'){
	              console.log(index+' => function [Function]');
	          }else{
	            console.log(index +"=" +this);
	          }
	    });


	// 接下来我们探讨一下underscore.js的cd会带哦函数
	var builtinIteratee;
	var cb = function(value, context, argCount) {
		// 首先判断内部的遍历器是否存在，不存在就创建一个_.iteratee(value, context)
	    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
	    // 如果不传任何值，就返回默认值_.identity
	    if (value == null) return _.identity;
	    // 如果穿进来的value是一个函数
	    // map((v,k,a)=>{})这种形式的函数
	    // 则使用回调函数优化
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    // 如果是一个对象，或者数组的话
	    // 返回
	    if (_.isObject(value) && )!_.isArray(value) return _.matcher(value);
	    // 最后返回属性值
	    return _.property(value);
	  };

	  // 作用每个元素的遍历器
	  _.iteratee = builtinIteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };


	  // Keep the identity function around for default iteratees.
	  // 保留原始的值
	  _.identity = function(value) {
	    return value;
	  };


	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

		  // Creates a function that, when passed an object, will traverse that object’s
	  // properties down the given `path`, specified as an array of keys or indexes.
	  _.property = function(path) {
	  	// 判断是否为数组
	  	// 是就返回浅层属性值
	    if (!_.isArray(path)) {
	    	// var o = {
	    	// 		name: 'Ken'
	    	// }
	    	// var arr = ['name']
	      return shallowProperty(path);
	    }
	    return function(obj) {
	    	// 这种形式
	    	// var o = {
	    	// 		title:{
	    	// 			name:{
	    	// 				age: '18'
	    	// 			}
	    	// 		}
	    	// }
	    	// var ['title','name','age']
	    	// deepGet(obj,path)
	      return deepGet(obj, path);
	    };
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  // 判断一个对象是否设定了键值对
	  _.isMatch = function(object, attrs) {
	  	// var o = {name:'Ken',age:18}
	  	// var o1 = {name:'Ken'}
	  	// o1 is match o
	  	// 获取键_keys() ===> Object.keys()
	    var keys = _.keys(attrs), length = keys.length;
	    // 如果object不存在，则返回false
	    if (object == null) return !length;
	    // 有可能穿进来的object 不是对象Object的实例
	    var obj = Object(object);

	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      // 进行匹配
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
</script>
```