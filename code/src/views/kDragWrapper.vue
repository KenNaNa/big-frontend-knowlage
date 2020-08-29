<template>
  <div ref="kDragWrapper" @dragenter.prevent @dragover.prevent>
    <slot />
  </div>
</template>

<script>
export default {
  name: "kDragWrapper",
  props: {
    realDatas: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      toEl: "",
      fromEl: "",
      children: []
    };
  },
  created() {
    this.toEl = "";
    this.fromEl = "";
    this.children = [];
    console.log("this.$on", this)
    this.$on("on-drag-start", this.onDragStart);
    this.$on("ondrag-enter", this.onDragEnter);
    this.$on("on-drop", this.onDrop);
    this.$on("get-child", child => {
      this.children.push(child);
    });
    
  },
  methods: {
    onDragStart(el) {
      this.fromEl = el;
    },
    onDragEnter(el) {
      this.toEl = el;
      if (this.fromEl === this.toEl) {
        return;
      }
      if (this.isPrevNode(this.fromEl, this.toEl)) {
        this.$refs["kDragWrapper"].insertBefore(this.fromEl, this.toEl);
      } else {
        this.$refs["kDragWrapper"].insertBefore(
          this.fromEl,
          this.toEl.nextSibling
        );
      }
    },
    onDrop() {
      if (!this.realDatas.length) return;
      const realElementOrders = [...this.$el.children].filter(child =>
        child.classList.contains("ken-item__drag")
      );
      this.getNewDatas(realElementOrders, this.children);
    },
    isPrevElement(fromEl, toEl) {
      while (fromEl.previousSibling !== null) {
        if (fromEl.previousSibling === toEl) {
          return true;
        }
        fromEl = fromEl.previousSibling;
      }
    },
    getNewDatas(realDatas, dragAfterDatas) {
      const orders = realDatas.map(realData => {
        return dragAfterDatas.findIndex(
          dragAfterData => realData === dragAfterData
        );
      });
      const newDatas = [];
      orders.map((order, i) => {
        newDatas[i] = this.data[order];
      });
      this.$emit("get-new-datas", newDatas);
    }
  }
};
</script>