# 数组判断
```html
<meta name="name" content="content" charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/base.css">
<input type="button" name="button" value="按钮" id="btn" />
<script>
	// 判断一个元素是不是元素节点
	let oBtn = document.getElementById('btn');
	let oBody = document.body;
	console.log(typeof oBtn);//'object'
	console.log(oBtn.nodeType);//1
	console.log(oBody.nodeType)//1
	console.log(oBtn.value);//
	console.log(oBody.childNodes[1].nodeType);//文本节点为 3
	// 如果是节点类型  为1的话就是元素节点
	// 可以根据这一点来判断一个节点是不是元素元素节点
	// 当然首先得是一个对象
	// 接下来我们来看看underscore.js是怎么来判断节点类型的
	


	// Is a given value a DOM element?
	/*_.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	};*/

	// 我们来模拟一下他的做法吧
	function isElement(obj){
		return !!(obj && typeof obj === 'object' && obj.nodeType && obj.nodeType === 1);
		// 这个的双感叹号是 !!是用来转换为bool值的
		// 首先判断判断穿进来的参数是否存在
		// 在判断是不是一个对象
		// 然后再判断obj的属性nodetype
	}
	// 我们来尝试一下
	console.log(isElement(oBtn));//true
	console.log(isElement(oBody));//true
	console.log(isElement(oBody.childNodes[1]));//false
</script>

```