import Axios from 'axios'
import router from '@/router'

export default {
  state: {
    akbdata: [],
    matrix: [],
    brands: [],
    feeds: [],
    programfiles: [],
    bonus_stores: [],
    available_brands: [],
    reports: [],
    report: [],
    reporttypes: [],
    bonuses: [],
    bonus_part: [],
    bonus_newplans: [],
    bonus_plans: [],
    bonus: [],
    docs: [],
    docsstatus: [],
    cardstatus: [],
    stores: [],
    akbpunkts: [],
    akbdotsplan: [],
    akbpunktsplan: [],
    akbsettlements: [],
    plan: [],
    getstoredata: [],
    getrrcreport: [],
    getrrcdata: [],
    getrequests: [],
    shipping_statuses: [],
    shipdata: [],
    opts: [],
    report_copo: [],
    report_copo_details: [],
    report_copo_all: [],
    report_copo_all_details: [],
    msproducts: []
  },
  actions: {
    get_available_stores_from_api ({ commit }, { filter, selected }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        filter: filter,
        selected: selected,
        type: 'available_stores'
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AV_ST_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_bonuses_from_api ({ commit }, { simple, bonusid, our, filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'bonuses',
          filter: filter,
          filtersdata: filtersdata,
          our: our,
          bonusid: bonusid,
          simple: simple,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUSES_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_docs_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'docs',
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_DOCS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_docsstatus_from_api ({ commit }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          type: 'docsstatus'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_DOCSSTATUS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_cardstatus_from_api ({ commit }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          type: 'cardstatus'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_CARDSTATUS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_shipping_statuses ({ commit }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          type: 'shipping_statuses'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_SHIPPINGSTATUSES_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_matrixes_from_api ({ commit }) {
      return Axios('/rest/front_gettree', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          get_type: 'matrix'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_MATRIXES_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_brands_from_api ({ commit }) {
      return Axios('/rest/front_gettree', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          get_type: 'brands'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BRANDS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_bonus_available_stores_from_api ({ commit }, { filter, selected }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        bonus_id: router.currentRoute._value.params.bonus_id,
        type: 'bonus_stores',
        filter: filter,
        selected: selected
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUS_AV_ST_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_available_brands_from_api ({ commit }, { type }) {
      return Axios('/rest/front_gettree', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          get_type: 'brands',
          type: type,
          available: 1
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AVAILABLE_BRANDS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_reports_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getreports', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORTS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_report_rrc_data ({ commit }, { remainId, filter, filtersdata, page, sort, perpage }) {
      let id = 0
      let source = ''
      if (router.currentRoute._value.params.plan_id) {
        id = router.currentRoute._value.params.plan_id
        source = 'plan'
      }
      if (router.currentRoute._value.params.report_id) {
        id = router.currentRoute._value.params.report_id
        source = 'report'
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          elem_id: id,
          source: source,
          remain_id: remainId,
          type: 'rrcreportdata',
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORT_RRC_DATA_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_report_rrc_from_api ({ commit }, { storeId, filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          plan_id: router.currentRoute._value.params.plan_id,
          store_id: storeId,
          type: 'rrcreport',
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORT_RRC_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    set_report_to_api ({ commit }, data) {
      return Axios('/rest/front_getreports', {
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
    },
    get_bonus_from_api ({ commit }, { id }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'bonus',
        bonus_id: id
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_plan_from_api ({ commit }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'plan',
        plan_id: router.currentRoute._value.params.plan_id
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_PLAN_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_reporttypes_from_api ({ commit }, { toplan }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'reporttypes',
        toplan: toplan
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORTTYPES_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_bonus_participants_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'bonus_part',
        bonus_id: router.currentRoute._value.params.bonus_id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUS_PART_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_bonus_newplans_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'bonus_plans',
        new: 1,
        bonus_id: router.currentRoute._value.params.bonus_id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUS_NEWPLANS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_bonus_plans_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'bonus_plans',
        new: 0,
        bonus_id: router.currentRoute._value.params.bonus_id,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BONUS_PLANS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_feeds_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'feeds',
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_FEEDS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_programfiles_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        bonus_id: router.currentRoute._value.params.bonus_id,
        type: 'programfiles',
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_PROGRAMFILES_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_akb_data ({ commit }) {
      // console.log(filter)
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'akbdata'
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AKB_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_akbpunkts_from_api ({ commit }, { storeId, sort, page, perpage }) {
      let store = 0
      if (storeId) {
        store = storeId
      } else {
        store = router.currentRoute._value.params.id
      }
      const data = {
        id: store,
        type: 'akbpunkts',
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AKBPUNKTS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_akbsettlements_from_api ({ commit }, { storeId, sort, page, perpage }) {
      let store = 0
      if (storeId) {
        store = storeId
      } else {
        store = router.currentRoute._value.params.id
      }
      const data = {
        id: store,
        type: 'akbsettlements',
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AKBSETTLEMENTS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    // Для первичной представленности, модальные окна
    get_storedata_from_api ({ commit }, { storeId, reportId, page, perpage }) {
      let store = 0
      if (storeId) {
        store = storeId
      } else {
        store = router.currentRoute._value.params.id
      }
      const data = {
        id: store,
        report_id: reportId,
        type: 'storedata',
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_STOREDATA_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_akbdotsplan_from_api ({ commit }, { sort, page, perpage }) {
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'akbdotsplan',
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AKBDOTSPLAN_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_akbpunktsplan_from_api ({ commit }, { sort, page, perpage }) {
      const data = {
        id: router.currentRoute._value.params.id,
        type: 'akbpunktsplan',
        sort: sort,
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_AKBPUNKTSPLAN_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_product_requests ({ commit }) {
      const data = {
        id: router.currentRoute._value.params.id,
        product_id: router.currentRoute._value.params.product_id,
        type: 'request'
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REQUESTS', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    set_bonus_to_api ({ commit }, bonusData) {
      console.log(bonusData)
      return Axios('/rest/front_setobjects', {
        method: 'POST',
        data: bonusData,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
          console.log(bonusData)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    delete_work_from_api ({ commit }, workData) {
      return Axios('/rest/front_deleteobject', {
        method: 'POST',
        data: workData,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
          // console.log(workData)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    set_work_to_api ({ commit }, workData) {
      return Axios('/rest/front_setobjects', {
        method: 'POST',
        data: workData,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
          console.log(workData)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    set_connection_to_api ({ commit }, data) {
      return Axios('/rest/front_setobjects', {
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
    },
    set_plan_to_api ({ commit }, data) {
      return Axios('/rest/front_setobjects', {
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
    },
    set_object_to_api ({ commit }, data) {
      return Axios('/rest/front_setobjects', {
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
    },
    toggle_opts  ({ commit }, data) {
      data.type = 'toggleOpts'
      return Axios('/rest/front_setobjects', {
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
    },
    get_report_from_api ({ commit }) {
      return Axios('/rest/front_getreports', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          report_id: router.currentRoute._value.params.report_id
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORT_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    // Для первичной представленности, модальные окна
    get_store_matrix_data ({ commit }, { storeId, reportId, page, perpage }) {
      let store = 0
      if (storeId) {
        store = storeId
      } else {
        store = router.currentRoute._value.params.id
      }
      const data = {
        id: store,
        report_id: reportId,
        type: 'storedata',
        page: page,
        perpage: perpage
      }
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_STOREDATA_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_report_data_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      const data = {
        id: router.currentRoute._value.params.id,
        report_id: router.currentRoute._value.params.report_id,
        report_data: 1,
        filter: filter,
        filtersdata: filtersdata,
        sort: sort,
        page: page,
        perpage: perpage
      }
      if (router.currentRoute._value.params.elem_id) {
        data.elem_id = router.currentRoute._value.params.elem_id
      }
      return Axios('/rest/front_getreports', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORTS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_ship_data_api ({ commit }, { shipid, page, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'shipdata',
          ship_id: shipid,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_SHIPDATA_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_opts_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'opts',
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPTS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    /* Берем сводные данные по бренду в отчете по сопоставлению товаров ОБЩИЙ */
    get_report_copo_all_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'report_copo_all',
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORT_COPO_ALL', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    /* Берем сводные данные по бренду в отчете по сопоставлению товаров */
    get_report_copo_from_api ({ commit }, { tabledata, filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'report_copo',
          filter: filter,
          filtersdata: filtersdata,
          tabledata: tabledata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORT_COPO', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    /* Берем подробные данные по бренду в отчете по сопоставлению товаров */
    get_report_copo_details_from_api ({ commit }, { tabledata, filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          brand_id: router.currentRoute._value.params.brand_id,
          type: 'report_copo_details',
          filter: filter,
          filtersdata: filtersdata,
          tabledata: tabledata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORT_COPO_DETAILS', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    /* Берем подробные данные по бренду в отчете по сопоставлению товаров */
    get_report_copo_all_details_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          vendor_id: router.currentRoute._value.params.vendor_id,
          type: 'report_copo_all_details',
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_REPORT_COPO_ALL_DETAILS', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    get_msproducts_from_api ({ commit }, { filter, filtersdata, page, sort, perpage }) {
      return Axios('/rest/front_getobjects', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: 'msproducts',
          filter: filter,
          filtersdata: filtersdata,
          sort: sort,
          page: page,
          perpage: perpage
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_MSPRODUCTS', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'home' })
          }
        })
    },
    unset_msproducts ({ commit }) {
      commit('UNSET_MSPRODUCTS')
    },
    unset_ship_data ({ commit }) {
      commit('UNSET_SHIPDATA_TO_VUEX')
    },
    unset_reports_data ({ commit }) {
      commit('UNSET_REPORTS_TO_VUEX')
    },
    unset_akbdotsplan_data ({ commit }) {
      commit('UNSET_AKBDOTSPLAN_VUEX')
    },
    unset_akbpunkts_data ({ commit }) {
      commit('UNSET_AKBPUNKTS')
    },
    unset_akbdots_data ({ commit }) {
      commit('UNSET_AKBDOTS')
    },
    unset_akbpunktsplan_data ({ commit }) {
      commit('UNSET_AKBPUNKTSPLAN')
    },
    unset_bonuses_data ({ commit }) {
      commit('UNSET_BONUSES_VUEX')
    },
    unset_bonus_participants ({ commit }) {
      commit('UNSET_BONUSES_PARTS_VUEX')
    },
    unset_bonus_newplans ({ commit }) {
      commit('UNSET_BONUS_NEWPLANS_VUEX')
    },
    unset_bonus_plans ({ commit }) {
      commit('UNSET_BONUS_PLANS_VUEX')
    },
    unset_docs_data ({ commit }) {
      commit('UNSET_DOCS_VUEX')
    },
    unset_akbsettlements_data ({ commit }) {
      commit('UNSET_AKBSETTLEMENTS')
    },
    unset_bonus_available_stores ({ commit }) {
      commit('UNSET_BONUS_AVAILABLE_STORES')
    },
    unset_plan_data ({ commit }) {
      commit('UNSET_PLAN')
    },
    unset_feeds ({ commit }) {
      commit('UNSET_FEEDS')
    },
    unset_programfiles ({ commit }) {
      commit('UNSET_PROGRAMFILES')
    },
    unset_report_rrc ({ commit }) {
      commit('UNSET_REPORT_RRC')
    },
    unset_report_rrc_data ({ commit }) {
      commit('UNSET_RRC_DATA')
    },
    unset_request ({ commit }) {
      commit('UNSET_REQUESTS')
    },
    unset_matrix_data ({ commit }) {
      commit('UNSET_STOREDATA')
    },
    unset_opts_data ({ commit }) {
      commit('UNSET_OPTS_DATA')
    },
    unset_report_copo ({ commit }) {
      commit('UNSET_REPORT_COPO')
    },
    unset_report_copo_details ({ commit }) {
      commit('UNSET_REPORT_COPO_DETAILS')
    },
    unset_report_copo_all ({ commit }) {
      commit('UNSET_REPORT_COPO_ALL')
    },
    unset_report_copo_all_details ({ commit }) {
      commit('UNSET_REPORT_COPO_ALL_DETAILS')
    }
  },
  mutations: {
    SET_MSPRODUCTS: (state, data) => {
      state.msproducts = data.data
    },
    SET_SHIPDATA_TO_VUEX: (state, data) => {
      state.shipdata = data.data
    },
    UNSET_SHIPDATA_TO_VUEX: (state) => {
      state.shipdata = []
    },
    SET_REPORT_RRC_DATA_TO_VUEX: (state, data) => {
      state.getrrcdata = data.data
    },
    SET_REPORT_RRC_TO_VUEX: (state, data) => {
      state.getrrcreport = data.data
    },
    UNSET_REPORT_RRC: (state) => {
      state.getrrcreport = []
    },
    SET_FEEDS_TO_VUEX: (state, data) => {
      state.feeds = data.data
    },
    SET_PROGRAMFILES_TO_VUEX: (state, data) => {
      state.programfiles = data.data
    },
    UNSET_MSPRODUCTS: (state) => {
      state.msproducts = []
    },
    UNSET_FEEDS: (state) => {
      state.feeds = []
    },
    UNSET_PROGRAMFILES: (state) => {
      state.programfiles = []
    },
    SET_MATRIXES_TO_VUEX: (state, data) => {
      state.matrix = data.data
    },
    SET_STOREDATA_TO_VUEX: (state, data) => {
      state.getstoredata = data.data
    },
    SET_PLAN_TO_VUEX: (state, data) => {
      state.plan = data.data
    },
    SET_BRANDS_TO_VUEX: (state, data) => {
      state.brands = data.data
    },
    SET_AVAILABLE_BRANDS_TO_VUEX: (state, data) => {
      state.available_brands = data.data
    },
    SET_REPORTS_TO_VUEX: (state, data) => {
      state.reports = data.data
    },
    SET_REPORT_TO_VUEX: (state, data) => {
      state.report = data.data
    },
    SET_REPORTTYPES_TO_VUEX: (state, data) => {
      state.reporttypes = data.data
    },
    SET_AKBDOTSPLAN_TO_VUEX: (state, data) => {
      state.akbdotsplan = data.data
    },
    SET_AKBPUNKTSPLAN_TO_VUEX: (state, data) => {
      state.akbpunktsplan = data.data
    },
    SET_BONUS_TO_VUEX: (state, data) => {
      if (data.data.date_from && data.data.date_to) {
        data.data.dates = [
          new Date(data.data.date_from),
          new Date(data.data.date_to)
        ]
      }
      state.bonus = data.data
    },
    SET_BONUS_PART_TO_VUEX: (state, data) => {
      state.bonus_part = data.data
    },
    SET_BONUS_NEWPLANS_TO_VUEX: (state, data) => {
      state.bonus_newplans = data.data
    },
    SET_BONUS_PLANS_TO_VUEX: (state, data) => {
      state.bonus_plans = data.data
    },
    UNSET_BONUS_NEWPLANS_VUEX: (state, data) => {
      state.bonus_newplans = []
    },
    UNSET_BONUS_PLANS_VUEX: (state, data) => {
      state.bonus_plans = []
    },
    UNSET_BONUSES_PARTS_VUEX: (state, data) => {
      state.bonus_part = []
    },
    UNSET_REPORTS_TO_VUEX: (state) => {
      state.reports = []
    },
    UNSET_PLAN: (state) => {
      state.plan = []
    },
    UNSET_STOREDATA: (state) => {
      state.getstoredata = []
    },
    SET_AKB_TO_VUEX: (state, data) => {
      state.akbdata = data.data
    },
    SET_AKBPUNKTS_TO_VUEX: (state, data) => {
      state.akbpunkts = data.data
    },
    SET_BONUSES_TO_VUEX: (state, data) => {
      state.bonuses = data.data
    },
    SET_DOCS_TO_VUEX: (state, data) => {
      state.docs = data.data
    },
    SET_DOCSSTATUS_TO_VUEX: (state, data) => {
      state.docsstatus = data.data.items
    },
    SET_CARDSTATUS_TO_VUEX: (state, data) => {
      state.cardstatus = data.data.items
    },
    SET_SHIPPINGSTATUSES_TO_VUEX: (state, data) => {
      state.shipping_statuses = data.data.items
    },
    UNSET_AKBDOTSPLAN_VUEX: (state) => {
      state.akbdotsplan = []
    },
    UNSET_AKBPUNKTSPLAN: (state) => {
      state.akbpunktsplan = []
    },
    UNSET_BONUSES_VUEX: (state) => {
      state.bonuses = []
    },
    UNSET_DOCS_VUEX: (state) => {
      state.docs = []
    },
    UNSET_AKBPUNKTS: (state) => {
      state.akbpunkts = []
    },
    UNSET_AKBDOTS_VUEX: (state) => {
      state.akbdots = []
    },
    SET_AV_ST_TO_VUEX: (state, data) => {
      state.stores = data.data
    },
    SET_AKBSETTLEMENTS_TO_VUEX: (state, data) => {
      state.akbsettlements = data.data
    },
    SET_BONUS_AV_ST_TO_VUEX: (state, data) => {
      state.bonus_stores = data.data
    },
    UNSET_AKBSETTLEMENTS: (state) => {
      state.akbsettlements = []
    },
    UNSET_BONUS_AVAILABLE_STORES: (state) => {
      state.bonus_stores = []
    },
    UNSET_RRC_DATA: (state) => {
      state.getrrcdata = []
    },
    SET_OPTS_TO_VUEX: (state, data) => {
      state.opts = data.data
    },
    UNSET_OPTS_DATA: (state) => {
      state.opts = []
    },
    SET_REQUESTS: (state, data) => {
      state.getrequests = data.data
    },
    UNSET_REQUESTS: (state) => {
      state.getrequests = []
    },
    SET_REPORT_COPO: (state, data) => {
      state.report_copo = data.data
    },
    SET_REPORT_COPO_DETAILS: (state, data) => {
      state.report_copo_details = data.data
    },
    UNSET_REPORT_COPO: (state) => {
      state.report_copo = []
    },
    UNSET_REPORT_COPO_DETAILS: (state) => {
      state.report_copo_details = []
    },
    SET_REPORT_COPO_ALL: (state, data) => {
      state.report_copo_all = data.data
    },
    SET_REPORT_COPO_ALL_DETAILS: (state, data) => {
      state.report_copo_all_details = data.data
    },
    UNSET_REPORT_COPO_ALL: (state) => {
      state.report_copo_all = []
    },
    UNSET_REPORT_COPO_ALL_DETAILS: (state) => {
      state.report_copo_all_details = []
    }
  },
  getters: {
    getakbdata (state) {
      return state.akbdata
    },
    msproducts (state) {
      return state.msproducts
    },
    getmatrixes (state) {
      return state.matrix
    },
    getbrands (state) {
      return state.brands
    },
    available_brands (state) {
      return state.available_brands
    },
    getreports (state) {
      return state.reports
    },
    getreport (state) {
      return state.report
    },
    bonus (state) {
      return state.bonus
    },
    getbonuses (state) {
      return state.bonuses
    },
    bonus_participants (state) {
      return state.bonus_part
    },
    bonus_newplans (state) {
      return state.bonus_newplans
    },
    bonus_plans (state) {
      return state.bonus_plans
    },
    getdocs (state) {
      return state.docs
    },
    getdocsstatus (state) {
      return state.docsstatus
    },
    getcardstatus (state) {
      return state.cardstatus
    },
    available_stores (state) {
      return state.stores
    },
    getakbpunkts (state) {
      return state.akbpunkts
    },
    getakbsettlements (state) {
      return state.akbsettlements
    },
    getakbdotsplan (state) {
      return state.akbdotsplan
    },
    getakbpunktsplan (state) {
      return state.akbpunktsplan
    },
    reporttypes (state) {
      return state.reporttypes
    },
    bonus_available_stores (state) {
      return state.bonus_stores
    },
    getplan (state) {
      return state.plan
    },
    getstoredata (state) {
      return state.getstoredata
    },
    feeds (state) {
      return state.feeds
    },
    programfiles (state) {
      return state.programfiles
    },
    getrrcreport (state) {
      return state.getrrcreport
    },
    getrrcdata (state) {
      return state.getrrcdata
    },
    getrequests (state) {
      return state.getrequests
    },
    shipping_statuses (state) {
      return state.shipping_statuses
    },
    getshipdata (state) {
      return state.shipdata
    },
    opts (state) {
      return state.opts
    },
    report_copo (state) {
      return state.report_copo
    },
    report_copo_details (state) {
      return state.report_copo_details
    },
    report_copo_all (state) {
      return state.report_copo_all
    },
    report_copo_all_details (state) {
      return state.report_copo_all_details
    }
  }
}
