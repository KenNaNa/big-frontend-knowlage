<template> 
  <div
    @dragstart.stop="dragstart" 
    @dragenter.stop="dragenter" 
    @dragend.stop="drop" 
    draggable="true" 
    class="ken-item__drag"
  >
    <slot />
  </div>
</template>

<script>
import EventEmitter from "./utils/mixins/emitter";

export default {
  name: "kDragItem",
  mixins: [EventEmitter],
  mounted() {
    this.dispatch("KDragWrapper", "get-childs", this.$el);
  },
  methods: {
    dragstart() {
      this.dispatch("kDragWrapper", "on-drag-start", this.$el); // 触发 on-drag-start
    },
    dragenter() {
      this.dispatch("kDragWrapper", "on-drag-enter", this.$el);  // 触发 on-drag-enter
    },
    drop() {
      this.dispatch("kDragWrapper", "on-drop");  // 触发 on-drop
    }
  }
};
</script>

<style lang="scss" scoped>
.ken-item__drag {
  background-color: #007fff;
  color: #ffffff;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
}
</style>

