/**
 *  Коллекции:
 *    - Создание
 *    - Отображение
 */
import Axios from 'axios'
import router from '../router'

export default {
  state: {
    group_tags: [],
    group_vendors: [],
  },
  actions: {
    set_group_api({ commit }, data) {
      return Axios('/rest/front_group', {
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
    get_tags_group_api({ commit }, data) {
        return Axios('/rest/front_group', {
          method: 'POST',
          data: data,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then((response) => {
            commit('SET_TAGS_GROUP_TO_VUEX', response.data)
          })
          .catch(error => {
            if (error.response.status === 403) {
              localStorage.removeItem('user')
              router.push({ name: 'main' })
            }
        })
    },
    get_vendors_group_api({ commit }, data) {
        return Axios('/rest/front_group', {
          method: 'POST',
          data: data,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then((response) => {
            commit('SET_VENDORS_GROUP_TO_VUEX', response.data)
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
    SET_TAGS_GROUP_TO_VUEX: (state, data) => {
      state.group_tags = data.data
    },
    SET_VENDORS_GROUP_TO_VUEX: (state, data) => {
        state.group_vendors = data.data
    },
  },
  getters: {
    group_tags (state) {
        return state.group_tags
    },
    group_vendors (state) {
        return state.group_vendors
    }
  }
}
