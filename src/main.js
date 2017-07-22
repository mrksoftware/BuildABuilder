// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueClipboard from 'vue-clipboard2'
import App from './App'
import router from './router'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
