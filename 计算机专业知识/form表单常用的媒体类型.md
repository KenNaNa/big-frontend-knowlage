在HTTP请求中，把请求分为请求行，请求头请求体，其中在请求头中，Content-Type主要是让服务器知道请求体是用何种方式编码，该如何去解析请求数据。

# form表单提交媒体类型
### 1.application/x-www-form-urlencoded
这应该是最常见的 POST 提交数据的方式了。浏览器的原生 表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。

```html
<form action="<%=basePath%>upload/submitFormData" method="post">
      姓名：<input type = "text" name="userName"><br/>
      密码：<input type = "text" name="password"><br/>
      <input type="submit" value="提交">
</form>
```
### 2. multipart/form-data
这又是一个常见的 POST 数据提交的方式。我们使用表单上传文件时，必须让 表单的 enctype 等于 multipart/form-data。

前端代码：

```js
<form action="<%=basePath%>/upload/testFileUpload" enctype="multipart/form-data" method="post">
      <input type="file" name="file">
      姓名：<input type = "text" name="userName">
      <input type="submit" value="上传">
</form>
```

### 3. application/json
application/json 这个 Content-Type 作为响应头大家肯定不陌生。实际上，现在越来越多的人把它作为请求头，用来告诉服务端消息主体是序列化后的 JSON 字符串。

由于 JSON 规范的流行，除了低版本 IE 之外的各大浏览器都原生支持 JSON.stringify，服务端语言也都有处理 JSON 的函数，使用 JSON 不会遇上什么麻烦。

这种方案，可以方便的提交复杂的结构化数据，特别适合 RESTful 的接口。各大抓包工具如 Chrome 自带的开发者工具、Firebug、Fiddler，都会以树形结构展示 JSON 数据，非常友好。

### 4. text/xml
它是一种使用 HTTP 作为传输协议，XML 作为编码方式的远程调用规范。典型的 XML-RPC 请求是这样的：

```html
POST http://www.example.com HTTP/1.1
Content-Type: text/xml

<?xml version="1.0"?>
<methodCall>
    <methodName>examples.getStateName</methodName>
    <params>
        <param>
            <value><i4>41</i4></value>
        </param>
    </params>
</methodCall>
```
