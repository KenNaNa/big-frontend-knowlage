# shallowProperty
```html
<meta charset="utf-8">
<script type="text/javascript">
	<!-- 现在我们来看看underscore.js 如何实现获取对象的浅显属性 -->
	// 首先我们来探讨一下
	var o = {
		name: "Ken",
		age: "18",
		list: ["coder","writer","runner"],
		obj: {
			aaa: "111",
			bbb: "222",
			obj2: {
				ccc: "444"
			}
		}
	}
	console.log(o['name']);//"Ken"
	console.log(o["age"]);//18
	console.log(o["list"]);//
	console.log(o["obj"]);//
	// 以上我们获取的都是浅层次的键值
	// 如果我们要获取深层次的 obj2
	console.log(o["obj"]["obj2"]["ccc"]);//


	// 在underscore.js 中实现了浅层次的获取属性值
	var shallowProperty = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	var o1 = shallowProperty("name");
	console.log(o1(o))//Ken
	// 以函数的形式
	// 相当于使用闭包的方式把  key 
	// 给保留下来
	// shallowProperty函数一执行之后
	// 就会返回另外一个函数，然后我们在传入要 查找的对象
	
	// 当然我们也可以自己实现以下
	var shallowProperty = function(key="default",obj={}){
		return obj == null ? void 0 : obj[key];
	}


	console.log(shallowProperty("name",o));//Ken
</script>
```