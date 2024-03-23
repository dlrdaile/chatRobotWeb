import {validateApiKey} from '@/api/api_key_valid'
import {MessageBox, Message} from 'element-ui'

const state = {
    api_key_valid: false,
    api_key: ''
}

const mutations = {
    SET_API_KEY_VALID: (state, api_key_valid) => {
        state.api_key_valid = api_key_valid
    },
    SET_API_KEY: (state, api_key) => {
        state.api_key = api_key
    }
}

const actions = {
    validateApiKey({commit}, data) {
        return new Promise((resolve, reject) => {
            validateApiKey(data).then(response => {
                const {data} = response
                commit('SET_API_KEY_VALID', data.valid)
                if (data.valid) {
                    commit('SET_API_KEY', data.api_key)
                }
                resolve()
            }).catch(error => {
                Message({
                    message: "api key validation failed",
                    type: 'error',
                    duration: 5 * 1000
                });
                commit('SET_API_KEY_VALID', false)
                commit('SET_API_KEY', '')
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}