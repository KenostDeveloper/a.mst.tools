import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    actions: [],
    allactions: [],
    salesbanners: [],
    adv_pages: []
  },
  actions: {
    set_sales_to_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_sales_to_api ({ commit }, { filter, filtersdata, page, sort, perpage, actionid, type }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage,
        action: 'get',
        action_id: actionid,
        type: type
      }
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_ACTIONS_TO_VUEX', response.data)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_sales_adv_pages_to_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_MATRIX_ADV_PAGES_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_all_sales_to_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_ALL_ACTION_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_salses_banners_to_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_BANNERS_SALES_TO_VUEX', response.data)
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
    GET_ACTIONS_TO_VUEX: (state, data) => {
      state.actions = data.data
    },
    GET_ALL_ACTION_TO_VUEX: (state, data) => {
      state.allactions = data.data
    },
    GET_BANNERS_SALES_TO_VUEX: (state, data) => {
      state.salesbanners = data.data
    },
    SET_MATRIX_ADV_PAGES_TO_VUEX: (state, data) => {
      state.adv_pages = data.data
    },
    SET_SALES_PRODUCTS_MUTATION_TO_VUEX: (state, data) => {
      if (Object.keys(state.actions).length) {
        console.log('mut 1')
        for (let i = 0; i < Object.keys(state.actions.products).length; i++) {
          if (state.actions.products[Object.keys(state.actions.products)[i]].remain_id === data.remain_id) {
            state.actions.products[Object.keys(state.actions.products)[i]].basket.availability = true
            state.actions.products[Object.keys(state.actions.products)[i]].basket.count = data.count
          }
        }
      }
    },
    SET_SALES_COMPLECT_MUTATION_TO_VUEX: (state, data) => {
      if (Object.keys(state.actions).length) {
        for (let i = 0; i < Object.keys(state.actions.complects).length; i++) {
          if (data.complect_id === state.actions.complects[Object.keys(state.actions.complects)[i]].id) {
            for (let j = 0; j < state.actions.complects[Object.keys(state.actions.complects)[i]].products.length; j++) {
              state.actions.complects[Object.keys(state.actions.complects)[i]].products[i].basket.availability = true
              state.actions.complects[Object.keys(state.actions.complects)[i]].products[i].basket.count = data.count
            }
          }
        }
      }
    }
  },
  getters: {
    actions (state) {
      return state.actions
    },
    allactions (state) {
      return state.allactions
    },
    salesbanners (state) {
      return state.salesbanners
    },
    adv_pages (state) {
      return state.adv_pages
    }
  }
}
