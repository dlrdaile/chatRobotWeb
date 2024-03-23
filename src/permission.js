import router from './router'
import store from './store'
import {Message} from 'element-ui'
// import 'nprogress/nprogress.css' // progress bar style


const whiteList = ['/login',] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar


    // determine whether the user has logged in
    const api_key_valid = store.getters.api_key_valid
    console.log(api_key_valid)
    if (api_key_valid) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({path: '/chat'})
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            next()
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    // finish progress bar
})
