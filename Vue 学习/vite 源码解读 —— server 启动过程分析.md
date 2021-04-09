一、版本选择
本文所有分析针对版本 v1.0.0-rc.13，你可以下载 vite1.0.0-rc.13 的源码

为什么要选取 v1.0.0 版本而不是最新版本呢？因为便于理解，v2.0 之后的版本，有许多新特性以及功能优化等逻辑，导致逻辑比较复杂。我们的目的是分析 server 启动的主流程，相对而言，v1.0.0 版本更加直观、易懂。

二、server 功能分析
让我们先来回顾一下 vite 首次提交版本实现的 server 能力。如果忘了可以参考 vite 源码解读 —— 从 0 到 1 实现一个基于 esm 的简易版构建工具

vite 首次提交版本 server 主要实现的能力如下：

启动一个 http 服务器

拦截 http 请求

启动 websocket，监听客户端（浏览器）发送过来的消息

实现了 hmr 热更新能力

vite v1.0.0-rc.13 版本在此基础上有哪些能力的变动呢？经过源码分析后，列举如下：

启动一个 http 服务器
支持 https 和 http2
通过 koa Context，提供上下文处理能力
支持文件缓存
支持 cors
hmr 热更新能力支持
重写 path
支持 sourcemap
支持多种文件格式，包括 vue 文件、css 文件、json、js 文件、jsx 文件等
WebAssembly 支持
static 静态文件支持
可扩展的插件机制
vite v1.0.0-rc.13 版本最强大的特性就是可扩展的插件机制，6 -11 就是通过一个个不同的插件来实现的。

三、server 启动过程分析
要分析 server 的启动过程，首先我们要找到启动的入口，由于我们是通过命令行进行启动的。v1.0.0 版本是通过 vite serve 进行启动，所以我们找到 node 目录下的 cli.ts 文件，里面有一段代码即入口：


```js
	// serve
	cli
	  .command('[root]') // default command
	  .alias('serve')
	  .option('--port <port>', `[number]  port to listen to`)
	  .option(
	    '--force',
	    `[boolean]  force the optimizer to ignore the cache and re-bundle`
	  )
	  .option('--https', `[boolean]  start the server with TLS and HTTP/2 enabled`)
	  .option('--open', `[boolean]  open browser on server start`)
	  .action(async (root: string, argv: any) => {
	    if (root) {
	      argv.root = root
	    }
	    const options = await resolveOptions({ argv, defaultMode: 'development' })
	    return runServe(options)
	  })
```

这里主要是调用了 runServe 这个函数，这个函数如下：

```js
	function runServe(options: UserConfig) {
	  const server = require('./server').createServer(options)
	 
	  let port = options.port || 3000
	  let hostname = options.hostname || 'localhost'
	  const protocol = options.https ? 'https' : 'http'
	 
	  server.on('error', (e: Error & { code?: string }) => {
	    if (e.code === 'EADDRINUSE') {
	      console.log(`Port ${port} is in use, trying another one...`)
	      setTimeout(() => {
	        server.close()
	        server.listen(++port)
	      }, 100)
	    } else {
	      console.error(chalk.red(`[vite] server error:`))
	      console.error(e)
	    }
	  })
	 
	  server.listen(port, () => {
	    console.log()
	    console.log(`  Dev server running at:`)
	    const interfaces = os.networkInterfaces()
	    Object.keys(interfaces).forEach((key) =>
	      (interfaces[key] || [])
	        .filter((details) => details.family === 'IPv4')
	        .map((detail) => {
	          return {
	            type: detail.address.includes('127.0.0.1')
	              ? 'Local:   '
	              : 'Network: ',
	            host: detail.address.replace('127.0.0.1', hostname)
	          }
	        })
	        .forEach(({ type, host }) => {
	          const url = `${protocol}://${host}:${chalk.bold(port)}/`
	          console.log(`  > ${type} ${chalk.cyan(url)}`)
	        })
	    )
	    console.log()
	    require('debug')('vite:server')(`server ready in ${Date.now() - start}ms.`)
	 
	    if (options.open) {
	      require('./utils/openBrowser').openBrowser(
	        `${protocol}://${hostname}:${port}`
	      )
	    }
	  })
	}
```

这段代码主要是通过引入 server 模块的 createServer 函数创建了一个 server，接着在指定的端口上进行了服务的监听和错误处理。这里的核心逻辑在于 createServer，跟踪进去，如下：

```js
	export function createServer(config: ServerConfig): Server {
	  const {
	    root = process.cwd(),
	    configureServer = [],
	    resolvers = [],
	    alias = {},
	    transforms = [],
	    vueCustomBlockTransforms = {},
	    optimizeDeps = {},
	    enableEsbuild = true,
	    assetsInclude
	  } = config
	 
	  const app = new Koa<State, Context>()
	  const server = resolveServer(config, app.callback())
	  const watcher = chokidar.watch(root, {
	    ignored: ['**/node_modules/**', '**/.git/**'],
	    // #610
	    awaitWriteFinish: {
	      stabilityThreshold: 100,
	      pollInterval: 10
	    }
	  }) as HMRWatcher
	  const resolver = createResolver(root, resolvers, alias, assetsInclude)
	 
	  const context: ServerPluginContext = {
	    root,
	    app,
	    server,
	    watcher,
	    resolver,
	    config,
	    // port is exposed on the context for hmr client connection
	    // in case the files are served under a different port
	    port: config.port || 3000
	  }
	 
	  // attach server context to koa context
	  app.use((ctx, next) => {
	    Object.assign(ctx, context)
	    ctx.read = cachedRead.bind(null, ctx)
	    return next()
	  })
	 
	  // cors
	  if (config.cors) {
	    app.use(
	      require('@koa/cors')(typeof config.cors === 'boolean' ? {} : config.cors)
	    )
	  }
	 
	  const resolvedPlugins = [
	    // rewrite and source map plugins take highest priority and should be run
	    // after all other middlewares have finished
	    sourceMapPlugin,
	    moduleRewritePlugin,
	    htmlRewritePlugin,
	    // user plugins
	    ...toArray(configureServer),
	    envPlugin,
	    moduleResolvePlugin,
	    proxyPlugin,
	    clientPlugin,
	    hmrPlugin,
	    ...(transforms.length || Object.keys(vueCustomBlockTransforms).length
	      ? [
	          createServerTransformPlugin(
	            transforms,
	            vueCustomBlockTransforms,
	            resolver
	          )
	        ]
	      : []),
	    vuePlugin,
	    cssPlugin,
	    enableEsbuild ? esbuildPlugin : null,
	    jsonPlugin,
	    assetPathPlugin,
	    webWorkerPlugin,
	    wasmPlugin,
	    serveStaticPlugin
	  ]
	  resolvedPlugins.forEach((m) => m && m(context))
	 
	  const listen = server.listen.bind(server)
	  server.listen = (async (port: number, ...args: any[]) => {
	    if (optimizeDeps.auto !== false) {
	      await require('../optimizer').optimizeDeps(config)
	    }
	    return listen(port, ...args)
	  }) as any
	 
	  server.once('listening', () => {
	    context.port = (server.address() as AddressInfo).port
	  })
	 
	  return server
	}
```

这一段代码就是 server 启动的核心代码，我们按照它的功能点来一点一点进行分析。

1、创建 http 服务器
实现这个能力的函数是 resolveServer，它主要通过调用 http、https 和 http2 模块的能力来实现 Server 的创建，如下：

```js
	const app = new Koa<State, Context>()
	const server = resolveServer(config, app.callback())
	...
	 
	function resolveServer(
	  { https = false, httpsOptions = {}, proxy }: ServerConfig,
	  requestListener: RequestListener
	): Server {
	  if (!https) {
	    return require('http').createServer(requestListener)
	  }
	 
	  if (proxy) {
	    // #484 fallback to http1 when proxy is needed.
	    return require('https').createServer(
	      resolveHttpsConfig(httpsOptions),
	      requestListener
	    )
	  } else {
	    return require('http2').createSecureServer(
	      {
	        ...resolveHttpsConfig(httpsOptions),
	        allowHTTP1: true
	      },
	      requestListener
	    )
	  }
	}
```

2、复用 koa Context 对象，处理上下文
上面的代码中，在调用 resolveServer 时传入了一个 app.callback() 对象

```js
const app = new Koa<State, Context>()
const server = resolveServer(config, app.callback())
```



