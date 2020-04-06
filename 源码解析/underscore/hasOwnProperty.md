# hasOwnProperty

```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 今天我们来探讨一下Object.hasOwnProperty -->
	/**
	 * 所有继承了 Object 的对象都会继承到 hasOwnProperty 方法。
	 * 这个方法可以用来检测一个对象是否含有特定的自身属性；
	 * 和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。
	 */
	
	// 下面的例子检测了对象 o 是否含有自身属性 prop
	var o = new Object();
	o.prop = "name";
	function changeO() {
	  o.newprop = o.prop;
	  delete o.prop;
	}

	var b = o.hasOwnProperty('prop');   
	console.log(b)// 返回 true
	changeO();
	var b = o.hasOwnProperty('prop');   
	console.log(b)// 返回 false


	// 下面的例子演示了 hasOwnProperty 方法对待自身属性和继承属性的区别
	o = new Object();
	o.prop = 'exists';
	o.hasOwnProperty('prop');             // 返回 true
	o.hasOwnProperty('toString');         // 返回 false
	o.hasOwnProperty('hasOwnProperty');   // 返回 false

	/**
	 * 下面的例子演示了如何在遍历一个对象的所有属性时忽略掉继承属性，
	 * 注意这里 for...in  循环只会遍历可枚举属性，
	 * 所以不应该基于这个循环中没有不可枚举的属性而得出 hasOwnProperty 
	 * 是严格限制于可枚举项目的（如同 Object.getOwnPropertyNames()）
	 */
	var buz = {
	    fog: 'stack'
	};

	for (var name in buz) {
	    if (buz.hasOwnProperty(name)) {
	        console.log("this is fog (" + name + ") for sure. Value: " + buz[name]);
	    }
	    else {
	        console.log(name); // toString or something else
	    }
	}
	/**
	 * JavaScript 并没有保护 hasOwnProperty 属性名，
	 * 因此某个对象是有可能存在使用这个属性名的属性，
	 * 使用外部的 hasOwnProperty 获得正确的结果是需要的
	 */
	
	var foo = {
	    hasOwnProperty: function() {
	        return false;
	    },
	    bar: 'Here be dragons'
	};

	foo.hasOwnProperty('bar'); // 始终返回 false


	// 就是基于以下两种情况
	// underscore.js实现了自己的一套判断方式

	// 如果担心这种情况，可以直接使用原型链上真正的 hasOwnProperty 方法
	({}).hasOwnProperty.call(foo, 'bar'); // true

	// 也可以使用 Object 原型上的 hasOwnProperty 属性
	Object.prototype.hasOwnProperty.call(foo, 'bar'); // true


	// 接下来我们就来看看
	var ObjProto = Object.prototype;
	var hasOwnProperty = ObjProto.hasOwnProperty;
	var has = function(obj, path) {
	    return obj != null && hasOwnProperty.call(obj, path);
	  }

	console.log(has(foo,"bar"));//true


	// 当然我们也可以自己实现以下
	var has = function(obj,prop){
		return obj && Object.prototype.hasOwnProperty.call(obj, prop);
	}

	console.log(has(foo,"bar"));//true
	console.log(has(o,"bar"));//false
</script>
```