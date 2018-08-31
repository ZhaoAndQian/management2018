import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import { apiType, baseUrl, cookieAuth, getCookie } from '../static/js/common.js'

Vue.config.productionTip = false
Vue.use(ElementUI)
// 请求地址类型 {0 后台数据接口，1 百度服务接口}
axios.prototype.apiType = apiType.server
Vue.prototype.axios = axios
axios.interceptors.request.use((config) => {
  if (axios.apiType === apiType.server || axios.apiType === undefined) {
    config.headers = {'Authorization': getCookie(cookieAuth)}
    config.url = baseUrl + config.url
  }
  return config
}, (error) => {
  ElementUI.Message.error('地址：' + error.config.url + '请求失败')
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    ElementUI.Message({ message: '登录验证失败', type: 'error' })
    router.push({name: 'Login'})
  } else {
    ElementUI.Message({ message: '数据接口请求失败：' + error, type: 'error' })
  }
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
