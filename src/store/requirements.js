/**
 *  Потребности:
 *    - Создание
 *    - Загрузка
 *    - Отображение
 */


import Axios from 'axios'
import router from '../router'

export default {
  state: {
    requirements: {
      items: [],
      total: -1
    }
  },
  actions: {
    get_requirements_api ({ commit }, data) {
      return Axios('/rest/front_requirements', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REQUIREMENTS_TO_VUEX', response.data)
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
    set_requirements_api({ commit }, data) {
      return Axios('/rest/front_requirements', {
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
    unset_requirements({ commit }){
      commit('UNSET_REQUIREMENTS_TO_VUEX')
    }
  },  
  mutations: {
    SET_REQUIREMENTS_TO_VUEX: (state, data) => {
      state.requirements = data.data
    },
    UNSET_REQUIREMENTS_TO_VUEX: (state) => {
      state.requirements = {
        items: [],
        total: -1
      }
    }
  },
  getters: {
    requirements (state) {
      return state.requirements
    }
  }
}
