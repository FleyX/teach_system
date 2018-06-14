import Vue from 'vue'
import Router from 'vue-router'
import Public from './public'
import Admin from './admin'
import Client from './client'
import NotFound from '@/components/public/404'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/app/',
  routes: [
    Admin,
    Client,
    Public,
    {
      path: '*',
      name: "NotFound",
      component: NotFound
    }
  ]
})
