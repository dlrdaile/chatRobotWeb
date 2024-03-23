import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import LemonIMUI from 'lemon-imui';
import 'lemon-imui/dist/index.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import SocketService from '@/utils/socket_service'
import '@/permission' // permission control
Vue.use(ElementUI)
Vue.use(LemonIMUI);
Vue.config.productionTip = false
Vue.prototype.$echarts = window.echarts
Vue.prototype.$socket = SocketService.Instance
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
