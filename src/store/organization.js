/*
*   Информация об организациях, дилерах
*/

import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    organization: [],
    diler: [],
    balance: [],
    balance_requests: []
  },
  actions: {
    get_organization_from_api ({ commit }) {
      const data = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }

      if (router.currentRoute._value.params.id) {
        data.id = router.currentRoute._value.params.id
        return Axios('/rest/front_organization', {
          method: 'POST',
          data: data,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then((response) => {
            commit('SET_ORGANIZATION_TO_VUEX', response.data)
          })
          .catch(error => {
            if (error.response.status === 403) {
              localStorage.removeItem('user')
              router.push({ name: 'home' })
            }
          })
      }
    },
    get_diler_from_api ({ commit }) {
      return Axios('/rest/front_organization', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.diler_id
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_DILER_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_balance_from_api ({ commit }, { page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'balance',
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BALANCE_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_balance_requests_from_api ({ commit }, { page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'balance_requests',
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BALANCE_REQUESTS_TO_VUEX', response.data)
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    set_balance_request_to_api ({ commit }, data) {
      return Axios('/rest/front_setobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
        })
        .catch(error => {
          console.log(error)
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    set_organization_data ({ commit }, data) {
      return Axios('/rest/front_setobjects', {
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
    set_organization_settings ({ commit }, data) {
      data.action = 'set/organization/settings'
      return Axios('/rest/front_setobjects', {
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
    delete_organization_from_api ({ commit }) {
      commit('DELETE_ORGANIZATION_FROM_VUEX')
    },
    delete_diler_from_api ({ commit }) {
      commit('DELETE_DILER_FROM_VUEX')
    },
    delete_balance_from_api ({ commit }) {
      commit('UNSET_BALANCE_FROM_VUEX')
    },
    delete_balance_requests_from_api ({ commit }) {
      commit('UNSET_BALANCE_REQUESTS_FROM_VUEX')
    }
  },
  mutations: {
    SET_ORGANIZATION_TO_VUEX: (state, data) => {
      state.organization = data.data
    },
    DELETE_ORGANIZATION_FROM_VUEX: (state) => {
      state.organization = { }
    },
    SET_DILER_TO_VUEX: (state, data) => {
      state.diler = data.data
    },
    DELETE_DILER_FROM_VUEX: (state) => {
      state.diler = { }
    },
    SET_BALANCE_TO_VUEX: (state, data) => {
      state.balance = data.data
    },
    UNSET_BALANCE_FROM_VUEX: (state) => {
      state.balance = []
    },
    SET_BALANCE_REQUESTS_TO_VUEX: (state, data) => {
      state.balance_requests = data.data
    },
    UNSET_BALANCE_REQUESTS_FROM_VUEX: (state) => {
      state.balance_requests = []
    }
  },
  getters: {
    organization (state) {
      return state.organization
    },
    diler (state) {
      return state.diler
    },
    balance (state) {
      return state.balance
    },
    balance_requests (state) {
      return state.balance_requests
    }
  }
}
