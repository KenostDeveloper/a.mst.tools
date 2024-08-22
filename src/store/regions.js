import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    regions: []
  },
  actions: {
    get_regions_from_api ({ commit }) {
      return Axios('/rest/front_gettree', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          get_type: 'regions'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REGIONS_TO_VUEX', response.data)
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
    SET_REGIONS_TO_VUEX: (state, data) => {
      state.regions = data.data
    }
  },
  getters: {
    getregions (state) {
      return state.regions
    }
  }
}
