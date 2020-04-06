# inheritsObj

```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<img src="./img/3.jpg" width="1000" height="750">
<script type="text/javascript">
	<!-- 今天我们来讲讲那个原型继承这个东东 -->
	// 工厂模式
	// 用函数来封装特定接口创建对象的细节
	// 暴露对象的接口
	function createPerson(name, age, job){
		var o = new Object();
		o.name = name;
		o.age = o;
		o.job = job;
		o.sayName = function(){
			console.log(this.name);
		}

		return o;
	}

	var p1 = createPerson("Ken",20,"coder");
	console.log(p1);

	// 后来就出现了构造函数模式
	function Person(name, age, job){
		this.name = name;
		this.age = age;
		this.job = job;
		this.sayName = function(){
			console.log(this.name);
		}
	}
	var p2 = new Person('Ken',20,'coder');
	console.log(p2)
	/**
	 * createPerson()
	 *    - 没有显式的创建对象
	 *    - 直接将属性和方法赋给了this对象
	 *    - 没有return语句
	 * Person()
	 *    - 创建一个新对象
	 *    - 将构造函数的作用域赋值给新对象
	 *    - 执行构造函数中的代码
	 *    - 返回新对象
	 */
</script>
```