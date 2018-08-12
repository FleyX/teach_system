import Vue from 'vue'
import Router from 'vue-router'
import Public from './public'
import Admin from './admin'
import Client from './client'
import NotFound from '@/components/public/404'
import About from '@/components/public/About'
import IndexPage from '@/components/public/Index'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/app/',
  routes: [{
    path: '',
    name: 'indexPage',
    component: IndexPage
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
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
