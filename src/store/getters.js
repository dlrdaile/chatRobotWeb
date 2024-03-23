const getters = {
    api_key_valid: state => state.api_key_valid.api_key_valid,
    api_key: state => state.api_key_valid.api_key
}

export default getters