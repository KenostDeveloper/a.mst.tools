import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    regions_data: [],
    stores_data: []
  },
  actions: {
    get_dataavailable_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      console.log(data)
      return Axios('/rest/front_getavailable', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AVAILABLEDATA_TO_VUEX', response.data)
        })
    },
    get_dataavailablestores_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        region_id: router.currentRoute._value.params.region_id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      console.log(data)
      return Axios('/rest/front_getavailable', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AVAILABLESTORES_TO_VUEX', response.data)
        })
    },
    unset_dataavailable ({ commit }) {
      commit('UNSET_DATAAVAILABLE')
    }
  },
  mutations: {
    SET_AVAILABLEDATA_TO_VUEX: (state, data) => {
      state.regions_data = data.data
    },
    SET_AVAILABLESTORES_TO_VUEX: (state, data) => {
      state.stores_data = data.data
    },
    UNSET_DATAAVAILABLE: (state) => {
      state.stores_data = []
      state.regions_data = []
    }
  },
  getters: {
    available (state) {
      return state.regions_data
    },
    available_store (state) {
      return state.stores_data
    }
  }
}
