import request from '@/utils/request'

export function getDictionary() {
  return request({
    url: '/admin/getTeachingConfigInfo',
    method: 'post',
    params: {},
    data: {}
  })
}

export function getList(query) {
  return request({
    url: '/admin/getTeachingConfigList',
    method: 'post',
    params: {},
    data: query
  })
}

export function getDetail(id) {
  return request({
    url: '/admin/updateTeachingConfigInfo',
    method: 'post',
    params: {},
    data: {
      id: id
    }
  })
}

export function addDetail(data) {
  return request({
    url: '/admin/addTeachingConfig',
    method: 'post',
    params: {},
    data: data
  })
}

export function editDetail(data) {
  return request({
    url: '/admin/updateTeachingConfig',
    method: 'post',
    params: {},
    data: data
  })
}

export function delDetail(id) {
  return request({
    url: '/admin/delTeachingConfig',
    method: 'post',
    params: {},
    data: {
      id: id
    }
  })
}
