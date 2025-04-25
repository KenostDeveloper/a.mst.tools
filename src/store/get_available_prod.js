import Axios from 'axios'
import router from '../router'

export default {
  state: {
    products_available: [],
    products_selected: [],
    complects_available: [],
    complects_selected: []
  },
  actions: {
    set_selected_product_data({ commit }, { type, products, data } ) {
      const request_data = {
        id: router.currentRoute._value.params.id,
        action: "product/set/data",
        type: type,
        products: products,
        data: data
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: request_data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_selected_product({ commit }, remain_id ) {
      const data = {
        id: router.currentRoute._value.params.id,
        action: "product/set/selected",
        remain_id: remain_id
      }
      console.log(data)
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_deselected_products({ commit }){
      const data = {
        id: router.currentRoute._value.params.id,
        action: "products/set/deselected"
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_selected_products({ commit }, { store_id, filter, filtersdata }){
      const data = {
        id: router.currentRoute._value.params.id,
        store_id: store_id,
        filter: filter,
        filtersdata: filtersdata,
        action: "products/set/selected"
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_deselected_product({ commit }, remain_id ){
      const data = {
        id: router.currentRoute._value.params.id,
        action: "product/set/deselected",
        remain_id: remain_id
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_available_products_from_api ({ commit }, { store_id, filter, filtersdata, page, perpage, type }) {
      const data = {
        id: router.currentRoute._value.params.id,
        action: "product/get",
        stores_ids: store_id, 
        filter: filter,
        filtersdata: filtersdata,
        page: page,
        perpage: perpage,
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
          if(response.data.data.type == 1){
            commit('SET_AV_PR_TO_VUEX', response.data)
          }
          if(response.data.data.type == 2){
            commit('SET_SEL_PR_TO_VUEX', response.data)
          }
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_available_complects_from_api ({ commit }, { store_id, filter, page, perpage, type }) {
      const data = {
        id: router.currentRoute._value.params.id,
        action: "complect/get",
        stores_ids: store_id, 
        filter: filter,
        page: page,
        perpage: perpage,
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
          if(response.data.data.type == 1){
            commit('SET_AV_CMPLCT_TO_VUEX', response.data)
          }
          if(response.data.data.type == 2){
            commit('SET_SEL_CMPLCT_TO_VUEX', response.data)
          }
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_selected_complect({ commit }, complect_id ) {
      const data = {
        id: router.currentRoute._value.params.id,
        action: "complect/set/selected",
        complect_id: complect_id
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_deselected_complects({ commit }){
      const data = {
        id: router.currentRoute._value.params.id,
        action: "complects/set/deselected"
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_selected_complects({ commit }, { store_id, filter }){
      const data = {
        id: router.currentRoute._value.params.id,
        store_id: store_id,
        filter: filter,
        action: "complects/set/selected"
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    set_deselected_complect({ commit }, complect_id ){
      const data = {
        id: router.currentRoute._value.params.id,
        action: "complect/set/deselected",
        complect_id: complect_id
      }
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    upload_products_file({ commit }, data) {
      return Axios('/rest/front_getavproducts', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    }
  },
  mutations: {
    SET_AV_PR_TO_VUEX: (state, data) => {
      state.products_available = data.data
    },
    SET_SEL_PR_TO_VUEX: (state, data) => {
      state.products_selected = data.data
    },
    SET_AV_CMPLCT_TO_VUEX: (state, data) => {
      state.complects_available = data.data
    },
    SET_SEL_CMPLCT_TO_VUEX: (state, data) => {
      state.complects_selected = data.data
    }
  },
  getters: {
    available_products (state) {
      return state.products_available
    },
    selected_products (state) {
      return state.products_selected
    },
    available_complects (state) {
      return state.complects_available
    },
    selected_complects (state) {
      return state.complects_selected
    }
  }
}
