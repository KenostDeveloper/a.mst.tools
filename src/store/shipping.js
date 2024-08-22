import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    shipping: []
  },
  actions: {
    get_shipping_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getshipping', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        }
      })
        .then((response) => {
          commit('SET_SHIPPING_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    async set_shipping_to_api ({ commit }, data) {
      return Axios('/rest/front_getshipping', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_SHIPPING_TO_VUEX', response.data)
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
    SET_SHIPPING_TO_VUEX: (state, data) => {
      if (typeof data.data.dates !== 'undefined' && data.data.dates.dates !== null) {
        if (typeof data.data.dates.dates !== 'undefined' && data.data.dates.dates !== null) {
          const highlight = data.data.dates
          for (let i = 0; i < highlight.dates.length; i++) {
            const tmp = data.data.dates.dates[i]
            data.data.dates.dates[i] = new Date(tmp)
          }
        }
      }
      console.log(data.data)
      for (let i = 0; i < data.data.shipment.length; i++) {
        data.data.shipment[i].checked = false
      }
      state.shipping = data.data
    },
    SET_SHIPPING_CHECK: (state, data) => {
      // console.log(data)
      const shipping = state.shipping
      for (let i = 0; i < shipping.shipment.length; i++) {
        if (data[0]) {
          shipping.shipment[i].checked = data[0]
        } else {
          shipping.shipment[i].checked = false
        }
      }
      state.shipping = shipping
    },
    SET_SHIPPING_CHECK_ONE: (state, data) => {
      console.log(data)
      console.log(state)
      const shipping = state.shipping
      for (let i = 0; i < shipping.shipment.length; i++) {
        console.log(data.id + '===' + shipping.shipment[i].id)
        if (data.id === shipping.shipment[i].id) {
          shipping.shipment[i].checked = data.checked
        }
      }
      state.shipping = shipping
    }
  },
  getters: {
    shipping (state) {
      return state.shipping
    }
  }
}
