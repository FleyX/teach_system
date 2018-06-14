// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
//全局注册组件
import Editor from './components/common/Editor'
import ShowText from './components/common/ShowText'
import Breadcrumb from './components/common/Breadcrumb'
Vue.component('Editor',Editor);
Vue.component('ShowText',ShowText);
Vue.component('Breadcrumb',Breadcrumb);

Object.defineProperty(Vue.prototype,'$moment',{value:moment});
Vue.config.productionTip = false
Vue.use(ElementUI);

window.bus = new Vue();

window.vm = new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
console.log('vue示例构建完毕');
