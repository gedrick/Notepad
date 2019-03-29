import Vue from 'vue'
import Router from 'vue-router'
import Notepad from './views/Notepad.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/notepad',
      name: 'notepad',
      component: Notepad,
    },
  ],
})
