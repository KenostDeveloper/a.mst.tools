import Axios from 'axios'
import router from '../router'

export default {
  state: {
    org_profile: [],
    orgs: [],
    org_stores: [],
    org_store: [],
    individual_discount: [],
    available_warehouses: [],
    available_sellers: [],
    org_managers: []
  },
  actions: {
    get_available_sellers_from_api ({ commit }) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: {
          org_id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
          id_org_from: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id : null,
          action: 'get/org/available_sellers',
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_ORG_AVAILABLE_SELLERS_TO_VUEX', response.data)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_available_warehouses_from_api ({ commit }) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: {
          org_id: router.currentRoute._value.params.id,
          action: 'get/org/available_warehouses'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_ORG_AVAILABLE_WAREHOUSES_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_org_store_from_api ({ commit }) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          store_id: router.currentRoute._value.params.store_id,
          action: 'get/org/store'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ORG_STORE_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    org_profile_from_api ({ commit }, data) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ORG_PROFILE_TO_VUEX', response.data)
          return response
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    org_get_managers_from_api({ commit }, data){
      return Axios('/rest/front_org', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_MANAGERS_TO_VUEX', response.data)
          return response
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    org_get_from_api ({ commit }, data) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_ORG_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    org_get_stores_from_api ({ commit }, data) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_ORG_STORES_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    org_profile_set_from_api ({ commit }, data) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_ORG_PROFILE_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
      })
    },
    org_get_discount_individual_api ({ commit }, data) {
      return Axios('/rest/front_org', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ORG_INDIVIDUAL_TO_VUEX', response.data)
          // console.log(response)
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
    GET_ORG_AVAILABLE_SELLERS_TO_VUEX: (state, data) => {
      state.available_sellers = data.data
    },
    GET_ORG_AVAILABLE_WAREHOUSES_TO_VUEX: (state, data) => {
      state.available_warehouses = data.data
    },
    SET_ORG_PROFILE_TO_VUEX: (state, data) => {
      state.org_profile = data.data
    },
    GET_ORG_TO_VUEX: (state, data) => {
      state.orgs = data.data
    },
    GET_ORG_STORES_TO_VUEX: (state, data) => {
      state.org_stores = data.data
    },
    SET_ORG_STORE_TO_VUEX: (state, data) => {
      state.org_store = data.data
    },
    SET_ORG_INDIVIDUAL_TO_VUEX: (state, data) => {
      state.individual_discount = data.data
    },
    SET_MANAGERS_TO_VUEX: (state, data) => {
      state.org_managers = data.data
    },
  },
  getters: {
    org_profile (state) {
      return state.org_profile
    },
    orgs (state) {
      return state.orgs
    },
    org_stores (state) {
      return state.org_stores
    },
    org_store (state) {
      return state.org_store
    },
    individual_discount (state) {
      return state.individual_discount
    },
    available_warehouses (state) {
      return state.available_warehouses
    },
    available_sellers (state) {
      return state.available_sellers
    },
    org_managers (state) {
      return state.org_managers
    },
  }
}
