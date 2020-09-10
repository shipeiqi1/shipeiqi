// 引入vue 引入根组件 引入路由
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局css通用样式
import './styles/bess.less'
import './styles/iconfont.css'

// 引入全局的rem插件
import 'amfe-flexible'

// 全局注册组件
import './utils/global'
// 全局配置axios请求
import './utils/request'
// 全局注册过滤器
import './utils/filters'
// 全局导入Vant
import './utils/vant'

// 隐藏vue默认提示信息
Vue.config.productionTip = false

// 创建了一个bus
const bus = new Vue()
// 把bus挂载挂载到原型上
Vue.prototype.$bus = bus

new Vue({
  // 把路由挂载到组件上
  router,
  // 渲染App.vue作为根组件
  render: h => h(App)
}).$mount('#app')
