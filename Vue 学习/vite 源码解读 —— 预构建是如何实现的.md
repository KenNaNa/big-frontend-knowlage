# 一、什么是预构建

首先，我们要了解一下什么是 vite 的预构建。可以参考 依赖预构建

可以看到，vite 的预构建，一方面是为了处理 CommonJS 和 UMD 兼容性，另一方面，也是最重要的一点，就是性能。

我们知道，vite 是通过拦截浏览器发出的 http 请求，获取浏览器所需的模块信息，然后处理请求，返回相应的模块给浏览器。在这种模式下，假如一个模块依赖了许多其他模块，就会造成大量的 http 请求，导致网页加载的速度非常慢。

vite 通过依赖预构建来解决这个问题。

vite 预构建会自动抓取项目源码中的依赖项，并且找出 “裸引用” 的模块，作为依赖预绑定的入口，然后将这些模块和它引用的模块构建成一个模块，这样就只需要一个 http 请求了，避免了上述问题的出现。

vite 预构建的过程主要通过 esbuild 实现的。

# 二、esbuild 介绍

1、什么是 esbuild

esbuild 的官网介绍是

```js
	An extremely fast JavaScript bundler and minifier
```

极其迅速的 Javascript 捆绑和压缩工具。怎么个迅速法呢？esbuild 还给出了下面一张图：

这个图非常明显地体现出了 esbuild 构建 ”神一般的速度“。所以 vite 也是才用的 esbuild 进行预构建。

2、esbuild 初探

esbuild 文档可以参考 esbuild 文档

下面简单介绍下 esbuild 里面比较重要的函数和接口。

2.1 transform

transform 函数主要用来将 js | jsx | tsx | ts 等文件转换为浏览器支持的 js 文件（旧语法）

我们来看一下它的定义：

```js
	func Transform(input string, options TransformOptions) TransformResult {
		return transformImpl(input, options)
	}
	 
	type TransformOptions struct {
		Color      StderrColor
		ErrorLimit int
		LogLevel   LogLevel
	 
		Sourcemap      SourceMap
		SourcesContent SourcesContent
	 
		Target     Target
		Format     Format
		GlobalName string
		Engines    []Engine
	 
		MinifyWhitespace  bool
		MinifyIdentifiers bool
		MinifySyntax      bool
		Charset           Charset
		TreeShaking       TreeShaking
	 
		JSXFactory  string
		JSXFragment string
		TsconfigRaw string
		Footer      string
		Banner      string
	 
		Define    map[string]string
		Pure      []string
		AvoidTDZ  bool
		KeepNames bool
	 
		Sourcefile string
		Loader     Loader
	}
```

esbuild 底层是用 go 实现的，不过这并不影响我们的基本阅读，可以看到 Transform 函数接收两个参数

- 第一个参数是一个 string 字符串，即需要转换的代码块
- 第二个参数是需要转化的选项，如源文件路径 sourcefile 等，其实是可选的，不传的话是一个空值。

transform 函数会返回一个 TransformResult，TransformResult 被 typescript 封装后会返回一个 Promise 对象

```js
transform(input: string, options?: TransformOptions):Promise<TransformResult>;
```

它会包含转化后的 js 代码、sourceMap 映射信息、warning 信息等。

```js
	export interface TransformResult {
	  // 转化后的 js 代码
	  code: string;
	  // sourceMap 映射信息
	  map: string;
	  warnings: Message[];
	}
```

2.2 build

build 函数除了支持代码转化之外，还支持将文件系统一个或多个文件捆绑在一起。在底层 go api 的注释中注明了它需要一个文件数组将路径作为入口点，解析他们及其所有的依赖项，将转化后的 js 文件输出到指定的 output 目录。

底层的 go api 定义如下：

```js
	func Build(options BuildOptions) BuildResult {
		return buildImpl(options).result
	}
	type BuildOptions struct {
		Color      StderrColor
		ErrorLimit int
		LogLevel   LogLevel
	 
		Sourcemap      SourceMap
		SourcesContent SourcesContent
	 
		Target  Target
		Engines []Engine
	 
		MinifyWhitespace  bool
		MinifyIdentifiers bool
		MinifySyntax      bool
		Charset           Charset
		TreeShaking       TreeShaking
	 
		JSXFactory  string
		JSXFragment string
	 
		Define    map[string]string
		Pure      []string
		AvoidTDZ  bool
		KeepNames bool
	 
		GlobalName        string
		Bundle            bool
		PreserveSymlinks  bool
		Splitting         bool
		Outfile           string
		Metafile          string
		Outdir            string
		Outbase           string
		AbsWorkingDir     string
		Platform          Platform
		Format            Format
		External          []string
		MainFields        []string
		Loader            map[string]Loader
		ResolveExtensions []string
		Tsconfig          string
		OutExtensions     map[string]string
		PublicPath        string
		Inject            []string
		Banner            string
		Footer            string
		NodePaths         []string // The "NODE_PATH" variable from Node.js
	 
		ChunkNames string
		AssetNames string
	 
		EntryPoints []string
		Stdin       *StdinOptions
		Write       bool
		Incremental bool
		Plugins     []Plugin
	 
		Watch *WatchMode
	}
```

它只包含一个参数 BuildOptions，用于指定 build 时的参数选项，包括依赖的入口文件列表 、插件列表 Plugins 等。

build 函数会返回一个 BuildResult，BuildResult 被 typescript 封装后会返回一个 Promise 对象

```js
	build: (options: types.BuildOptions): Promise<any>
```
它的结构如下，包含了生成的文件 outputFiles 和 warning 信息

```js
	export interface BuildResult {
	  warnings: Message[];
	  outputFiles?: OutputFile[]; // Only when "write: false"
	  rebuild?: BuildInvalidate; // Only when "incremental: true"
	  stop?: () => void; // Only when "watch: true"
	}
```

3、Service

因为 esbuild 底层是使用 go 来实现的，在每一次调用 build 和 transform 函数时，都会新起一个 goroutine，导致性能浪费。为了避免这个问题，esbuild 使用了一个 Service 的结构。

我们先来看看 Service 的结构，如下：

```js
	export interface Service {
	  build(options: BuildOptions & { write: false }): Promise<BuildResult & { outputFiles: OutputFile[] }>;
	  build(options: BuildOptions & { incremental: true }): Promise<BuildIncremental>;
	  build(options: BuildOptions): Promise<BuildResult>;
	  serve(serveOptions: ServeOptions, buildOptions: BuildOptions): Promise<ServeResult>;
	  transform(input: string, options?: TransformOptions): Promise<TransformResult>;
	 
	  // This stops the service, which kills the long-lived child process. Any
	  // pending requests will be aborted.
	  stop(): void;
	}
```

可以看出，Service 的本质其实就是对 build、transform 函数的封装，不同的是，service 提供了一个共享的 goroutine 来对它们进行调用，以避免性能损耗。

# 三、esbuild 在 vite 预构建中的使用
1、esbuild 初尝试

到这里，我们已经了解了什么是 vite 预构建，以及 esbuild 的基本原理与使用，那么现在就可以来尝试一下如何将我们 vite 项目中的文件进行捆绑构建了。

抱着这样的想法，我们不妨先来试一下，假设我们使用 vite 2.0 + vue3 + element-ui 新建了一个 vite demo，main.js 如下：

```js
	import { createApp } from 'vue';
	import App from './App.vue';
	import element from 'element-plus';
	import 'element-plus/lib/theme-chalk/index.css';
	import VueMarkdownIt from 'vue3-markdown-it';
	import 'highlight.js/styles/monokai.css';
	import 'vue-phone-number-input/dist/vue-phone-number-input.css';
	import router from './router';
	import store from './store';
	 
	const app = createApp(App);
	app.use(element);
	app.use(router);
	app.use(VueMarkdownIt);
	app.use(store);
	app.mount('#app');
```


我们使用 esbuild 来对这个文件进行预构建，看一下它的输出。为了让它在 node 环境下能够单独运行，我们使用 cjs 的标准，代码如下：

index.js

```js
	(async() => {
	    const { startService, build } = require("esbuild")
	 
	    const service = await startService()
	 
	    try {
	        const res = await service.build({
	            entryPoints: ["./src/main.js"],
	            outdir: './dist',
	            minify: true,
	            bundle: true,
	        })
	    } finally {
	        service.stop()
	    }
	})()
```

运行 node index.js，输出如下：

```js
	(node:21816) UnhandledPromiseRejectionWarning: Error: Build failed with 9 errors:
	src/main.js:1:26: error: Could not resolve "vue" (mark it as external to exclude it from the bundle)
	src/main.js:2:16: error: Could not resolve "./App.vue"
	src/main.js:3:20: error: Could not resolve "element-plus" (mark it as external to exclude it from the bundle)
	src/main.js:4:7: error: Could not resolve "element-plus/lib/theme-chalk/index.css" (mark it as external to exclude it from the bundle)
	src/main.js:5:26: error: Could not resolve "vue3-markdown-it" (mark it as external to exclude it from the bundle)
	...
```

报了一堆错，可以看到的是 esbuild 并不能识别 ‘.vue’ 文件，包括基于 vue3.0 的一些组件库 element-plus、vue3-markdown-it 等。

那么 vite 是怎么实现这个过程的呢？带着这个问题我们可以开始去看 vite 的源码实现了。

2、vite 预构建的流程

vite 依赖预构建提供了一个函数入口 optimizeDeps，这个函数在两个地方被调用了，一是在命令行运行 vite optimize 时，二是在 vite server 启动时。

我们不妨通过 optimizeDeps 这个函数入手。这个函数在 src/node/optimizer/index.ts 文件下，源码如下：

```js
	export async function optimizeDeps(
	  config: ResolvedConfig,
	  force = config.server.force,
	  asCommand = false,
	  newDeps?: Record<string, string> // missing imports encountered after server has started
	): Promise<DepOptimizationMetadata | null> {
	  config = {
	    ...config,
	    command: 'build'
	  }
	 
	  // 从 config 中获取 cacheDir, 然后为缓存的文件夹生成一个包含哈希数的描述文件
	  // 通过判断哈希数是否变动来决定是否刷新缓存
	  const { root, logger, optimizeCacheDir: cacheDir } = config
	  ...
	  const dataPath = path.join(cacheDir, '_metadata.json')
	  const mainHash = getDepHash(root, config)
	  const data: DepOptimizationMetadata = {
	    hash: mainHash,
	    browserHash: mainHash,
	    optimized: {}
	  }
	 
	  // 扫描所有的依赖模块
	  let deps: Record<string, string>, missing: Record<string, string>
	  if (!newDeps) {
	    ;({ deps, missing } = await scanImports(config))
	  } else {
	    deps = newDeps
	    missing = {}
	  }
	  ...
	 
	  const esbuildMetaPath = path.join(cacheDir, '_esbuild.json')
	 
	  // esbuild 是基于公共祖先的嵌套目录，所以不太方便分析 imports 和 exports
	  // 于是把所有的依赖关系平铺，建立 k-v 的映射表
	  const flatIdDeps: Record<string, string> = {}
	  const idToExports: Record<string, ExportsData> = {}
	  const flatIdToExports: Record<string, ExportsData> = {}
	 
	  await init
	  for (const id in deps) {
	    const flatId = flattenId(id)
	    flatIdDeps[flatId] = deps[id]
	    const exportsData = parse(fs.readFileSync(deps[id], 'utf-8'))
	    idToExports[id] = exportsData
	    flatIdToExports[flatId] = exportsData
	  }
	 
	  const define: Record<string, string> = {
	    'process.env.NODE_ENV': JSON.stringify(config.mode)
	  }
	  for (const key in config.define) {
	    define[key] = JSON.stringify(config.define[key])
	  }
	  ...
	 
	  const start = Date.now()
	  const esbuildService = await ensureService()
	  // 使用 esbuild service 和 build 函数进行依赖构建
	  await esbuildService.build({
	    entryPoints: Object.keys(flatIdDeps),
	    bundle: true,
	    format: 'esm',
	    external: config.optimizeDeps?.exclude,
	    logLevel: 'error',
	    splitting: true,
	    sourcemap: true,
	    outdir: cacheDir,
	    treeShaking: 'ignore-annotations',
	    metafile: esbuildMetaPath,
	    define,
	    // 使用 esbuildDepPlugin 插件进行构建
	    plugins: [esbuildDepPlugin(flatIdDeps, flatIdToExports, config)]
	  })
	 
	  const meta = JSON.parse(fs.readFileSync(esbuildMetaPath, 'utf-8'))
	 
	  for (const id in deps) {
	    const entry = deps[id]
	    data.optimized[id] = {
	      file: normalizePath(path.resolve(cacheDir, flattenId(id) + '.js')),
	      src: entry,
	      needsInterop: needsInterop(id, idToExports[id], meta.outputs)
	    }
	  }
	 
	  // 写磁盘文件
	  writeFile(dataPath, JSON.stringify(data, null, 2))
	  if (asCommand) {
	    await stopService()
	  }
	 
	  debug(`deps bundled in ${Date.now() - start}ms`)
	  return data
	}
```

可以看到 esbuild 依赖预构建的主流程先从 config 中获取 cacheDir, 然后调用 scanImports 扫描所有的依赖模块，将依赖关系平铺并且用 k-v 结构的键值对保存，然后构造了一个插件 esbuildDepPlugin，使用 esbuild 进行构建的过程中，传入 esbuildDepPlugin 处理数据输入，然后将构建后的结果文件输出到 cacheDir 目录下，最后将结果的元数据信息写入到 cacheDir 下的 _metadata.json，通过检测该文件的哈希值来判断是否需要刷新缓存（重新构建）。

3、vue 文件是怎么处理的？

通过前面的分析我们发现了，假如直接使用 esbuild 去构建 vue3.0 的工程的话是会报错的，那么 vite 是怎么实现使用 esbuild 处理不同类型的文件的呢？

我们先看一下 scanImports 的代码

```js
	export async function scanImports(
	  config: ResolvedConfig
	): Promise<{
	  deps: Record<string, string>
	  missing: Record<string, string>
	}> {
	  const s = Date.now()
	 
	  let entries: string[] = []
	 
	  const explicitEntryPatterns = config.optimizeDeps?.entries
	  const buildInput = config.build.rollupOptions?.input
	 
	  if (explicitEntryPatterns) {
	    entries = await globEntries(explicitEntryPatterns, config)
	  } else if (buildInput) {
	    const resolvePath = (p: string) => path.resolve(config.root, p)
	    if (typeof buildInput === 'string') {
	      entries = [resolvePath(buildInput)]
	    } else if (Array.isArray(buildInput)) {
	      entries = buildInput.map(resolvePath)
	    } else if (isObject(buildInput)) {
	      entries = Object.values(buildInput).map(resolvePath)
	    } else {
	      throw new Error('invalid rollupOptions.input value.')
	    }
	  } else {
	    entries = await globEntries('**/*.html', config)
	  }
	 
	  // Non-supported entry file types and virtual files should not be scanned for
	  // dependencies.
	  entries = entries.filter(
	    (entry) =>
	      (JS_TYPES_RE.test(entry) || htmlTypesRE.test(entry)) &&
	      fs.existsSync(entry)
	  )
	 
	  if (!entries.length) {
	    debug(`No entry HTML files detected`)
	    return { deps: {}, missing: {} }
	  } else {
	    debug(`Crawling dependencies using entries:\n  ${entries.join('\n  ')}`)
	  }
	 
	  const tempDir = path.join(config.optimizeCacheDir!, 'temp')
	  const deps: Record<string, string> = {}
	  const missing: Record<string, string> = {}
	  const container = await createPluginContainer(config)
	  const plugin = esbuildScanPlugin(config, container, deps, missing, entries)
	 
	  const esbuildService = await ensureService()
	  await Promise.all(
	    entries.map((entry) =>
	      esbuildService.build({
	        entryPoints: [entry],
	        bundle: true,
	        format: 'esm',
	        logLevel: 'error',
	        outdir: tempDir,
	        plugins: [plugin]
	      })
	    )
	  )
	 
	  emptyDir(tempDir)
	  fs.rmdirSync(tempDir)
	 
	  debug(`Scan completed in ${Date.now() - s}ms:`, deps)
	 
	  return {
	    deps,
	    missing
	  }
	}
```

这个函数无非就是先使用 glob 扫描出了所有的依赖入口文件，然后对需要排除的路径进行了过滤，最后遍历所有的入口 entries，然后调用 esbuild 进行构建，这里需要关注的是 esbuildScanPlugin 这个 plugin，vite 通过 esbuildScanPlugin 实现了对不同格式的文件的处理。

esbuildScanPlugin 其实是使用了 esbuild 的 plugin 机制，可以参考 esbuild plugins

```js
	const htmlTypesRE = /\.(html|vue|svelte)$/
	 
	// extract scripts inside HTML-like files and treat it as a js module
	build.onLoad({ filter: htmlTypesRE, namespace: 'html' }, ({ path }) => {
	  const raw = fs.readFileSync(path, 'utf-8')
	  const regex = path.endsWith('.html') ? scriptModuleRE : scriptRE
	  regex.lastIndex = 0
	  let js = ''
	  let loader: Loader = 'js'
	  let match
	  while ((match = regex.exec(raw))) {
	    const [, openTag, content] = match
	    const srcMatch = openTag.match(srcRE)
	    const langMatch = openTag.match(langRE)
	    const lang =
	      langMatch && (langMatch[1] || langMatch[2] || langMatch[3])
	    if (lang === 'ts' || lang === 'tsx' || lang === 'jsx') {
	      loader = lang
	    }
	    if (srcMatch) {
	      const src = srcMatch[1] || srcMatch[2] || srcMatch[3]
	      js += `import ${JSON.stringify(src)}\n`
	    } else if (content.trim()) {
	      js += content + '\n'
	    }
	  }
	  ...
	  return {
	    loader,
	    contents: js
	  }
	})
```

可以看到，假如 vite 发现是后缀是 html|vue|svelte 类的文件，则使用正则匹配提取文件中的 js 代码返回。接着在后续构建调用的 esbuildDepPlugin 插件中，匹配提取出的 js 代码进行编译，如下：

```js
	// externalize assets and commonly known non-js file types
	build.onResolve(
	  {
	    filter: new RegExp(`\\.(` + externalTypes.join('|') + `)(\\?.*)?$`)
	  },
	  async ({ path: id, importer }) => {
	    const resolved = await resolve(id, importer)
	    if (resolved) {
	      return {
	        path: resolved,
	        external: true
	      }
	    }
	  }
	)
```

这就实现了对 vue 文件的处理。其他的逻辑不再赘述，大家自行阅读代码即可。





