import * as types from '../mutation-types'

const state = {
  NoteId: undefined
}

const mutations = {
  [types.UPDATE_NOTE_ID] (state, item) {
    state.NoteId = item
  }
}

export default {
  state,
  mutations
}
