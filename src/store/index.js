import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import api_key_valid from "@/store/modules/api_key_valid";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        api_key_valid
    },
    getters
})

export default store

