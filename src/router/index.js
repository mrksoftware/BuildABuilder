import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/Home'
import Info from '@/components/Info/Info'
import Setting from '@/components/Settings/Setting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/info',
      name: 'Info',
      component: Info
    },
    {
      path: '/settings',
      name: 'Setting',
      component: Setting
    }
  ],
  mode: 'history'
})
