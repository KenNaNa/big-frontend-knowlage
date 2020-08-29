<template>
  <div class="parent">
    <h1>父级元素</h1>
    <slot name="child"></slot>
  </div>
</template>

<script>
export default {
  name: "parent",
};
</script>