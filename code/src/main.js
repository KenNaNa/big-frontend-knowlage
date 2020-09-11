import { createApp } from 'vue';
import vuedraggable from "vuedraggable";
import App from './App.vue'
import router from './router'
import store from './store'
import kClipBoard from './views/ClipBoard.vue'
import drag from './drag'
import AsyncComp from './views/AsyncComp.js'
const app = createApp(App)
app.component('k-clip-board', kClipBoard)
app.component('async-comp', AsyncComp)
app.directive('drag', drag)
import { Promised } from 'vue-promised'
import Toast from './components/src/'
app.use(Toast)
app.component('Promised', Promised)
app.use(vuedraggable).use(router).use(store).mount('#app')