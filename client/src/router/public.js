import Public from '@/components/public/Main'
import Login from '@/components/public/Login'
import ResetPass from '@/components/public/ResetPass'
import About from '@/components/public/About'

export default {
  path: '/public',
  component: Public,
  children: [{
    path: 'admin_login',
    component: Login
  },{
    path:'client_login',
    component:Login
  }, {
    path: "admin_login/reset_pass",
    component: ResetPass
  }, {
    path: "client_login/reset_pass",
    component: ResetPass
  }
]
}
