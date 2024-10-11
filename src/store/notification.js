import Axios from 'axios'
import router from '../router'

export default {
  state: {
    notifications: []
  },
  actions: {
    get_notification_api ({ commit }, data) {
      return Axios('/rest/front_notification', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_NOTIFICATIONS_TO_VUEX', response.data)
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
    SET_NOTIFICATIONS_TO_VUEX: (state, data) => {
      state.notifications = data.data
    },
  },
  getters: {
    notifications (state) {
      return state.notifications
    },
  }
}
