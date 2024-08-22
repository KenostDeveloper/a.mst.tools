import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    product: []
  },
  actions: {
    get_product_from_api ({ commit }) {
      return Axios('/rest/front_getproducts', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          product_id: router.currentRoute._value.params.product_id
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_DATA_TO_VUEX', response.data)
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
    SET_DATA_TO_VUEX: (state, data) => {
      console.log(data.data)
      if (typeof data.data.dates !== 'undefined' && data.data.dates.dates !== null) {
        if (typeof data.data.dates.dates !== 'undefined' && data.data.dates.dates !== null) {
          const highlight = data.data.dates
          for (let i = 0; i < highlight.dates.length; i++) {
            const tmp = data.data.dates.dates[i]
            data.data.dates.dates[i] = new Date(tmp)
          }
        }
      }
      state.product = data.data
    },
    SET_PRODUCT_LINK: (state, data) => {
      state.product.product_id = data.id
      state.product.image = data.image
      state.product.pagetitle = data.pagetitle
      state.product.product_article = data.article
      state.product.vendor_article = data.vendor_article
    }
  },
  getters: {
    product (state) {
      return state.product
    }
  }
}
