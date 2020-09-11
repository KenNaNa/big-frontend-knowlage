<template>
<transition name="alert-fade">
    <div id="toast" v-show="visible" class="dialog-tips dialog-center">{{message}}</div>
</transition>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            message: ""
        };
    }
};
</script>

<style lang="scss" scoped>
.alert-fade-enter-active,
.alert-fade-leave-active {
    transition: opacity 0.3s;
}

.alert-fade-enter,
.alert-fade-leave-to {
    opacity: 0;
}

.dialog-tips {
    position: fixed;
    z-index: 100;
    min-width: 100px;
    padding: 15px;
    line-height: 15px;
    border-radius: 15px;
    white-space: nowrap;
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 8px 8px 8px 1 rgba(0, 0, 0, 0.8);
    text-align: center;
    color: #fff;
    font-size: 15px;
}

.dialog-center {
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
