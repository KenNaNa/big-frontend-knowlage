<template>
  <div class="global-api">
    <k-clip-board copyUrl="青山绿水等着我，包都买好了，就等一个时机了"></k-clip-board>
    <div class="drag" v-drag></div>
  </div>
</template>

<script>
export default {
  name: "globalApi",
  setup() {}
};
</script>
<style lang="scss" scoped>
.drag {
    position: relative;
    height: 50px;
    width: 50px;
    background-color: #21c573;
}
</style>