import request from '@/utils/request'

export function getList() {
  return request({
    url: '/admin/feedbackConfigList',
    method: 'post',
    params: {},
    data: {}
  })
}

export function getInfo(id) {
  return request({
    url: '/admin/feedbackConfigInfo',
    method: 'post',
    params: {},
    data: {
      subjectId: id
    }
  })
}

export function editInfo(data) {
  return request({
    url: '/admin/addFeedbackConfig',
    method: 'post',
    params: {},
    data: data
  })
}
