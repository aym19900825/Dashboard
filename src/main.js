// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import $ from 'jquery'
import axios from 'axios'
import vueGridLayout from 'vue-grid-layout';
//引用vue-color中的某一个组件
import { Photoshop } from 'vue-color'
import VueClipboard from 'vue-clipboard2'


Vue.config.productionTip = false
Vue.prototype.$echarts = echarts 
Vue.prototype.$axios= axios
Vue.use(ElementUI)
Vue.use(vueGridLayout)
Vue.use(VueClipboard)

// axios.defaults.headers.post['Content-Type'] = 'application/json';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { 
  	App ,
  	'photoshop-picker': Photoshop
  },
  template: '<App/>'
})
