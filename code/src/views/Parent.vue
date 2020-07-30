<template>
  <div class="parent">
    <h1>父级元素</h1>
    <slots>
      <p>插槽内容1</p>
      <p>插槽内容2</p>
    </slots>
  </div>
</template>

<script>
import slots from "./Slots";
export default {
  name: "parent",
  components: {
    slots
  }
};
</script>