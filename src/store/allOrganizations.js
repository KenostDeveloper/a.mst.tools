import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    allorganizations: []
  },
  actions: {
    get_all_organizations_from_api ({ commit }, { filter, selected }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        filter: filter,
        selected: selected,
        type: 'get/organizations'
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_ALL_ORGANIZATIONS_TO_VUEX', response.data)
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
    SET_ALL_ORGANIZATIONS_TO_VUEX: (state, data) => {
      state.allorganizations = data.data
    }
  },
  getters: {
    allorganizations (state) {
      return state.allorganizations
    }
  }
}
