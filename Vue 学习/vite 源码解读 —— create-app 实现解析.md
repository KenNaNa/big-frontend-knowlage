本文所有分析针对版本 v2.0.1，你可以下载 vite v2.0.1 的源码

# 一、vite 安装过程

vite 提供了 npm 和 yarn 两种安装方式，我们以 npm 为例来进行分析，初次创建项目是通过命令

```js
	npm init @vitejs/app
```

执行之后，命令行交互如下：

```js
	$ npm init @vitejs/app
	npx: installed 5 in 4.565s
	? Project name: » vite-project
	√ Project name: · vite-project
	 
	Scaffolding project in C:\web\vite-project...
	√ Target directory vite-project is not empty.
	Remove existing files and continue? (Y/n) · true
	 
	? Select a template: ...
	> vanilla
	  vue
	  vue-ts
	  react
	  react-ts
	  preact
	  preact-ts
	  lit-element
	  lit-element-ts
	  
	  Done. Now run:
	 
	  cd vite-project
	  npm install
	  npm run dev
```

然后我们的项目就初始化成功了。

先了解下 npm init 命令，npm 官网上给出的解释是：

```js
	npm init [--force|-f|--yes|-y|--scope]
	npm init <@scope> (same as `npx <@scope>/create`)
	npm init [<@scope>/]<name> (same as `npx [<@scope>/]create-<name>`)
```

可以参考 npm init，所以 npm init @vitejs/app 这个命令其实等同于 npx @vitejs/create-app

npx 官方的解释是（可以参考 npx）：

```js
Run a command from a local or remote npm package
```

npx 不仅可以从远程仓库去获取包，而且可以调用本地项目内部安装的模块，而且还能避免全局模块的安装，可以参考阮一峰的 npx 使用教程

所以， npx 会去 npm 仓库上寻找 @vitejs/create-app 这个软件包，下载运行。可以看到 @vitejs/create-app 这个包的源码地址为 github.com/vitejs/vite 也就是我们的 vite 源码地址。

# 二、create-app 源码解析
create-app 本质是一个命令行脚手架，一般来说，开发脚手架有两种模式，一种是一站式的方式，就是暴露给用户很少选项选择，直接用默认的配置，一站式帮用户创建好默认配置的模板。另一种是选项式，将所有可供选择的选项都暴露出来，根据用户的不同选择，生成不同的模板配置。

create-app 就是一站式的方式创建 vite 工程，而第二种选项式，可以参考 nuxt.js 的脚手架 create-nuxt-app

create-app 创建工程的过程我们在上个步骤已经介绍过了，同时我们可以通过在创建时指定 vue 模板，来一站式生成一个 vue 框架的 vite 工程。

```js
	npm init @vitejs/app my-vue-app --template vue
```

为了了解这个过程，我们先来看看 create-app 目录下的结构

```js
	create-app
		- template-lit-element
		- template-lit-element-ts
		- template-preact
		- template-preact-ts
		- template-react
		- template-react-ts
		- template-vanilla
		- template-vue
		- template-vue-ts
		  CHANGELOG.md
		  index.js
		  LICENSE
	      package.json
		  READMD.md
		  updateVersions.js
```

看到这个结构之后，我们先猜测一下，假如使我们自己来实现的话，其实思路也是比较简单，无非就是通过命令行里面用户输入的参数，去读取相应的模板文件夹，然后去更新模板文件夹里面的一些动态信息。

其实 vite 的实现原理和我们分析的基本类似，所有的逻辑也都是在 index.js 下，比较简单，这里我们也进行一个简单的分析，主要的逻辑都在 index.js 文件里面。

在命令行中实现与用户交互主要通过 enquirer 这个组件完成，如下：

```js
	const { prompt } = require('enquirer')
	 
	let targetDir = argv._[0]
	if (!targetDir) {
	  /**
	   * @type {{ name: string }}
	   */
	  const { name } = await prompt({
	    type: 'input',
	    name: 'name',
	    message: `Project name:`,
	    initial: 'vite-project'
	  })
	  targetDir = name
	}
```

上面的代码就是使用 create-app 创建项目的第一个交互项，等待用户输入创建的项目名称，然后赋值给 name，作为文件夹名称。

选择模板的逻辑也类似，如下：

```js
	const {
	  yellow,
	  green,
	  cyan,
	  magenta,
	  lightRed,
	  stripColors
	} = require('kolorist')
	 
	const TEMPLATES = [
	  yellow('vanilla'),
	  green('vue'),
	  green('vue-ts'),
	  cyan('react'),
	  cyan('react-ts'),
	  magenta('preact'),
	  magenta('preact-ts'),
	  lightRed('lit-element'),
	  lightRed('lit-element-ts')
	]
	 
	const { t } = await prompt({
	   type: 'select',
	   name: 't',
	   message: `Select a template:`,
	   choices: TEMPLATES
	})
	template = stripColors(t)
```

这里还用到了一个染色的组件 kolorist

接着会根据用户选择的模板名称，读取相应模板目录下的资源文件，然后写入到新建的项目文件夹下面。如下：

```js
	const templateDir = path.join(__dirname, `template-${template}`)
	 
	const write = (file, content) => {
	  const targetPath = renameFiles[file]
	      ? path.join(root, renameFiles[file])
	      : path.join(root, file)
	  if (content) {
	    fs.writeFileSync(targetPath, content)
	  } else {
	    copy(path.join(templateDir, file), targetPath)
	  }
	}
	 
	const files = fs.readdirSync(templateDir)
	for (const file of files.filter((f) => f !== 'package.json')) {
	  write(file)
	}
```

整个 create-app 的实现其实非常简单，核心逻辑就主要就是以上部分，额外提一下的是，vite 还会去更新 create-app 目录下以 template 开头的模板名称，然后更新其 package.json 文件中 vite 的版本，这里由一个额外的文件 updateVersions.js 实现，如下：

```js
	;(async () => {
	  const templates = fs
	    .readdirSync(__dirname)
	    .filter((d) => d.startsWith('template-'))
	  for (const t of templates) {
	    const pkgPath = path.join(__dirname, t, `package.json`)
	    const pkg = require(pkgPath)
	    pkg.devDependencies.vite = `^` + require('../vite/package.json').version
	    if (t.startsWith('template-vue')) {
	      pkg.devDependencies['@vitejs/plugin-vue'] =
	        `^` + require('../plugin-vue/package.json').version
	    }
	    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
	  }
	})()
```





