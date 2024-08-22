import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    products: []
  },
  actions: {
    get_datatopsales_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: router.currentRoute._value.params.type,
        report_id: router.currentRoute._value.params.report_id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      console.log(data)
      return Axios('/rest/front_gettopsales', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_TOPDATA_TO_VUEX', response.data)
        })
    },
    unset_datatopsales ({ commit }) {
      // commit('SET_REPORT_TO_VUEX', [])
      commit('UNSET_TOPDATA_TO_VUEX')
    }
  },
  mutations: {
    SET_TOPDATA_TO_VUEX: (state, data) => {
      state.products = data.data
    },
    UNSET_TOPDATA_TO_VUEX: (state) => {
      state.products = []
    }
  },
  getters: {
    topsales (state) {
      return state.products
    }
  }
}
