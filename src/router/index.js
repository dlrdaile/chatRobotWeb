import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "about" */ '@/views/Login.vue')
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import(/* webpackChunkName: "about" */ '@/views/RobotChatView.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
