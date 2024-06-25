import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/modules/pinia-instance'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { authService } from '@/modules/auth-service'

const app = createApp(App)

app.use(pinia)

app.config.globalProperties.$auth = authService

authService.checkAuth()

app.use(router)
app.use(autoAnimatePlugin)

app.mount('#app')