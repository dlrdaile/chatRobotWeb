import request from '@/utils/request'

export function validateApiKey(data) {
    return request({
        url: '/apiKey/validate',
        method: 'post',
        data
    })
}

export function defaultValidateApiKey(client_id) {
    return request({
        url: `/apiKey/default_validate/${client_id}`,
        method: 'post',
    })
}