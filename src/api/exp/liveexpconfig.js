// 接口 体验课配置
// 1.获取所有的信息
import request from '@/utils/request'

export function getAllLiveExpConfig(query) {
  return request({
    url: '/admin/getCourseList', // 查询数据url
    // url:'course/find',
    method: 'get',
    params: query
  })
}

export function addliveexpform(data) { // 添加体验课
  console.log(data)
  return request({
    url: '/admin/addCourse',
    method: 'post',
    data
  })
}

export function updateliveexpform(data) { // 修改教材配置信息页面
  console.log(data)
  return request({
    url: '/admin/editCourse',
    // url:'/course/add',
    method: 'post',
    data
  })
}

export function setCourseStatus(data) { // 设置体验课状态
  return request({
    url: '/admin/setCourseStatus',
    method: 'post',
    data
  })
}

// 约课 接口  测试使用
export function addTestOrderRecode(data) {
  return request({
    url: '/admin/addTestOrderRecode',
    method: 'post',
    data
  })
}

// 获取试题列表
export function gettestlist(data) {
  console.log(data)
  return request({
    url: '/admin/getPlanTestList',
    method: 'get',
    params: { planId: data }
  })
}
