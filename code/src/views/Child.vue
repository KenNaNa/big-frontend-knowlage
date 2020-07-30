<template>
  <div class="child">
    <h3>子组件</h3>
    <slot :data="data" :obj="obj"></slot>
  </div>
</template>
<script>
export default {
  name: "child",
  data: function() {
    return {
      data: ["Ken", "志学Python", "小龙女", "杨过"],
      obj: {
          name: 'Ken'
      }
    };
  }
};
</script>

