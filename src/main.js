import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/styles/index.less"
import "@/icons/index"
import SvgIcon from "@/components/SvgIcon"
import directives from '@/directives/index'
import "vant/es/toast/style"
const app = createApp(App)
app.component('SvgIcon',SvgIcon)
app.use(store).use(router).use(directives).mount('#app')
