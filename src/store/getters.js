const getters = {
    api_key_valid: state => state.api_key_valid.api_key_valid,
    api_key: state => state.api_key_valid.api_key,
    client_id: state => state.api_key_valid.client_id,
    llm_model: state => state.api_key_valid.llm_model,
    llm_platform: state => state.api_key_valid.llm_platform,

}

export default getters