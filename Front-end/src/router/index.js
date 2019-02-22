import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

const _import = require(`@/utils/import-${process.env.NODE_ENV}`)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Layout',
      redirect: '/note-list',
      component: _import('layout/index'),
      children: [{
        path: '/note-list',
        name: 'Note List',
        component: _import('list/index')
      }, {
        path: '/add-note',
        name: 'New Note',
        component: _import('add/index')
      }, {
        path: '/delete-note',
        name: 'Note Del',
        component: _import('delete/index')
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('UPDATE_CURRENT_PAGE', 1)
  next()
})

export default router
