<template>
<button @click="click">toast</button>
</template>

<script>
import {
    getCurrentInstance
} from 'vue'
export default {
    name: "TestToast",
    setup() {
        let {
            ctx
        } = getCurrentInstance()
        let click = () => {
            ctx.$toast("Hello Toast")
        }

        return {
            click
        }
    }
};
</script>
