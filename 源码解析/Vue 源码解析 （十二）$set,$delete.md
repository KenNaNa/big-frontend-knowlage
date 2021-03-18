# Vue 源码解析 （十二）$set,$delete

我们先来看看一个简单得例子

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
    <div id="app"
         @once>
        <p @click="clickEvent">
            <keep-alive :max="1"
                        include="comp-a">
                <comp-a @hook:updated="hookUpdated"
                        msg="hello"
                        @hook:mounted="hookUpdated"></comp-a>
            </keep-alive>
        </p>
    </div>
    <script>
        const compA = {
                template: "<div @click='clickEvent'>我是compA{{msg}}</div>",
                props: {
                    msg: {
                        type: String,
                        default: 'msg'
                    },
                    _after: {
                        type: String
                    }
                },
                data() {
                    return {
                        obj: { name: "ken" },
                        arr: [1, 2]
                    }
                },
                methods: {
                    clickEvent: function(e) {
                        this.$set(this.obj, 'sex', '男')
                        this.$set(this.arr, 2, 3)
                    },
                }
            }
            const vm = new Vue({
                el: "#app",
                components: {
                    "comp-a": compA
                },
                methods: {
                    hookUpdated() {
                        console.log("hookUpdated")
                    },
                    clickEvent(e) {
                        console.log("clickEvent")
                    }
                },
            })

            console.log("vm", vm)
    </script>
</body>

</html>
```

当我们给 obj,arr 新增属性，或者元素时，我们调试发现会进入以下代码：

- 先判断是否是 undefined, null, primitive value 
- 接着检测数组 如果对应地的 index 存在就直接赋值
- 接着检测对象 如果对应的 key 存在就直接返回
- 否则就是新增的 key,或者 index
- 需要对数据进行响应式定义
- 触发 dep 通知更新

```js
export function set(target: Array < any > | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

# $delete
- 先检测  undefined, null, or primitive value
- 接着检测数组 index 
- 接着检测对象 key
- 最后通知更新
```js
function del(target, key) {
    debugger
    if (
      (isUndef(target) || isPrimitive(target))
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }
```
