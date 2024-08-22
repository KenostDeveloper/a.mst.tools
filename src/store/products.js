import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    products: [],
    diler_products: []
  },
  actions: {
    get_data_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        store_id: router.currentRoute._value.params.store_id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      if (router.currentRoute._value.params.store_id) {
        data.store_id = router.currentRoute._value.params.store_id
      }
      return Axios('/rest/front_getproducts', {
        method: 'POST',
        data: data,
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
    },
    get_diler_products_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.diler_id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_DILER_PRODUCTS_TO_VUEX', response.data)
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
      state.products = data.data
    },
    SET_DILER_PRODUCTS_TO_VUEX: (state, data) => {
      state.diler_products = data.data
    },
    UNSET_DATA_FROM_VUEX: (state) => {
      state.products = []
    },
    UNSET_DILER_PRODUCTS_TO_VUEX: (state) => {
      state.diler_products = []
    }
  },
  getters: {
    products (state) {
      return state.products
    },
    diler_products (state) {
      return state.diler_products
    }
  }
}
