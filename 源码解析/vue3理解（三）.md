vue3的响应式本质

  vue2.x中是通过defineProperty来实现响应式数据的
  
  在vue3.x中是通过proxy来实现响应式数据的

手写shallowReactive shallowRef

```js
function shallowReactive(obj) {
    return new Proxy(obj, {
        get(obj, key) {
            return obj[key]
        },
        set(obj, key, val) {
            obj[key] = val
            console.log('界面UI更新');
            return true
        }
    })
}

let obj = {
    a: 'a',
    gf: {
      b: 'b',
      f: {
        c: 'c',
        s: {
          d: 'd'
        }
      }
    }
}

let state = shallowReactive(obj)
state.a = 1
state.gf.b = 2
state.gf.f.c = 3
```



运行结果如下，完美收实现

```js
function shallowRef(val) {
    return shallowReactive({value: val})
}
let state = shallowRef(obj)
console.log(state.value);
state.value.a = 1
state.value.gf.b = 2
state.value.gf.f.c = 3

state.value = {
    a: 1,
    gf: {
      b: 2,
      f: {
        c: 3,
        s: {
          d: 4
        }
      }
    }
}
console.log(state.value);
```
