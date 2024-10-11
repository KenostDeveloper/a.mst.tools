import Axios from 'axios'
import router from '../router'

export default {
  state: {
    dilers: []
  },
  actions: {
    set_diler_to_api ({ commit }, data) {
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
            router.push({ name: 'main' })
          }
        })
    },
    unset_dilers ({ commit }){
      commit('UNSET_DILERS_IN_VUEX')
    },
    get_dilers_from_api ({ commit }, { filter, filtersdata, page, perpage }) {
      return Axios('/rest/front_getdilers', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          filter: filter,
          filtersdata: filtersdata,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_DILERS_TO_VUEX', response.data)
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
    SET_DILERS_TO_VUEX: (state, data) => {
      state.dilers = data.data
    },
    UNSET_DILERS_IN_VUEX: (state) => {
      state.dilers = []
    },
  },
  getters: {
    dilers (state) {
      return state.dilers
    }
  }
}
