// 引入vue 引入根组件 引入路由
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局css
import './styles/bess.less'
import './styles/iconfont.css'
// 引入全局的vant组件
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
// 隐藏vue默认提示信息
Vue.config.productionTip = false

new Vue({
  // 把路由挂载到组件上
  router,
  // 渲染App.vue作为根组件
  render: h => h(App)
}).$mount('#app')
