import { createApp } from 'vue';
import vuedraggable from "vuedraggable";
import App from './App.vue'
import router from './router'
import store from './store'
import kClipBoard from './views/ClipBoard.vue'
import drag from './drag'
const app = createApp(App)
app.component('k-clip-board', kClipBoard)
app.directive('drag', drag)

app.use(vuedraggable).use(router).use(store).mount('#app')