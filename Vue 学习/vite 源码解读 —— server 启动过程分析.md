# 一、版本选择

本文所有分析针对版本 v1.0.0-rc.13，你可以下载 vite1.0.0-rc.13 的源码

为什么要选取 v1.0.0 版本而不是最新版本呢？因为便于理解，v2.0 之后的版本，有许多新特性以及功能优化等逻辑，导致逻辑比较复杂。我们的目的是分析 server 启动的主流程，相对而言，v1.0.0 版本更加直观、易懂。

# 二、server 功能分析
让我们先来回顾一下 vite 首次提交版本实现的 server 能力。如果忘了可以参考 vite 源码解读 —— 从 0 到 1 实现一个基于 esm 的简易版构建工具

vite 首次提交版本 server 主要实现的能力如下：

启动一个 http 服务器

拦截 http 请求

启动 websocket，监听客户端（浏览器）发送过来的消息

实现了 hmr 热更新能力

vite v1.0.0-rc.13 版本在此基础上有哪些能力的变动呢？经过源码分析后，列举如下：

- 启动一个 http 服务器
- 支持 https 和 http2
- 通过 koa Context，提供上下文处理能力
- 支持文件缓存
- 支持 cors
- hmr 热更新能力支持
- 重写 path
- 支持 sourcemap
- 支持多种文件格式，包括 vue 文件、css 文件、json、js 文件、jsx 文件等
- WebAssembly 支持
- static 静态文件支持
- 可扩展的插件机制
- vite v1.0.0-rc.13 版本最强大的特性就是可扩展的插件机制，6 -11 就是通过一个个不同的插件来实现的。

# 三、server 启动过程分析
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

这个方法其实会去创建一个 koa Context 对象，koa 提供一个 Context 对象，表示一个对话的上下文（包括 http 请求和 http 响应）。通过加工这个对象，就可以控制返回给用户的内容，感兴趣的可以去了解下 koa 的原理，这里不多赘述。

3、文件缓存

文件缓存能力的实现主要是通过 cachedRead 这个函数，app.use() 其实是使用了 koa 的 middleware 能力

```js
	app.use((ctx, next) => {
	  Object.assign(ctx, context)
	  ctx.read = cachedRead.bind(null, ctx)
	  return next()
	})
```

看过 koa 源码的同学可能知道，koa middleware 能力是通过拦截器实现的，所以这里会拦截 http 请求，然后调用 cachedRead 函数去进行文件的读取。我们来看看 cachedRead 函数的实现：

```js
	/**
	 * Read a file with in-memory cache.
	 * Also sets appropriate headers and body on the Koa context.
	 * This is exposed on middleware context as `ctx.read` with the `ctx` already
	 * bound, so it can be used as `ctx.read(file)`.
	 */
	export async function cachedRead(
	  ctx: Context | null,
	  file: string
	): Promise<Buffer> {
	  const lastModified = fs.statSync(file).mtimeMs
	  const cached = fsReadCache.get(file)
	  if (ctx) {
	    ctx.set('Cache-Control', 'no-cache')
	    ctx.type = mime.lookup(path.extname(file)) || 'application/octet-stream'
	  }
	  if (cached && cached.lastModified === lastModified) {
	    if (ctx) {
	      // a private marker in case the user ticks "disable cache" during dev
	      ctx.__notModified = true
	      ctx.etag = cached.etag
	      ctx.lastModified = new Date(cached.lastModified)
	      if (ctx.get('If-None-Match') === ctx.etag && seenUrls.has(ctx.url)) {
	        ctx.status = 304
	      }
	      seenUrls.add(ctx.url)
	      ctx.body = cached.content
	    }
	    return cached.content
	  }
	  // #395 some file is an binary file, eg. font
	  let content = await fs.readFile(file)
	  // Populate the "sourcesContent" array and resolve relative paths in the
	  // "sources" array, so the debugger can trace back to the original source.
	  if (file.endsWith('.map')) {
	    const map: RawSourceMap = JSON.parse(content.toString('utf8'))
	    if (!map.sourcesContent || !map.sources.every(path.isAbsolute)) {
	      const sourcesContent = map.sourcesContent || []
	      const sourceRoot = path.resolve(path.dirname(file), map.sourceRoot || '')
	      map.sources = await Promise.all(
	        map.sources.map(async (source, i) => {
	          const originalPath = path.resolve(sourceRoot, source)
	          if (!sourcesContent[i]) {
	            const originalCode = await cachedRead(null, originalPath)
	            sourcesContent[i] = originalCode.toString('utf8')
	          }
	          return originalPath
	        })
	      )
	      map.sourcesContent = sourcesContent
	      content = Buffer.from(JSON.stringify(map))
	    }
	  }
	  const etag = getETag(content)
	  fsReadCache.set(file, {
	    content,
	    etag,
	    lastModified
	  })
	  if (ctx) {
	    ctx.etag = etag
	    ctx.lastModified = new Date(lastModified)
	    ctx.body = content
	    ctx.status = 200
	 
	    // watch the file if it's out of root.
	    const { root, watcher } = ctx
	    watchFileIfOutOfRoot(watcher, root, file)
	  }
	  return content
	}
```

cachedRead 函数主要通过对比文件的 lastModified 这个时间戳来判断文件是否被改动。每次文件变动时，更新 lastModified 为最新时间戳，假如 fsReadCache 的 get 方法能够获取到缓存文件，并且缓存文件的时间戳没有改变，则返回缓存文件。

4、支持 cors

对 cors 的支持主要是通过 koa 的 @koa/cors 组件来支持的，参考 @koa/cors

```js
	// cors
	if (config.cors) {
	  app.use(
	    require('@koa/cors')(typeof config.cors === 'boolean' ? {} : config.cors)
	  )
	}
```

5、hmr 热更新能力的支持

和 vite 首次提交的方式相同，vite 1.0.0-rc.13 也是使用 chokidar 来实现监听文件改动的，如下：

```js
	const watcher = chokidar.watch(root, {
	    ignored: ['**/node_modules/**', '**/.git/**'],
	    // #610
	    awaitWriteFinish: {
	      stabilityThreshold: 100,
	      pollInterval: 10
	    }
	  }) as HMRWatcher
```

上面代码定义了一个 watcher 来监听文件改动，接着将这个 watcher 传入到了 Context 中

```js
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
```

具体的热更新的逻辑是通过 serverPluginHmr 这个插件来实现的，如下：

```js
	export const hmrPlugin: ServerPlugin = ({
	  root,
	  app,
	  server,
	  watcher,
	  resolver,
	  config
	}) => {
	 
	  ...
	  
	  const send = (watcher.send = (payload: HMRPayload) => {
	    const stringified = JSON.stringify(payload, null, 2)
	    debugHmr(`update: ${stringified}`)
	 
	    wss.clients.forEach((client) => {
	      if (client.readyState === WebSocket.OPEN) {
	        client.send(stringified)
	      }
	    })
	  })
	 
	  const handleJSReload = (watcher.handleJSReload = (
	    filePath: string,
	    timestamp: number = Date.now()
	  ) => {
	    // normal js file, but could be compiled from anything.
	    // bust the vue cache in case this is a src imported file
	    if (srcImportMap.has(filePath)) {
	      debugHmr(`busting Vue cache for ${filePath}`)
	      vueCache.del(filePath)
	    }
	 
	    const publicPath = resolver.fileToRequest(filePath)
	    const importers = importerMap.get(publicPath)
	    if (importers || isHmrAccepted(publicPath, publicPath)) {
	      const hmrBoundaries = new Set<string>()
	      const dirtyFiles = new Set<string>()
	      dirtyFiles.add(publicPath)
	 
	      const hasDeadEnd = walkImportChain(
	        publicPath,
	        importers || new Set(),
	        hmrBoundaries,
	        dirtyFiles
	      )
	 
	      // record dirty files - this is used when HMR requests coming in with
	      // timestamp to determine what files need to be force re-fetched
	      hmrDirtyFilesMap.set(String(timestamp), dirtyFiles)
	 
	      const relativeFile = '/' + slash(path.relative(root, filePath))
	      if (hasDeadEnd) {
	        send({
	          type: 'full-reload',
	          path: publicPath
	        })
	        console.log(chalk.green(`[vite] `) + `page reloaded.`)
	      } else {
	        const boundaries = [...hmrBoundaries]
	        const file =
	          boundaries.length === 1 ? boundaries[0] : `${boundaries.length} files`
	        console.log(
	          chalk.green(`[vite:hmr] `) +
	            `${file} hot updated due to change in ${relativeFile}.`
	        )
	        send({
	          type: 'multi',
	          updates: boundaries.map((boundary) => {
	            return {
	              type: boundary.endsWith('vue') ? 'vue-reload' : 'js-update',
	              path: boundary,
	              changeSrcPath: publicPath,
	              timestamp
	            }
	          })
	        })
	      }
	    } else {
	      debugHmr(`no importers for ${publicPath}.`)
	    }
	  })
	 
	  watcher.on('change', (file) => {
	    if (!(file.endsWith('.vue') || isCSSRequest(file))) {
	      // everything except plain .css are considered HMR dependencies.
	      // plain css has its own HMR logic in ./serverPluginCss.ts.
	      handleJSReload(file)
	    }
	  })
	}
```

当 watcher 检测到 ‘change’ 事件时，也就是文件发生了改动，此时会调用 handleJSReload 函数，handleJSReload 函数中会遍历依赖的关系图，根据不同的情况，发送不同 type 的消息给 client，client 中会根据消息类型，进行相应的更新处理。

遍历依赖的关系图的原理 serverPluginHmr.ts 文件里面有说明，感兴趣的朋友可以自行研究。

```js
	// How HMR works
	// 1. `.vue` files are transformed into `.js` files before being served
	// 2. All `.js` files, before being served, are parsed to detect their imports
	//    (this is done in `./serverPluginModuleRewrite.ts`) for module import rewriting.
	//    During this we also record the importer/importee relationships which can be used for
	//    HMR analysis (we do both at the same time to avoid double parse costs)
	// 3. When a file changes, it triggers an HMR graph analysis, where we try to
	//    walk its importer chains and see if we reach a "HMR boundary". An HMR
	//    boundary is a file that explicitly indicated that it accepts hot updates
	//    (by calling `import.meta.hot` APIs)
	// 4. If any parent chain exhausts without ever running into an HMR boundary,
	//    it's considered a "dead end". This causes a full page reload.
	// 5. If a boundary is encountered, we check if the boundary's current
	//    child importer is in the accepted list of the boundary (recorded while
	//    parsing the file for HRM rewrite). If yes, record current child importer
	//    in the `hmrBoundaries` Set.
	// 6. If the graph walk finished without running into dead ends, send the
	//    client to update all `hmrBoundaries`.
```

在 client/client.ts 文件中有对 server 发送的消息的处理逻辑

```js
	async function handleMessage(payload: HMRPayload) {
	  const { path, changeSrcPath, timestamp } = payload as UpdatePayload
	  switch (payload.type) {
	    case 'connected':
	      console.log(`[vite] connected.`)
	      break
	    case 'vue-reload':
	      queueUpdate(
	        import(`${path}?t=${timestamp}`)
	          .catch((err) => warnFailedFetch(err, path))
	          .then((m) => () => {
	            __VUE_HMR_RUNTIME__.reload(path, m.default)
	            console.log(`[vite] ${path} reloaded.`)
	          })
	      )
	      break
	    case 'vue-rerender':
	      const templatePath = `${path}?type=template`
	      import(`${templatePath}&t=${timestamp}`).then((m) => {
	        __VUE_HMR_RUNTIME__.rerender(path, m.render)
	        console.log(`[vite] ${path} template updated.`)
	      })
	      break
	    case 'style-update':
	      // check if this is referenced in html via <link>
	      const el = document.querySelector(`link[href*='${path}']`)
	      if (el) {
	        el.setAttribute(
	          'href',
	          `${path}${path.includes('?') ? '&' : '?'}t=${timestamp}`
	        )
	        break
	      }
	      // imported CSS
	      const importQuery = path.includes('?') ? '&import' : '?import'
	      await import(`${path}${importQuery}&t=${timestamp}`)
	      console.log(`[vite] ${path} updated.`)
	      break
	    case 'style-remove':
	      removeStyle(payload.id)
	      break
	    case 'js-update':
	      queueUpdate(updateModule(path, changeSrcPath, timestamp))
	      break
	    case 'custom':
	      const cbs = customUpdateMap.get(payload.id)
	      if (cbs) {
	        cbs.forEach((cb) => cb(payload.customData))
	      }
	      break
	    case 'full-reload':
	      if (path.endsWith('.html')) {
	        // if html file is edited, only reload the page if the browser is
	        // currently on that page.
	        const pagePath = location.pathname
	        if (
	          pagePath === path ||
	          (pagePath.endsWith('/') && pagePath + 'index.html' === path)
	        ) {
	          location.reload()
	        }
	        return
	      } else {
	        location.reload()
	      }
	  }
	}
```

值得注意的是，client.ts 是在浏览器侧执行的，那么它是如何被发送给浏览器执行的呢，这其实是通过 clientPlugin 插件实现的，clientPlugin 将 client.ts 以一个 js 脚本文件的方式，发送给浏览器执行。

# 四、其他能力

我们在第二部分分析了 server 提供的能力，除了上述的能力之外，还有路径重写、sourcemap支持、多种文件格式支持，WebAssembly 支持、static 静态文件支持、可扩展的插件机制等诸多能力，这些其实都是通过 Plugin 的方式实现的，我们上面介绍过了 ServerPluginHmr 这个插件来实现热更新的能力，其实其他的 Plugin 原理也类似，由于篇幅关系，这里就留给后面的插件分析的章节进行详细介绍了。
