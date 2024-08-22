import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    items: []
  },
  actions: {
    get_datapresent_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        vendor_id: router.currentRoute._value.params.id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      console.log(data)
      return Axios('/rest/front_getpresent', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_PRESENT_TO_VUEX', response.data)
        })
    }
  },
  mutations: {
    SET_PRESENT_TO_VUEX: (state, data) => {
      state.items = data.data
    }
  },
  getters: {
    present (state) {
      return state.items
    }
  }
}
