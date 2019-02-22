import Vue from 'vue'
import Vuex from 'vuex'
import VuePersistence from 'vuex-persist'
import list from './modules/list'
import pagination from './modules/pagination'

Vue.use(Vuex)

const vuexLocal = new VuePersistence(({
  storage: window.localStorage
}))

export default new Vuex.Store({
  modules: {
    list,
    pagination
  },
  plugins: [vuexLocal.plugin]
})
