import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    returnsproduct: [],
    returnproduct: []
  },
  actions: {
    get_returns_products_from_api ({ commit }) {
      return Axios('/rest/front_getreturns', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          action: 'getshop/products'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_RETURNS_PRODUCTS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_returns_from_api ({ commit }) {
      return Axios('/rest/front_getreturns', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          id_return: router.currentRoute._value.params.returns_id,
          type: router.currentRoute._value.params.type,
          action: 'getshop/products'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_RETURNS_TO_VUEX', response.data)
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
    SET_RETURNS_PRODUCTS_TO_VUEX: (state, data) => {
      state.returnsproduct = data.data
    },
    SET_RETURNS_TO_VUEX: (state, data) => {
      state.returnproduct = data.data
    }
  },
  getters: {
    returnsproduct (state) {
      return state.returnsproduct
    },
    returnproduct (state) {
      return state.returnproduct
    }
  }
}
