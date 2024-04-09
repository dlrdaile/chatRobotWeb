import axios from 'axios'
import {MessageBox, Message} from 'element-ui'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // baseURL: "http://chatrobotback.cpolar.top/api", // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if ((res.code - 200) >= 100) {
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 401) {
                // to re-login
                MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res
        }
    },
    error => {
        Message({
            message: error.response?.data.msg || 'default error',
            type: 'error',
            duration: 5 * 1000
        })
        if (error.response?.data.code === 401) {
            // to re-login
            console.log(123)
            MessageBox.confirm('你的token过期啦，请刷新页面重新登录', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('user/resetToken').then(() => {
                    location.reload()
                })
            })
        }
        return Promise.reject(error)
    }
)
export default service