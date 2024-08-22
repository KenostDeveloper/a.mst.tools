import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    bonuses: [],
    bonus_targets: []
  },
  actions: {
    bonus_api ({ commit }, data) {
      return Axios('/rest/front_bonus', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUS_TO_VUEX', response.data)
          // console.log(response)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    bonus_targets_api ({ commit }, data) {
      return Axios('/rest/front_bonus', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUS_TARGETS_TO_VUEX', response.data)
          // console.log(response)
          return response
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
    SET_BONUS_TO_VUEX: (state, data) => {
      state.bonuses = data.data
    },
    SET_BONUS_TARGETS_TO_VUEX: (state, data) => {
      state.bonus_targets = data.data
    }
  },
  getters: {
    bonuses (state) {
      return state.bonuses
    },
    bonus_targets (state) {
      return state.bonus_targets
    }
  }
}
