# Vue 源码解析 （二）initProxy 初始化代理

![f63e895cefc2ea411ec0474a95c93ac2_1202x463.png@900-0-90-f.png](http://image.huawei.com/tiny-lts/v1/images/f63e895cefc2ea411ec0474a95c93ac2_1202x463.png@900-0-90-f.png)

在 src/core/instance/proxy.js 找到源码

![image.png](http://image.huawei.com/tiny-lts/v1/images/a97f5f236047f14af0ab0f7aba7c68e2_378x383.png@900-0-90-f.png)

# makeMap，allowedGlobals

我们先来看看 makeMap 这个方法，做了什么处理：

```js
/*makeMap函数, str参数是接受的字符串, expectsLowerCase参数是否需要小写*/
 function makeMap(str, expectsLowerCase ) {
  /* 创建一个对象 */
  var map = Object.create(null);
  /*将字符串分割成数组*/
  var list = str.split(',');
  /*对数组进行遍历*/
  for (var i = 0; i < list.length; i++) {
     /*将每个key对应的值设置为true*/
     map[list[i]] = true;
  }
  /*最终返回, 根据参数设置是否是需要转换大小写*/
  return expectsLowerCase
       ? function (val) {
          return map[val.toLowerCase()];
       }
       : function (val) {
          return map[val];
       }
}
```
然后给一些 js 内置的全局方法做了相应的处理：

```js
var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
);
```

makeMap 函数的只要作用把这些全局的API转成以下的形式,

```js
{
    Infinity:true,
    undefined:true
}
```

# isNative

可以学习一下源码是如何检测是不是支持原生方法

```js
export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
```


# warnNonPresent

这个方法的意思是不存在，未定义的属性，方法被使用给出警告，我们来看看例子：

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script src="../vue.js"></script>
    <div id="app">
        <p>
            {{msg}}
        </p>
    </div>
    <script>
        const vm = new Vue({
            el: '#app',
        })
        console.log(vm)
    </script>
</body>

</html>
```

上面例子直接在魔板中使用 msg 变量，但是他没有在 data 中定义，此时 warnNonPresent 会处理抛出警告如图所示：

![image.png](http://image.huawei.com/tiny-lts/v1/images/c1be56aa5d532aecb66bbca5e8a4a338_1218x211.png@900-0-90-f.png)

# warnReservedPrefix

源码如下：

```js
const warnReservedPrefix = (target, key) => {
    warn(
      `Property "${key}" must be accessed with "$data.${key}" because ` +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    )
  }
```

用于检测属性 key 的声明方法，是否是 $ 或者 _ 开头的，如果是，会给出警告，拿个简单的例子来看下效果：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script src="../vue.js"></script>
    <div id="app">
        <p>
            {{$hhh}}
            {{_dddd}}
        </p>
    </div>
    <script>
        const vm = new Vue({
            el: '#app',
            data() {
                return {
                    $hhh: 'ddd',
                    _dddd: 'ffff'
                }
            },
        })
        console.log(vm)
    </script>
</body>

</html>
```

![image.png](http://image.huawei.com/tiny-lts/v1/images/afab7f8b613321d864c7078bcc87a582_1224x263.png@900-0-90-f.png)

# hasHandler

```js
var hasHandler = {
    /*target要代理的对象, key在外部操作时访问的属性*/
    has: function has(target, key) {
        /*key in target返回true或者false*/
        var has = key in target;
        /*在模板引擎里面,有一些属性vm没有进行代理, 但是也能使用, 像Number,Object等*/
        var isAllowed = allowedGlobals(key) ||
            (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
        /*在上面的has和isAllowed为false的情况下*/
        if (!has && !isAllowed) {
            if (key in target.$data) {
                warnReservedPrefix(target, key);
            }
            /*warnNonPresent函数, 当访问属性,没有存在vm实例上, 会报错提示*/
            else {
                warnNonPresent(target, key);
            }
        }
        /*has或者isAllowed*/
        return has || !isAllowed
    }
};
```

hasHandler 只配置了 has 钩子 ,当进行propKey in proxy in 操作符 或者 with() 操作时, 会触发 has钩子函数

hasHandler在查找key时,从三个方向进行查找

- 代理的 target 对象 通过 in 操作符
- 全局对象API allowedGlobals 函数
- 查找是否是渲染函数的内置方法 第一个字符以_开始 typeof key === 'string' && key.charAt(0) === '_'

hasHandler, 首先去检测 vm 实例上是否有该属性, 下面的代码是vm实例上可以查看到test

```js
new Vue({
   el:"#app",
   template:"<div>{{test}}</div>",
   data:{
       test
   }
})
```

如果在 vm 实例上没有找到, 然后再去判断下是否是一些全局的对象, 例如 Number 等, Number是语言所提供的 在模板中也可以使用

```js
new Vue({
   el:"#app",
   /*Number属于语言提供的全局API*/
   template:"<div> {{ Number(test) +1 }}</div>",
   data:{
       test
   }
})
```

# getHandler

```js
const getHandler = {
    get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        // 检测 data 是属性 key 是不是 $,_ 开头
        if (key in target.$data) warnReservedPrefix(target, key)
        else warnNonPresent(target, key)
      }
      return target[key]
    }
}
```

# initProxy

```js
initProxy = function initProxy(vm) {
/*hasProxy 判断当前环境是否支持es 提供的 Proxy*/
if (hasProxy) {
   // determine which proxy handler to use
   var options = vm.$options;
   /*不同条件返回不同的handlers, getHandler或者hasHandler */
   var handlers = options.render && options.render._withStripped
       ? getHandler
       : hasHandler;
   /* 代理vm实例 */
   vm._renderProxy = new Proxy(vm, handlers);
} else {
   vm._renderProxy = vm;
    }
};
```
