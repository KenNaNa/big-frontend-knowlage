[taro-ui-vue3](https://b2nil.github.io/taro-ui-vue3/docs/introduction.html)

# config/dev.js

```js
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {}
}
```

# config/prod.js

```js
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
```

# config/index.js

```js
const config = {
  projectName: 'taro-vue3',
  date: '2021-4-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'vue3',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui-vue3'],
    webpackChain(chain) {
      chain.resolve.alias
        .set(
          '@tarojs/components$',
          '@tarojs/components/dist-h5/vue3/index.js'
        )
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
```

# config/h5-building-script.js

请看这里的配置

[h5-building-script.js](https://b2nil.github.io/taro-ui-vue3/docs/quickstart.html)

# tsconfig.json

```js
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "removeComments": false,
    "preserveConstEnums": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "outDir": "lib",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strictNullChecks": true,
    "sourceMap": true,
    "baseUrl": ".",
    "rootDir": ".",
    "jsx": "react-jsx",
    "allowJs": true,
    "resolveJsonModule": true,
    "typeRoots": [
      "node_modules/@types",
      "global.d.ts"
    ]
  },
  "exclude": [
    "node_modules",
    "dist"
  ],
  "compileOnSave": false
}
```

# project.config.json

```js
{
  "miniprogramRoot": "./dist",
  "projectname": "taro-vue3",
  "description": "",
  "appid": "touristappid",
  "setting": {
    "urlCheck": true,
    "es6": false,
    "postcss": false,
    "minified": false
  },
  "compileType": "miniprogram"
}
```

# postcss.config.js

```js
module.exports = {
  "plugins": {
    "postcss-pxtorem": {
      rootValue: 37.5,
      // Vant 官方根字体大小是 37.5
      propList: ['*'],
      selectorBlackList: ['.norem']
      // 过滤掉.norem-开头的class，不进行rem转换
    }
  }
}
```

# package.json

```js
{
  "name": "taro-vue3",
  "version": "1.0.0",
  "private": true,
  "description": "",
  "templateInfo": {
    "name": "default",
    "typescript": true,
    "css": "sass"
  },
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "build:swan": "taro build --type swan",
    "build:alipay": "taro build --type alipay",
    "build:tt": "taro build --type tt",
    "build:h5": "node ./config/h5-building-script.js && taro build --type h5",
    "build:rn": "taro build --type rn",
    "build:qq": "taro build --type qq",
    "build:jd": "taro build --type jd",
    "build:quickapp": "taro build --type quickapp",
    "dev:weapp": "npm run build:weapp -- --watch",
    "dev:swan": "npm run build:swan -- --watch",
    "dev:alipay": "npm run build:alipay -- --watch",
    "dev:tt": "npm run build:tt -- --watch",
    "dev:h5": "npm run build:h5 -- --watch",
    "dev:rn": "npm run build:rn -- --watch",
    "dev:qq": "npm run build:qq -- --watch",
    "dev:jd": "npm run build:jd -- --watch",
    "dev:quickapp": "npm run build:quickapp -- --watch"
  },
  "browserslist": [
    "last 3 versions",
    "Android >= 4.1",
    "ios >= 8"
  ],
  "author": "",
  "dependencies": {
    "@babel/runtime": "^7.7.7",
    "@tarojs/components": "3.1.5",
    "@tarojs/runtime": "3.1.5",
    "@tarojs/taro": "3.1.5",
    "axios": "^0.21.1",
    "mockjs": "^1.1.0",
    "postcss-pxtorem": "^6.0.0",
    "taro-ui-vue3": "^1.0.0-alpha.19",
    "vant": "^3.0.11",
    "vue": "^3.0.0",
    "vue-router": "^4.0.5",
    "vuex": "^4.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.8.0",
    "@tarojs/mini-runner": "3.1.5",
    "@tarojs/webpack-runner": "3.1.5",
    "@types/webpack-env": "^1.13.6",
    "@typescript-eslint/eslint-plugin": "^4.15.1",
    "@typescript-eslint/parser": "^4.15.1",
    "@vue/compiler-sfc": "^3.0.0",
    "babel-preset-taro": "3.1.5",
    "eslint": "^6.8.0",
    "eslint-config-taro": "3.1.5",
    "eslint-plugin-vue": "^7.0.0",
    "stylelint": "9.3.0",
    "typescript": "^4.1.0",
    "vue-loader": "^16.0.0-beta.8"
  }
}
```

# global.d.ts

```js
declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}

declare module ".vue"
declare module "vant"
declare module "mockjs"
declare module "axios"
declare module "vue-router"
declare module "vuex"
```

# babel.config.js

```js
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'vue3',
      ts: true
    }]
  ]
}
```

