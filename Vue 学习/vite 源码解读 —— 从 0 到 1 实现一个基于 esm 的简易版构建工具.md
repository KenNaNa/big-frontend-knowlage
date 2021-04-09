[第一次提交的源码在此](https://github.com/vitejs/vite/tree/820c2cfbefd376b7be2d0ba5ad1fd39d3e45347e/lib)

# 一、vite 核心原理
在阅读本文之前，你最好对 vite 有一定程度的了解，可以参考 vite 中文文档

vite 充分利用浏览器支持 es modules 的特性。利用浏览器去解析 imports，实现了 modules 的按需加载，完全跳过了打包的概念，同时实现了 hmr 。在 vite 的 esm 机制下，服务的更新并不会随着模块的增多而变慢，极大地提高了构建速度。

那么 vite 是如何实现这个过程的呢？

在最新的 esm 标准下，浏览器通过识别 type 为 module 的 script 脚本，例如 <script type="module" src="main.js"></script> ，对 src 及 import 导入的文件会发送 http 请求，vite 会拦截这些请求，并对请求的不同格式的文件进行不同处理，然后将结果返回给浏览器。

# 二、简易版 vite 的实现
talk is cheap，弄清楚了原理，我们就可以撸起袖子开始干了。

```js
	const http = require('http')
	const serve = require('serve-handler')
	 
	const server = http.createServer((req, res) => {
		serve(req, res)
	})
	 
	server.listen(3000, () => {
	  console.log('Running at http://localhost:3000')
	})
```

1.2 拦截 http 请求

```js
	const fs = require('fs')
	const path = require('path')
	const http = require('http')
	const url = require('url')
	const serve = require('serve-handler')
	const vue = require('./vueMiddleware')
	const { sendJS } = require('./utils')
	 
	const server = http.createServer((req, res) => {
	  const pathname = url.parse(req.url).pathname
	  if (pathname === '/__hmrProxy') {
	    sendJS(res, hmrProxy)
	  } else if (pathname.endsWith('.vue')) {
	    vue(req, res)
	  } else {
	    serve(req, res)
	  }
	})
	 
	server.listen(3000, () => {
	  console.log('Running at http://localhost:3000')
	})
```

上面的代码在 1.1 的基础上添加了一个拦截的逻辑，主要是对 url 路径进行拦截，假如是 ‘.vue’ 结尾的 vue 文件，则在 vueMiddleware 中进行处理，假如是以 ‘__hmrProxy’ 后缀结尾的文件，则发送一段 js 给浏览器，这里后面 hmr 部分会详细介绍。

1.3 使用 websocket 监听文件变动

```js
	const fs = require('fs')
	const path = require('path')
	const http = require('http')
	const url = require('url')
	const ws = require('ws')
	const serve = require('serve-handler')
	const vue = require('./vueMiddleware')
	const { createFileWatcher } = require('./fileWatcher')
	const { sendJS } = require('./utils')
	 
	const hmrProxy = fs.readFileSync(path.resolve(__dirname, './hmrProxy.js'))
	 
	const server = http.createServer((req, res) => {
	  const pathname = url.parse(req.url).pathname
	  if (pathname === '/__hmrProxy') {
	    sendJS(res, hmrProxy)
	  } else if (pathname.endsWith('.vue')) {
	    vue(req, res)
	  } else {
	    serve(req, res)
	  }
	})
	 
	const wss = new ws.Server({ server })
	const sockets = new Set()
	wss.on('connection', (socket) => {
	  sockets.add(socket)
	  socket.send(JSON.stringify({ type: 'connected'}))
	  socket.on('close', () => {
	    sockets.delete(socket)
	  })
	})
	 
	createFileWatcher((payload) =>
	  sockets.forEach((s) => s.send(JSON.stringify(payload)))
	)
	 
	server.listen(3000, () => {
	  console.log('Running at http://localhost:3000')
	})
```

上面的代码在 1.2 的基础上添加了 websocket 的逻辑，websocket 分为 client 和 server 两端，client 端在浏览器中运行，server 端监听 client 的请求，接收文件变动的事件，并进行相应的处理。

通过 send 和 sendJS 函数发送响应给浏览器，其中 send 函数发送的是文本，sendJS 发送的是 js 代码，如下：

utils.js

```js
	function send(res, source, mime) {
	  res.setHeader('Content-Type', mime)
	  res.end(source)
	}
	 
	function sendJS(res, source) {
	  send(res, source, 'application/javascript')
	}
	 
	exports.send = send
	exports.sendJS = sendJS
```

2、处理 vue 文件
在阅读处理 vue 文件的逻辑之前，你需要先了解 Vue 单文件组件（SFC) 规范

```js
	const fs = require('fs')
	const url = require('url')
	const path = require('path')
	const qs = require('querystring')
	const { parseSFC } = require('./parseSFC')
	const { compileTemplate } = require('@vue/compiler-sfc')
	const { sendJS } = require('./utils')
	 
	module.exports = (req, res) => {
	  const parsed = url.parse(req.url, true)
	  const query = parsed.query
	  const filename = path.join(process.cwd(), parsed.pathname.slice(1))
	  const [descriptor] = parseSFC(filename)
	  if (!query.type) {
	    let code = ``
	    // TODO use more robust rewrite
	    if (descriptor.script) {
	      code += descriptor.script.content.replace(
	        `export default`,
	        'const script ='
	      )
	      code += `\nexport default script`
	    }
	    if (descriptor.template) {
	      code += `\nimport { render } from ${JSON.stringify(
	        parsed.pathname + `?type=template${query.t ? `&t=${query.t}` : ``}`
	      )}`
	      code += `\nscript.render = render`
	    }
	    if (descriptor.style) {
	      // TODO
	    }
	    code += `\nscript.__hmrId = ${JSON.stringify(parsed.pathname)}`
	    return sendJS(res, code)
	  }
	 
	  if (query.type === 'template') {
	    const { code, errors } = compileTemplate({
	      source: descriptor.template.content,
	      filename,
	      compilerOptions: {
	        runtimeModuleName: '/vue.js'
	      }
	    })
	 
	    if (errors) {
	      // TODO
	    }
	    return sendJS(res, code)
	  }
	 
	  if (query.type === 'style') {
	    // TODO
	    return
	  }
	 
	  // TODO custom blocks
	}
```

对 vue 文件的处理主要用到了 @vue/compiler-sfc 组件，想深入研究的朋友可以参考 compiler-sfc

这里还用到了 parseSFC 这个方法，我们来看看这个方法的内容：

parseSFC.js

```js
	const fs = require('fs')
	const { parse } = require('@vue/compiler-sfc')
	 
	const cache = new Map()
	 
	exports.parseSFC = filename => {
	  const content = fs.readFileSync(filename, 'utf-8')
	  const { descriptor, errors } = parse(content, {
	    filename
	  })
	 
	  if (errors) {
	    // TODO
	  }
	 
	  const prev = cache.get(filename)
	  cache.set(filename, descriptor)
	  return [descriptor, prev]
	}
```

可以看到，parseSFC 这个方法也是通过 @vue/compiler-sfc 组件来进行 vue 文件的解析的。

3、hmr 动态更新

上面我们在创建 http server ，拦截 url 请求时有下面这段逻辑

```js
	const hmrProxy = fs.readFileSync(path.resolve(__dirname, './hmrProxy.js'))
	 
	const server = http.createServer((req, res) => {
	  const pathname = url.parse(req.url).pathname
	  if (pathname === '/__hmrProxy') {
	    sendJS(res, hmrProxy)
	  } else if (pathname.endsWith('.vue')) {
	    vue(req, res)
	  } else {
	    serve(req, res)
	  }
	})
```

上面介绍 sendJS 时也说到了，sendJS 会给浏览器发送一段 js 代码，这段代码就是 hmrProxy.js，如下：

hmrProxy.js

```js
	// This file runs in the browser.
	 
	const socket = new WebSocket(`ws://${location.host}`)
	 
	// Listen for messages
	socket.addEventListener('message', ({ data }) => {
	  const { type, path, index } = JSON.parse(data)
	  switch (type) {
	    case 'connected':
	      console.log(`[vds] connected.`)
	      break
	    case 'reload':
	      import(`${path}?t=${Date.now()}`).then(m => {
	        __VUE_HMR_RUNTIME__.reload(path, m.default)
	        console.log(`[vds][hmr] ${path} reloaded.`)
	      })
	      break
	    case 'rerender':
	      import(`${path}?type=template&t=${Date.now()}`).then(m => {
	        __VUE_HMR_RUNTIME__.rerender(path, m.render)
	        console.log(`[vds][hmr] ${path} template updated.`)
	      })
	      break
	    case 'update-style':
	      import(`${path}?type=style&index=${index}&t=${Date.now()}`).then(m => {
	        // TODO style hmr
	      })
	      break
	    case 'full-reload':
	      location.reload()
	  }
	})
	 
	// ping server
	socket.addEventListener('close', () => {
	  console.log(`[vds] server connection lost. polling for restart...`)
	  setInterval(() => {
	    new WebSocket(`ws://${location.host}`).addEventListener('open', () => {
	      location.reload()
	    })
	  }, 1000)
	})
```

这是 websocket 的 client 端，在这段代码里面，client socket 接收 server 发送的消息，假如消息的类型是 ‘reload’ 或者 ‘rerender’，则会触发热更新，__VUE_HMR_RUNTIME__ 是 vue3 在 window 上挂载的一个对象，通过它来实现组件重新挂载渲染的功能，源码可参考 hmr.ts

既然 client 接收 server 发送的 type 为 ‘reload’ 或者 ‘rerender’ 类型的消息时会触发热更新，那么就需要 server 去检测文件变化，然后 “告诉” client 是否需要进行 ‘reload’ 或 ‘rerender’，检测文件变化的逻辑在 fileWatcher 里实现的，还记得 server.js 里面有一段代码吗？

```js
	const { createFileWatcher } = require('./fileWatcher')
	 
	createFileWatcher((payload) =>
	  sockets.forEach((s) => s.send(JSON.stringify(payload)))
	)
```

这里从 fileWatcher 中引入了一个 createFileWatcher 方法，我们来看看：

fileWatcher.js

```js
	const fs = require('fs')
	const path = require('path')
	const chokidar = require('chokidar')
	const { parseSFC } = require('./parseSFC')
	 
	exports.createFileWatcher = (notify) => {
	  const fileWatcher = chokidar.watch(process.cwd(), {
	    ignored: [/node_modules/]
	  })
	 
	  fileWatcher.on('change', (file) => {
	    if (file.endsWith('.vue')) {
	      // check which part of the file changed
	      const [descriptor, prevDescriptor] = parseSFC(file)
	      const resourcePath = '/' + path.relative(process.cwd(), file)
	 
	      if (!prevDescriptor) {
	        // the file has never been accessed yet
	        return
	      }
	 
	      if (
	        (descriptor.script && descriptor.script.content) !==
	        (prevDescriptor.script && prevDescriptor.script.content)
	      ) {
	        console.log(`[hmr] <script> for ${resourcePath} changed. Triggering component reload.`)
	        notify({
	          type: 'reload',
	          path: resourcePath
	        })
	        return
	      }
	 
	      if (
	        (descriptor.template && descriptor.template.content) !==
	        (prevDescriptor.template && prevDescriptor.template.content)
	      ) {
	        console.log(`[hmr] <template> for ${resourcePath} changed. Triggering component re-render.`)
	        notify({
	          type: 'rerender',
	          path: resourcePath
	        })
	        return
	      }
	 
	      // TODO styles
	    } else {
	      console.log(`[hmr] script file ${resourcePath} changed. Triggering full page reload.`)
	      notify({
	        type: 'full-reload'
	      })
	    }
	  })
	}
```

可见是使用 chokidar 来监听文件变化。关于 chokidar 可以参考 chokidar

三、结语
经过上面的步骤，我们基本完成了一个最原始版本的 vite 实现，当然，相比于 vite 2.0，显得简陋了许多，不过这些的确就是 vite 最开始的构思与实现，也是 vite 的 first commit 的代码。更多细节，可以参考：vite
