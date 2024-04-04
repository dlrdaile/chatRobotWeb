import {validateApiKey} from '@/api/api_key_valid'
import {MessageBox, Message} from 'element-ui'
import utilFunction from "@/utils";

const state = {
    api_key_valid: false,
    api_key: '',
    client_id: utilFunction.generateRandId(),
    llm_model: '',
    llm_platform: '',
}

const mutations = {
    SET_API_KEY_VALID: (state, api_key_valid) => {
        state.api_key_valid = api_key_valid
    },
    SET_API_KEY: (state, api_key) => {
        state.api_key = api_key
    },
    SET_CLIENT_ID: (state, client_id) => {
        state.client_id = client_id
    },
    SET_LLM_MODEL: (state, llm_model) => {
        state.llm_model = llm_model
    },
    SET_LLM_PLATFORM: (state, llm_platform) => {
        state.llm_platform = llm_platform
    },
}

const actions = {
    validateApiKey({commit}, data) {
        return new Promise((resolve, reject) => {
            validateApiKey(data).then(response => {
                const {data} = response
                commit('SET_API_KEY_VALID', true)
                commit('SET_API_KEY', data.api_key)
                commit('SET_CLIENT_ID', data.client_id)
                commit('SET_LLM_MODEL', data.llm_model)
                commit('SET_LLM_PLATFORM', data.llm_platform)
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