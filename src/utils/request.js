// 处理axios发送请求
import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import { Toast } from 'vant'

// 把axios挂载到vue的原型
Vue.prototype.$axios = axios
// 给axios配置默认的baseURL,基准地址
const URL = 'http://localhost:3000'
axios.defaults.baseURL = URL
Vue.prototype.$base = URL
// 给axios配置拦截器
axios.interceptors.request.use(function(config) {
  // console.log('拦截到了请求', config)
  // config指的是请求的配置信息
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})
axios.interceptors.response.use(function(response) {
  // console.log('拦截到了响应', response)
  // console.log(response.data)
  // 解构响应的数据
  const { statusCode, message } = response.data
  // 进行判断
  if (statusCode === 401 && message === '用户信息验证失败') {
    // 说明没有token,或者token失效
    // 第一步跳转回登录页
    router.push('/login')
    // 第二步删除本地token和id
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    // 第三步提示用户
    Toast.fail(message)
  }
  return response
})

// 效验解析网路和本地图片
Vue.prototype.$url = function(url) {
  if (url.startsWith('http')) {
    // 网络图片
    return url
  } else {
    return URL + url
  }
}
