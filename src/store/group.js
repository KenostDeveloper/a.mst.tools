/**
 *  Коллекции:
 *    - Создание
 *    - Отображение
 */
import Axios from 'axios'
import router from '../router'

export default {
  state: {
    groups: [],
    group_tags: [],
    group_vendors: [],
    group_catalog: [],
    group_build: [],
    group_products: []
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
    get_group_api({ commit }, data) {
      return Axios('/rest/front_group', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_GROUPS_TO_VUEX', response.data)
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
    },
    get_catalog_group_api({ commit }, data) {
        return Axios('/rest/front_group', {
          method: 'POST',
          data: data,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then((response) => {
            commit('SET_CATALOG_GROUP_TO_VUEX', response.data)
          })
          .catch(error => {
            if (error.response.status === 403) {
              localStorage.removeItem('user')
              router.push({ name: 'main' })
            }
        })
    },
    build_group_api({ commit }, data) {
        return Axios('/rest/front_group', {
          method: 'POST',
          data: data,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then((response) => {
            commit('BUILD_GROUP_TO_VUEX', response.data)
            return response.data
          })
          .catch(error => {
            if (error.response.status === 403) {
              localStorage.removeItem('user')
              router.push({ name: 'main' })
            }
        })
    },
    get_group_products({ commit }, data) {
        return Axios('/rest/front_group', {
          method: 'POST',
          data: data,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        })
          .then((response) => {
            commit('GROUP_PRODUCTS_TO_VUEX', response.data)
            return response.data
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
    SET_CATALOG_GROUP_TO_VUEX: (state, data) => {
      state.group_catalog = data.data
    },
    BUILD_GROUP_TO_VUEX: (state, data) => {
      state.group_build = data.data
    },
    GROUP_PRODUCTS_TO_VUEX: (state, data) => {
      state.group_products = data.data
    },
    SET_GROUPS_TO_VUEX: (state, data) => {
      state.groups = data.data
    },
  },
  getters: {
    group_tags (state) {
      return state.group_tags
    },
    group_vendors (state) {
      return state.group_vendors
    },
    group_catalog (state) {
      return state.group_catalog
    },
    group_build (state) {
      return state.group_build
    },
    groups (state) {
      return state.groups
    },
    group_products (state) {
      return state.group_products
    }
  }
}
