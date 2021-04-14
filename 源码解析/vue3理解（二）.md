ref

ref跟reactive一样，也是用来实现响应式数据的方法，因为reactive必须传一个对象，但是有时候我们只想某个变量实现响应式，就有了ref

本质：

    ref的底层其实就是reactive，系统其实自动把我们传入的ref(xx)变成了reactive({value: xx})
    
注意点：

在vue template中ref的值不用通过value值来获取，但是在js中必须通过value值来获取


shallowReactive 

reactive是递归监听，层级多的时候会影响性能  这时候可以使用shallowReactive，shallowReactive 只监听第一层的变化

```html
<template>
  <ul>
    <li>{{state.a}}</li>
    <li>{{state.gf.b}}</li>
    <li>{{state.gf.f.c}}</li>
    <li>{{state.gf.f.s.d}}</li>
  </ul>
  <button @click="onClick">点击我</button>
</template>

<script lang="ts">
import {shallowReactive} from 'vue'
export default {
  setup() {
    const state = shallowReactive({
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
    })
    function onClick() {
      state.a = '1'
      state.gf.b = '2'
      state.gf.f.c = '3'
      state.gf.f.s.d = '4'
      console.log(state);
      console.log(state.gf);
      console.log(state.gf.f)
    }
    return {
      state,
      onClick
    }
  }

}
</script>
```


shallowRef

shallowRef监听的是.value的变化，不是第一层

```html
<template>
  <ul>
    <li>{{state.a}}</li>
    <li>{{state.gf.b}}</li>
    <li>{{state.gf.f.c}}</li>
    <li>{{state.gf.f.s.d}}</li>
  </ul>
  <button @click="onClick">点击我</button>
</template>

<script lang="ts">
import {shallowRef} from 'vue'
export default {
  setup() {
    const state = shallowRef({
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
    })
    function onClick() {
      state.value.a = '1'
      state.value.gf.b = '2'
      state.value.gf.f.c = '3'
      state.value.gf.f.s.d = '4'
      console.log(state);
      console.log(state.value.gf);
      console.log(state.value.gf.f)
    }
    return {
      state,
      onClick
    }
  }

}
</script>
```

点击按钮，界面值根本不会变化


更改value的话就可以

```html
<template>
  <ul>
    <li>{{state.a}}</li>
    <li>{{state.gf.b}}</li>
    <li>{{state.gf.f.c}}</li>
    <li>{{state.gf.f.s.d}}</li>
  </ul>
  <button @click="onClick">点击我</button>
</template>

<script lang="ts">
import {shallowRef} from 'vue'
export default {
  setup() {
    const state = shallowRef({
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
    })
    function onClick() {
      state.value = {
        a: '1',
        gf: {
          b: '2',
          f: {
            c: '3',
            s: {
              d: '4'
            }
          }
        }
      }
      console.log(state);
      console.log(state.value.gf);
      console.log(state.value.gf.f)
    }
    return {
      state,
      onClick
    }
  }

}
</script>
```
只需要改其中一个的时候

```js
<template>
  <ul>
    <li>{{state.a}}</li>
    <li>{{state.gf.b}}</li>
    <li>{{state.gf.f.c}}</li>
    <li>{{state.gf.f.s.d}}</li>
  </ul>
  <button @click="onClick">点击我</button>
</template>

<script lang="ts">
import {shallowRef, triggerRef} from 'vue'
export default {
  setup() {
    const state = shallowRef({
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
    })
    function onClick() {
      // state.value = {
      //   a: '1',
      //   gf: {
      //     b: '2',
      //     f: {
      //       c: '3',
      //       s: {
      //         d: '4'
      //       }
      //     }
      //   }
      // }
      state.value.gf.f.s.d = '4'
      triggerRef(state)
      console.log(state);
      console.log(state.value.gf);
      console.log(state.value.gf.f)
    }
    return {
      state,
      onClick
    }
  }

}
</script>
```





