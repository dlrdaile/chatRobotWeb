import request from '@/utils/request'

export function validateApiKey(data) {
    return request({
        url: '/apiKey/validate',
        method: 'post',
        data
    })
}