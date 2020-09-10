// 用于全局注册的组件
import Vue from 'vue'
import HmHeader from '../components/HmHeader.vue'
import HmLogo from '../components/HmLogo.vue'
import HmNavitem from '../components/HmNavitem.vue'
import HmPost from '../components/HmPost.vue'
import HmComment from '../components/HmComment.vue'
import HmFloor from '../components/HmFloor.vue'

// 全局注册组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-navitem', HmNavitem)
Vue.component('hm-post', HmPost)
Vue.component('hm-comment', HmComment)
Vue.component('hm-floor', HmFloor)
