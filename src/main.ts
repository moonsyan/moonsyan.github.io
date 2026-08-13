import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerGlobals } from './registerGlobals'
import 'element-plus/dist/index.css'
import './styles/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
registerGlobals(app)

app.mount('#app')
