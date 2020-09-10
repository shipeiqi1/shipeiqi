import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import User from '../views/user/User.vue'
import UserEdit from '../views/user/UserEdit.vue'
import MyFillow from '../views/user/MyFillow.vue'
import MyComment from '../views/user/MyComment.vue'
import MyStar from '../views/user/MyStar.vue'
import Index from '../views/news/Index.vue'
import ManAge from '../views/news/Manage.vue'
import PostDetail from '../views/news/PostDetail.vue'
import Search from '../views/news/Search.vue'
Vue.use(VueRouter)

// 全局的把push的异常给处理了
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // 指定的每一个路由规则都可以提供一个name属性
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User },
  { path: '/user-edit', component: UserEdit },
  { path: '/my-fillow', component: MyFillow },
  { path: '/my-comment', component: MyComment },
  { path: '/my-star', component: MyStar },
  { path: '/', component: Index, name: 'index' },
  { path: '/manage', component: ManAge },
  { path: '/post-detail/:id', component: PostDetail },
  { path: '/search', component: Search }
]

const router = new VueRouter({
  routes
})

// 配置去哪句的导航守卫
/**
 to：到哪去
 from：从哪来
 next：函数，代表是否放行
 逻辑：判断是不是去用户中心
 否：放行
 是：判断是否带有token
   有：放行
   没有：跳转到登录页
 */

router.beforeEach(function(to, from, next) {
  /**
   只要路由发生跳转,跳转之前这个函数就执行
   */
  // console.log('前置守卫执行了')
  // console.log('to', to)
  // console.log('from', from)
  const token = localStorage.getItem('token')
  const authUrls = ['/user', '/user-edit', '/my-fillow', '/mycomment']
  if (!authUrls.includes(to.path) || token) {
    next()
  } else {
    router.push('/login')
  }
  // const token = localStorage.getItem('token')
  // if (to.path !== '/user' || token) {
  //   next()
  // } else {
  //   router.push('/login')
  // }
})
export default router
