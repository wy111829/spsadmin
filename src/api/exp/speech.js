// 接口 话术配置
// 1.获取所有的信息
import request from '@/utils/request'

export function getCourseWordList(query) {
  return request({
    url: '/admin/getCourseWordList', // 查询数据url
    // url:'course/find',
    method: 'get',
    params: query
  })
}
export function getCommentInfo(query) {
  return request({
    url: 'admin/getCommentInfo',
    method: 'get',
    params: query
  })
}

export function addCommentInfo(data) {
  return request({
    url: '/admin/addCommentInfo',
    method: 'post',
    data
  })
}

export function getKnowledgeInfo(query) {
  return request({
    url: '/admin/knowledgeInfo',
    method: 'get',
    params: query
  })
}

export function addKnowledgeInfo(data) {
  return request({
    url: 'admin/addKnowledgeInfo',
    method: 'post',
    data
  })
}

