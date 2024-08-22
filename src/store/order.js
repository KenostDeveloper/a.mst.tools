import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    order: [],
    store: [],
    order_products: []
  },
  actions: {
    get_order_from_api ({ commit }) {
      return Axios('/rest/front_getorders', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          order_id: router.currentRoute._value.params.order_id
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ORDER_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    change_status ({ commit }) {
      return Axios('/rest/front_order_change', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          order_id: router.currentRoute._value.params.order_id
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }).then((response) => {
        commit('SET_ORDER_TO_VUEX', response.data)
      })
    }
  },
  mutations: {
    SET_ORDER_TO_VUEX: (state, data) => {
      state.order = data.data.orders[0]
      state.store = data.data.store
      state.order_products = data.data.products
    }
  },
  getters: {
    order (state) {
      return state.order
    },
    store (state) {
      return state.store
    },
    order_products (state) {
      return state.order_products
    }
  }
}
