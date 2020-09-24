<template>
    <div class="test-counter">
        <Counter />
    </div>
</template>

<script>
import Counter from '../components/Counter'
import {defineComponent} from 'vue'
export default defineComponent({
    name: 'TestCounter',
    components: {
        Counter
    }
})
</script>