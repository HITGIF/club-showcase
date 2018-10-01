import Vue from 'vue'
import Router from 'vue-router'
import Club from '../components'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [{
    path: '/',
    name: 'feed',
    component: Club
  }, {
    path: '/by/:author',
    name: 'author',
    props: true,
    component: Club
  }, {
    path: '/read/:post',
    name: 'post',
    props: true,
    component: Club
  }]
})
