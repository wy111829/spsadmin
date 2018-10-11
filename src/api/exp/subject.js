import request from '@/utils/request'

export function getList() {
  return request({
    url: '/admin/getLearningModuleList',
    method: 'post',
    params: {},
    data: {}
  })
}

export function getModules(id) {
  return request({
    url: '/admin/learningModuleInfo',
    method: 'post',
    params: {},
    data: {
      id: id
    }
  })
}

export function addModule(data) {
  return request({
    url: '/admin/addLearningModule',
    method: 'post',
    params: {},
    data: data
  })
}

export function delModule(id) {
  return request({
    url: '/admin/delLearningModule',
    method: 'post',
    params: {},
    data: {
      id: id
    }
  })
}
