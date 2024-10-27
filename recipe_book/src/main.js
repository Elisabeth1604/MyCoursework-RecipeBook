import { createApp } from 'vue'
import App from './App.vue'
import '../src/assets/css/style.css'
import router from './router/router'
import store from './store/store'

createApp(App).use(store).use(router).mount('#app')
