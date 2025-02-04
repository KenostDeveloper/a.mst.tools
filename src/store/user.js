import Axios from 'axios'

export default {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    getUser (state) {
      return state.user
    }
  },
  mutations: {
    SET_USER (state, payload) {
      state.user = payload
    },
    DELETE_USER (state) {
      state.user = null
    }
  },
  actions: {
    setUser ({ commit }, payload) {
      commit('SET_USER', payload)
    },
    deleteUser ({ commit }) {
      commit('DELETE_USER')
    },
    getSessionUser({ commit }){
      return Axios('/rest/auth', {
        method: 'POST',
        data: {
          action: 'get/session'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_USER', response.data.data)
          return response.data.data;
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    edit_profile ({ commit }, data) {
      return Axios('/rest/front_profile', {
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
  }
}
