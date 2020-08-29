<template>
  <div id="example-2" v-drag>
    <button @click="show = !show">Toggle show</button>
    <transition name="bounce">
      <p v-if="show">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis
        enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi
        tristique senectus et netus.
      </p>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    let show = ref(true);
    return {
      show
    };
  }
};
</script>

<style lang="scss" scoped>
#example-2 {
    position: relative;
    background-color: #14bd2a;
    width: 500px;
    height: 200px;
    p {
        color: #fff;
    }
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>