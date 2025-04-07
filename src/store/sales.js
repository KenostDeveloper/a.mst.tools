import Axios from 'axios'
import router from '../router'

export default {
  state: {
    actions: [],
    allactions: [],
    salesbanners: [],
    adv_pages: [],
    action_buyer: [],
    action_discount: [],
    agreement: [],
    actions_active: []
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
          return response
          // commit('SET_MATRIX_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_sales_to_api ({ commit }, { filter, filtersdata, page, sort, perpage, actionid, type, isAction }) {
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
        type: type,
        is_action: isAction ? true : false,
        extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart'
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
            router.push({ name: 'main' })
          }
        })
    },
    get_actions_discount_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ACTION_DISCOUNT_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_actions_active_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ACTION_ACTIVE_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_agreement_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AGREEMENT_VUEX', response.data)
          return response;
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_actions_buyer_to_api ({ commit }, data) {
      return Axios('/rest/front_sales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ACTIONS_BUYER_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    unset_actions_buyer ({ commit }) {
      commit('UNSET_ACTIONS_BUYER')
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
            router.push({ name: 'main' })
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
            router.push({ name: 'main' })
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
            router.push({ name: 'main' })
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
    SET_ACTIONS_BUYER_TO_VUEX: (state, data) => {
      state.action_buyer = data.data
    },
    UNSET_ACTIONS_BUYER: (state, data) => {
      state.action_buyer = []
    },
    SET_ACTION_DISCOUNT_VUEX: (state, data) => {
      state.action_discount = data.data
    },
    SET_AGREEMENT_VUEX: (state, data) => {
      state.agreement = data.data
    },
    SET_ACTION_ACTIVE_VUEX: (state, data) => {
      state.actions_active = data.data
    },
    SET_SALES_PRODUCTS_MUTATION_TO_VUEX: (state, data) => {
      if(state.actions.products){
        for(let i = 0; i < state.actions.products.length; i++){
          if(state.actions.products[i].remain_id == data.remain_id){
            for(let j = 0; j < state.actions.products[i].stores.length; j++){
              if(state.actions.products[i].stores[j].store_id == data.store_id){
                if(state.actions.products[i].stores[j].basket.key == data.key){
                  state.actions.products[i].stores[j].basket.availability = true
                  state.actions.products[i].stores[j].basket.count = data.count
                }
              }
            }
          }
        }
      }
      // if (Object.keys(state.actions).length) {
      //   for (let i = 0; i < Object.keys(state.actions.products).length; i++) {
      //     if (state.actions.products[Object.keys(state.actions.products)[i]].remain_id === data.remain_id) {
      //       console.log(state.actions.products[Object.keys(state.actions.products)[i]])
      //       console.log(data)
      //       state.actions.products[Object.keys(state.actions.products)[i]].basket.availability = true
      //       state.actions.products[Object.keys(state.actions.products)[i]].basket.count = data.count
      //     }
      //   }
      // }
    },
    SET_SALES_COMPLECT_MUTATION_TO_VUEX: (state, data) => {
      // console.log('mut SET_SALES_COMPLECT_MUTATION_TO_VUEX', data)
      // console.log('state.actions', state.actions)
      if (Object.keys(state.actions).length) {
        for (let i = 0; i < Object.keys(state.actions.complects).length; i++) {
          if (data.complect_id === state.actions.complects[Object.keys(state.actions.complects)[i]].id) {
            for (let j = 0; j < state.actions.complects[Object.keys(state.actions.complects)[i]].products.length; j++) {
              // console.log(state.actions.complects[Object.keys(state.actions.complects)[i]].products[i])
              state.actions.complects[Object.keys(state.actions.complects)[i]].products[j].basket.availability = true
              state.actions.complects[Object.keys(state.actions.complects)[i]].products[j].basket.count = data.count
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
    },
    action_buyer (state) {
      return state.action_buyer
    },
    action_discount (state) {
      return state.action_discount
    },
    agreement(state) {
      return state.agreement
    },
    actions_active(state) {
      return state.actions_active
    },
  }
}
