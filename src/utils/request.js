import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 304) {
      if (response.data !== undefined && response.data.stat !== undefined) {
        if (response.data.stat === 0) {
          Message({
            message: response.data,
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject(response.data)
        } else {
          return response.data
        }
      } else {
        return response
      }
    } else {
      return Promise.reject({
        code: response.status,
        msg: response.statusText,
        data: {}
      })
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
