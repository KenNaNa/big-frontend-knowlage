import { defineAsyncComponent } from "vue"
import ErrorComponent from './ErrorComponent.vue'
import LoadingComponent from './LoadingComponent.vue'
const v = 1 / 0
console.log(v)
    // with options
const AsyncComp = defineAsyncComponent({
    loader: () =>
        import ("./AsyncComponent.vue"),
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    delay: 200,
    timeout: 3000
})
export default AsyncComp