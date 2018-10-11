import request from '@/utils/request'

export function getDictionary() {
  return request({
    url: '/admin/getTeachingConfigInfo',
    method: 'post',
    params: {},
    data: {}
  })
}

export function getOrder(userId) {
  return request({
    url: '/admin/getOrderRecode',
    method: 'post',
    params: {},
    data: {
      userId: userId
    }
  })
}
