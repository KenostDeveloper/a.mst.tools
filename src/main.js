import { createApp } from 'vue'
import VueCookies from 'vue-cookies'

//Тут все общие вещи
import './assets/styles/style.scss'

//Тут шрифты
import './assets/styles/fonts.css'

//Тут адаптив
import './assets/styles/mobile.css'

import router from './router'
import store from './store'
import App from './App.vue'

const app = createApp(App)

app
.use(store)
.use(router)
.use(VueCookies, { expires: '7d' })
.mount('#app')