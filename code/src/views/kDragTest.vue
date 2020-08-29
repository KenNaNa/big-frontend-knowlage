<template>
  <k-drag-wrapper class="wrap" :data="list" @get-new-datas="getNewDatas">
    <k-drag-item class="item" v-for="(item, index) in list" :key="index">
      <div>{{item}}</div>
    </k-drag-item>
  </k-drag-wrapper>
</template>

<script>
import kDragWrapper from "./kDragWrapper";
import kDragItem from "./kDragItem";
export default {
  name: "kDragTest",
  components: {
    kDragWrapper,
    kDragItem
  },
  data() {
    return {
      list: ['Ken', "前端小Ken", "志学python", "杨过", "小龙女", "我爱的人", "程序员只有电脑"]
    };
  },
  methods: {
    getNewDatas(newDatas) {
      console.log("newDatas", newDatas);
    }
  }
};
</script>
