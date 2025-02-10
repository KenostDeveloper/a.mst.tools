import Axios from 'axios'
import router from '../router'
import { transformCatalog } from '../utils/helpers'
import Toast from 'primevue/toast';

export default {
  state: {
    offers: []
  },
  actions: {
    offer_api ({ commit }, data) {
      return Axios('/rest/front_offer', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_offer_api ({ commit }, data) {
      return Axios('/rest/front_offer', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OFFERS_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
  },
  mutations: {
    SET_OFFERS_TO_VUEX: (state, data) => {
      state.offers = data.data
    },
  },
  getters: {
    offers (state) {
      return state.offers
    },
  }
}
