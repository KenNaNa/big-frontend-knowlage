<template>
  <vuedraggable class="wrapper" v-model="list">
    <template name="header">
      <div>头部</div>
    </template>
    <transition-group>
      <div v-for="item in list" :key="item" class="item">
        <p>{{item}}</p>
      </div>
    </transition-group>
    <template name="footer">
      <div>尾部</div>
    </template>
  </vuedraggable>
</template>

<script>
import { ref } from "vue";
import { onUpdated } from "vue";
export default {
  name: "draggable",
  setup() {
    let list = ref(["Ken", "公众号-前端小Ken", "杨过", "小龙女"]);
    onUpdated(() => {
      console.log(list);
    });
    return {
      list
    };
  }
};
</script>
<style scoped>
.wrapper {
  margin: auto;
}
.item {
  width: 300px;
  height: 50px;
  background-color: #42b983;
  color: #ffffff;
}
</style>