import Vue from 'vue'
import Vuex from 'vuex'
import DataVuex from './DataVuex'
import { vuexfireMutations } from 'vuexfire'

import login from './modules/login'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    mutations: {
      ...vuexfireMutations
    },
    modules: {
      DataVuex,
      login
    },

    strict: process.env.DEBUGGING
  })

  Store.dispatch('DataVuex/getAllParadas')
  Store.dispatch('DataVuex/getAllRutas')
  Store.dispatch('login/getFirebaseAdmins')
  Store.dispatch('login/getFirebaseUsers')

  return Store
}
