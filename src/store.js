import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './store/state'
import * as getters from './store/getters'
import * as mutations from './store/mutations'
import * as actions from './store/actions'

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
