# 获取 token

```js
$.ajax({
		url: "http://localhost:8080",
		data: { data: "data" },
		type: "POST",
		dataType: "json",
		async: false,
		cache: false,
		success: function(data,headers) {
			console.log(data);
			console.log(headers);//一般是在这里拿，要看后端是煮面封装的
		},
		error: function(data) {
			console.log(data);
		}
	});
```

# 将token存入浏览器cookie

```js
	function setTokenToCookie(value) {
		var Days = 1; //此 cookie 将被保存 30 天
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = "my_token =" + escape(value) + ";expires=" + exp.toGMTString();
	}
```

# 将token从浏览器cookie中取出

```js
function getCookie(name) {
		var cookieValue = "啥也没有！！";
		if (document.cookie && document.cookie !== '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = $.trim(cookies[i]);
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
```

# 发送ajax请求时添加token到请求头

```js
	$.ajax({
		url: "http://localhost:8080",
		data:{data:"data"},
		type: "POST",
		dataType: "json",
		headers: {
			Token: my_token //这里是Token
		},
		async: false,
		cache: false,
		success: function(data) {
			console.log(data);
		},
		error: function(data) {
			console.log(data);
		}
	});
```
