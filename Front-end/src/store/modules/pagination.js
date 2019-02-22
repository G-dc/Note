import * as types from '../mutation-types'

const state = {
  currentPage: 1,
  total: 0
}

const mutations = {
  [types.UPDATE_TOTAL_PAGE] (state, item) {
    state.total = item
  },
  [types.UPDATE_CURRENT_PAGE] (state, item) {
    state.currentPage = item
  }
}

export default {
  state,
  mutations
}
