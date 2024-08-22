import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    vendors: []
  },
  actions: {
    get_vendors_from_api ({ commit }) {
      return Axios('/rest/front_gettree', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          get_type: 'vendors'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_VENDORS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    }
  },
  mutations: {
    SET_VENDORS_TO_VUEX: (state, data) => {
      state.vendors = data.data
    }
  },
  getters: {
    getvendors (state) {
      return state.vendors
    }
  }
}
