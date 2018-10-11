import remoteObj from './httpUtil'
import address from './urlStore'

export { address }
export { remoteObj }
/**
 * 用户画像查询表单提交
 * @param {*} url
 * @param {*} param
 */
export const submitProfileQuery = (url, param) => {
  return remoteObj.post(url, param)
}
/**
 * 用户画像查询页面初始化
 * @param {请求uri} url
 */
export const initProfileData = url => {
  return remoteObj.get(url)
}
/**
 * 用户画像查询下拉菜单数据加载
 * @param {*} url
 */
export const getProfileOptionData = url => {
  return remoteObj.get(url)
}

/**
 * 登录
 * @param {*} param0
 */
export const login = (url, { loginUser, loginPassword }) => {
  return remoteObj.post(url, {
    username: loginUser,
    password: loginPassword
  })
}
/**
 * 获得用户信息
 */
export const getUserInfo = (url) => {
  return remoteObj.get(url)
}
/**
   * 退出登录
   * @param {*} url
   */
export const logout = url => {
  return remoteObj.get(url)
}
/**
   * 获取用户画像查询用户信息
   * @param {*} url
   */
export const getQueryUserInfo = (url, param) => {
  return remoteObj.post(url, param)
}
/**
   * 获取决策树信息(销转)
   * @param {*} url
   */
export const getDecisiontreeInfo = (url, param) => {
  return remoteObj.post(url, param)
}
/**
   * 获取决策树信息(续报)
   * @param {*} url
   */
export const getDecisiontreeXubaoInfo = (url, param) => {
  return remoteObj.post(url, param)
}
