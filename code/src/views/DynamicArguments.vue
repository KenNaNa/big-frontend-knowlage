<template>
<div class="dynamic-arguments">
    <!-- <h2>
        模板插值
        <br />
        <input v-model="msg" type="text" />
        <br />
        {{msg}}
    </h2>
    <h2>
        JavaScript 表达式
        <br />
        字符串 split 操作：{{msg.split('，')[0]}}
        <br />
        数值计算：{{num+1}}
        <br />
        数组操作：{{arr[0]}}
    </h2>

    <h2>
        v-bind: 绑定属性
        <br />
        <a v-bind:href="a">ken.com</a>
    </h2>

    <h2>
        v-bind: 绑定属性变量
        <br />
        <a v-bind:[urlKey]="a">ken.com</a>
    </h2>

    <h2>
        v-bind: 简写模式
        <br />
        <a :[urlKey]="a">aaa.com</a>
    </h2>

    <h2>
        v-on:[handlerEventName] 绑定事件名变量
        <br />
        <button v-on:click="increment">{{num}}</button>
    </h2>

    <h2>
        v-on:[handlerEventName] 绑定事件名变量
        <br />
        <button v-on:[clickEventName]="increment">{{num}}</button>
    </h2>
    -->
    <h2>
        v-on:[handlerEventName] 简写模式
        <br />
        <button @[clickEventName]="increment">{{num}}</button>
    </h2>
</div>
</template>

<script>
    import {
        ref
    } from "vue";
    /*
                <h2>
                        JavaScript 表达式
                        <br />
                        字符串 split 操作：{{msg.split('，')}}
                        <br />
                        数值计算：{{num+1}}
                        <br />
                        数组操作：{{arr[0]}}
                    </h2>
                    <h2>
                        v-bind: 绑定属性
                        <br />
                        <a v-bind:href="a">aaa.com</a>
                    </h2>
                    <h2>
                        v-bind: 绑定属性变量
                        <br />
                        <a v-bind:[urlKey]="a">aaa.com</a>
                    </h2>
                    <h2>
                        v-bind: 简写模式
                        <br />
                        <a :[urlKey]="a">aaa.com</a>
                    </h2>
                    <h2>
                        v-on:[handlerEventName] 绑定事件名变量
                        <br />
                        <button v-on:click="increment">{{num}}</button>
                    </h2>
                    <h2>
                        v-on:[handlerEventName] 绑定事件名变量
                        <br />
                        <button v-on:[clickEventName]="increment">{{num}}</button>
                    </h2>
                    <h2>
                        v-on:[handlerEventName] 简写模式
                        <br />
                        <button @[clickEventName]="increment">{{num}}</button>
                    </h2>
                    <h2>
                        v-slot:[slotName] 具名插槽
                        <parent>
                            <template v-slot:child>
                                <child></child>
                            </template>
                        </parent>
                    </h2>
                    <h2>
                        v-slot:[slotName] 具名插槽
                        <parent>
                            <template v-slot:[child]>
                                <child></child>
                            </template>
                        </parent>
                    </h2>
                    <h2>
                        #[slotName] 简写模式
                        <parent>
                            <template v-slot:[child]>
                                <child></child>
                            
</template>

        </parent>
    </h2>
*/

// import parent from "./bbb";
// import child from "./aaa";
export default {
  name: "DynamicArguments",
  components: {
    // parent,
    // child
  },
  setup() {
    let msg = ref("绿水青山等着我，旅行包都买好了，就差一个时机了");
    let num = ref(0);
    let arr = ref(["ken", "公众号-前端小Ken", "志学Python"]);
    let a = ref("aaa.com");
    let urlKey = ref("href");
    let child = ref("child");
    let clickEventName = ref("click");
    let key1 = ref("nam");
    let key2 = ref("e");
    const increment = () => {
      num.value++;
    };
    return {
      msg,
      num,
      arr,
      a,
      urlKey,
      clickEventName,
      child,
      key1,
      key2,
      increment
    };
  }
};
</script>
