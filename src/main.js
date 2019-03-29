import Vue from 'vue'
import './plugins/vuetify'
import Notepad from './views/Notepad.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Notepad),
}).$mount('#app')
