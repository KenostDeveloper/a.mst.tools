import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    trainingcatalog: []
  },
  actions: {
    get_training_catalog_from_api ({ commit }) {
      return Axios('/rest/front_training', {
        method: 'POST',
        data: {
          action: 'get/catalog'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_TR_CATALOG_TO_VUEX', response.data)
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
    SET_TR_CATALOG_TO_VUEX: (state, data) => {
      state.trainingcatalog = data.data
    }
  },
  getters: {
    trainingcatalog (state) {
      return state.trainingcatalog
    }
  }
}
