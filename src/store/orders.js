import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    orders: []
  },
  actions: {
    get_orders_from_api ({ commit }, { filter, sort, page, perpage }) {
      console.log(filter)
      return Axios('/rest/front_getorders', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          filter: filter,
          page: page,
          sort: sort,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ORDERS_TO_VUEX', response.data)
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
    SET_ORDERS_TO_VUEX: (state, data) => {
      state.orders = data.data
    }
  },
  getters: {
    orders (state) {
      return state.orders
    }
  }
}
