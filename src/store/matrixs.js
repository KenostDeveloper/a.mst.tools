import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    matrix: [],
    matrix_el: []
  },
  actions: {
    get_matrixs_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getmatrixs', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_MATRIXS_TO_VUEX', response.data)
        })
    },
    get_matrix_from_api ({ commit }, { id }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        matrix_id: id
      }
      return Axios('/rest/front_getmatrixs', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_MATRIX_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    set_matrix_to_api ({ commit }, data) {
      return Axios('/rest/front_getmatrixs', {
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
    }
  },
  mutations: {
    SET_MATRIXS_TO_VUEX: (state, data) => {
      state.matrix = data.data
    },
    SET_MATRIX_TO_VUEX: (state, data) => {
      if (data.data.date_from && data.data.date_to) {
        data.data.dates = [
          new Date(data.data.date_from),
          new Date(data.data.date_to)
        ]
      }
      state.matrix_el = data.data
    }
  },
  getters: {
    matrixs (state) {
      return state.matrix
    },
    matrix (state) {
      return state.matrix_el
    }
  }
}
