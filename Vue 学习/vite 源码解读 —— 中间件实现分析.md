本文所有分析针对版本 v2.0.1，你可以下载 vite v2.0.1 的源码

# 一、前端中的中间件
中间件，用通俗一点的语言解释，无非是，在某个模块之前或之后去执行的一组组件。如果你使用过 koa 的话，你可能会了解到，koa 就是一个典型的中间件框架。

```js
	Expressive middleware for node.js using ES2017 async functions
```

如果你稍微看过一点 koa 的源码，你可能会了解到 koa 中间件能力的实现主要是通过 connect 这个组件去实现的。

一个简单的中间件 demo 如下：

```js
	var connect = require('connect');
	var http = require('http');
	 
	var app = connect();
	 
	// gzip/deflate outgoing responses
	var compression = require('compression');
	app.use(compression());
	 
	// store session state in browser cookie
	var cookieSession = require('cookie-session');
	app.use(cookieSession({
	    keys: ['secret1', 'secret2']
	}));
	 
	// respond to all requests
	app.use(function(req, res){
	  res.end('Hello from Connect!\n');
	});
	 
	//create node.js http server and listen on port
	http.createServer(app).listen(3000);
```
上面代码是对一个 http 请求的处理，包括对浏览器发出来的请求先压缩、然后再设置 cookie，最后返回一串 “Hello from Connect！” 消息。也就是如下效果

```js
					|
				| 压缩 |
					|     http 请求	
			| 设置 cookie |
					|
	 	| 返回 “Hello from Connect!” |
					|
```

所以中间件的引入主要是为了对请求上下文进行链式处理，那么链式处理是如何实现的呢？这里我们可以去看看 connect 组件的源码。

# 二、connect 如何实现链式调用
connect 组件官网介绍为：

···
Connect is a simple framework to glue together various “middleware” to handle requests.
···

其源码实现比较简单，通过分析主要有 handle、call、next 三个函数，关系如下：

```js
	    handle() {
	        next()
	    }
	 
	    next() {
	 
	        var layer = stack[index++];
	 
	        // layer.handle 是下一个 handle, 即 next handle
	        call(layer.handle, next)
	    }
	 
	    call() {
	        handle();
	    }
	 
```

stack 是一个数组结构，layer.handle 是下一个 handle， 我们来看看相关代码：

```js
	  app.stack = [];
	  this.stack.push({ route: path, handle: handle });
	  var layer = stack[index++];
```

这里我们就可以分析出来了，connect 实现 middleware 的本质是通过一个数组结构，实现了一个拦截器，达到了下面的效果（handle1 、handle2、handle3 串联依次执行）

```js
    handle1
      |
    handle2
      |
    handle3
      |
    finalhandler
```

finalhandler 是通过引用组件 https://github.com/pillarjs/finalhandler 实现的，本质是一个 http responder

其实 vite 也是使用了中间件的能力，也是通过 connect 组件实现的。

# 三、vite 源码解析 —— 中间件部分

```js
	import connect from 'connect'
	 
	const middlewares = connect() as Connect.Server
	 
	// request timer
	if (process.env.DEBUG) {
	  middlewares.use(timeMiddleware(root))
	}
	 
	// cors (enabled by default)
	const { cors } = serverConfig
	if (cors !== false) {
	  middlewares.use(corsMiddleware(typeof cors === 'boolean' ? {} : cors))
	}
	 
	// proxy
	const { proxy } = serverConfig
	if (proxy) {
	  middlewares.use(proxyMiddleware(server))
	}
	 
	// base
	if (config.base !== '/') {
	  middlewares.use(baseMiddleware(server))
	}
	 
	// open in editor support
	middlewares.use('/__open-in-editor', launchEditorMiddleware())
	 
	// hmr reconnect ping
	middlewares.use('/__vite_ping', (_, res) => res.end('pong'))
	 
	// serve static files under /public
	// this applies before the transform middleware so that these files are served
	// as-is without transforms.
	middlewares.use(servePublicMiddleware(config.publicDir))
	 
	// main transform middleware
	middlewares.use(transformMiddleware(server))
	 
	// serve static files
	middlewares.use(serveRawFsMiddleware())
	middlewares.use(serveStaticMiddleware(root, config))
	 
	// spa fallback
	if (!middlewareMode) {
	  middlewares.use(
	    history({
	      logger: createDebugger('vite:spa-fallback'),
	      // support /dir/ without explicit index.html
	      rewrites: [
	        {
	          from: /\/$/,
	          to({ parsedUrl }: any) {
	            const rewritten = parsedUrl.pathname + 'index.html'
	            if (fs.existsSync(path.join(root, rewritten))) {
	              return rewritten
	            } else {
	              return `/index.html`
	            }
	          }
	        }
	      ]
	    })
	  )
	}
	 
	if (!middlewareMode) {
	    // transform index.html
	    middlewares.use(indexHtmlMiddleware(server))
	    // handle 404s
	    middlewares.use((_, res) => {
	      res.statusCode = 404
	      res.end()
	    })
	}
	 
	// error handler
	middlewares.use(errorMiddleware(server, middlewareMode))
```

上面的代码提取了 src/node/index.ts 目录下所有使用到 middleware 的逻辑，我们统计下，一共有下面这些 middleware：

timeMiddleware：位于 node/server/middlewares/time.ts 下，主要打印请求的时间信息

corsMiddleware：通过引入 cors 包实现，主要实现跨域请求的支持

proxyMiddleware：位于 node/server/middlewares/proxy.ts 下，通过引入 http-proxy 实现了 http 代理的能力。

baseMiddleware：位于 node/server/middlewares/base.ts 下，当设置了 config.base 的时候生效，去掉请求 url 中的 base 前缀，方便后续中间件的处理（不用考虑 base 前缀路径）

launchEditorMiddleware：通过引入 launch-editor-middleware 实现了当请求后缀是 “/__open-in-editor” 时，支持在 node.js 编辑器中打开文件。

serverPublicMiddleware | serveStaticMiddleware | serveRawFsMiddleware：位于 node/server/middlewares/static.ts 下，通过引入 sirv 包实现了服务端静态文件的处理

transformMiddleware：位于 node/server/middlewares/transform.ts 下，实现了对不同格式的文件编译转化为浏览器能识别的 js 代码。（编译的逻辑后续详解）

indexHtmlMiddleware：位于 node/server/middlewares/indexHtml.ts 下，对 html 文件进行重写处理

errorMiddleware：位于 node/server/middlewares/error.ts 下，返回错误信息
