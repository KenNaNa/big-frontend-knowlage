<template>
  <div class="slot-name">
    <ht>
      <template v-slot:[header]>
        <headl></headl>
      </template>

      <template v-slot:[body]>
        <fbody></fbody>
      </template>
      <template v-slot:[footer]>
        <foot></foot>
      </template>
    </ht>
  </div>
</template>

<script>
import ht from "./Ht";
import headl from "./Header";
import foot from "./Footer";
import fbody from "./Fbody";
export default {
  name: "slotName",
  components: {
    ht,
    headl,
    foot,
    fbody
  },
  data() {
    return {
      footer: 'footer',
      body: 'body',
      header: 'header'
    }
  },
};
</script>