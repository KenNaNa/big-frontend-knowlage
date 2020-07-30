<template>
  <div class="father">
    <h3>父组件</h3>
    <!--第一次使用：用flex展示数据-->
    <child>
      <template v-slot="{obj}">
        <div class="tmpl">
            {{obj}}
        </div>
      </template>
    </child>

    <!--第二次使用：用列表展示数据-->
    <child>
      <template v-slot="res">
        <ul>
          <li :key="`key${index}`" v-for="(item, index) in res.data">{{item}}</li>
        </ul>
      </template>
    </child>

    <!--第三次使用：直接显示数据-->
    <child>
      <template v-slot="res">{{res.data}}</template>
    </child>

    <!--第四次使用：不使用其提供的数据, 作用域插槽退变成匿名插槽-->
    <child>模板</child>
  </div>
</template>
<script>
import child from "./Child";
export default {
  name: "slotScopes",
  components: {
    child
  }
};
</script>