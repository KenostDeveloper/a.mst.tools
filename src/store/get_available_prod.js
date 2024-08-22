import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    products: []
  },
  actions: {
    get_available_products_from_api ({ commit }, { storeid, filter, filterselected, selected, pageselected, page, perpage, isallproducts, type }) {
      // console.log(filter)
      const data = {
        id: storeid,
        filter: filter,
        selected: selected,
        page_selected: pageselected,
        page: page,
        perpage: perpage,
        filterselected: filterselected,
        isallproducts: isallproducts,
        type: type
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AV_PR_TO_VUEX', response.data)
          return response
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
    SET_AV_PR_TO_VUEX: (state, data) => {
      state.products = data.data
    }
  },
  getters: {
    available_products (state) {
      return state.products
    }
  }
}
