import Axios from 'axios'
import router from '../router'
import { transformCatalog } from '../utils/helpers'
import Toast from 'primevue/toast';

export default {
  state: {
    mainpage: [],
    optcatalog: [],
    optcatalogtree: [],
    optvendors: [],
    optproducts: [],
    optbasket: [],
    optbasketall: [],
    optorder: [],
    optcomplects: [],
    optproductsfile: [],
    optwarehouse: {
      name_short: ''
    },
    oprprices: [],
    oprpricesremain: [],
    my_orders: [],
    optcatalogwarehouse: [],
    warehouse_basket: [],
  },
  actions: {
    set_vendors_to_api ({ commit }, data) {
      return Axios('/rest/front_setobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
          // console.log(data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    toggle_opts_visible ({ commit }, data) {
      data.type = 'toggleOptsVisible'
      return Axios('/rest/front_setobjects', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
          // console.log(data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    opt_order_api ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
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
    opt_api ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          // commit('SET_MATRIX_TO_VUEX', response.data)
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
    get_opt_order_api ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_OPT_ORDER_TO_VUEX', response.data)
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
    get_opt_my_order_api ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('GET_OPT_MY_ORDER_TO_VUEX', response.data)
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
    get_opt_mainpage_from_api ({ commit }) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: {
          id: router.currentRoute._value.params.id,
          type: router.currentRoute._value.params.type,
          action: 'get/mainpage'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_MAINPAGE_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_opt_catalog_from_api ({ commit }) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: {
          id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
          //warehouse_id: router.currentRoute._value.params.warehouse_id,
          action: 'get/catalog'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          response.data.data = transformCatalog(response.data.data);
          commit('SET_OPT_CATALOG_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_opt_warehouse_catalog_from_api ({ commit }) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: {
          id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
          //warehouse_id: router.currentRoute._value.params.warehouse_id,
          warehouse: true,
          action: 'get/catalog'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_WAREHOUSE_CATALOG_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_opt_catalog_tree_from_api ({ commit }) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: {
          id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
          action: 'get/catalog'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_CATALOG_TREE_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_opt_warehouse ({ commit }) {
      const data = {
        id: router.currentRoute._value.params.id,
        warehouse_id: router.currentRoute._value.params.warehouse_id,
        action: 'get/warehouse'
      }
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_WAREHOUSE_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_opt_vendors_from_api ({ commit }, sendData) {
      const data = {
        id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
        type: router.currentRoute._value.params.type,
        action: 'get/vendors'
      }
      if (sendData) {
        if (Object.prototype.hasOwnProperty.call(sendData, 'filter')) {
          data.filter = sendData.filter
        }
      }
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_VENDORS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    get_opt_products_from_api ({ commit }, { page, perpage }) {
      let cat = 0
      if (router.currentRoute._value.params.warehouse_id && !router.currentRoute._value.params.warehouse_cat_id) {
        cat = 'all'
      }
      if (!router.currentRoute._value.params.warehouse_id && !router.currentRoute._value.params.warehouse_cat_id) {
        cat = router.currentRoute._value.params.category_id
      }
      let req = null;
      if(router.currentRoute._value.params.req){
        req = router.currentRoute._value.params.req;
        cat = 'all'
      }
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: {
          id: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id_org_from : router.currentRoute._value.params.id,
          id_org_from: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? router.currentRoute._value.params.id : null,
          type: router.currentRoute._value.params.type,
          category_id: cat,
          org_w_id: router.currentRoute._value.params.org_w_id,
          warehouse_id: router.currentRoute._value.params.warehouse_id,
          warehouse_cat_id: router.currentRoute._value.params.warehouse_cat_id,
          search: router.currentRoute._value.params.search,
          extended_name: router?.currentRoute?._value.matched[4]?.name == 'purchases_offer' ? 'offer' : 'cart',
          page: page,
          req: req,
          perpage: perpage,
          action: 'get/products'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_PRODUCTS_TO_VUEX', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    busket_from_api ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BUSKET_TO_VUEX', response.data)
          return response
        })
        .catch(error => {
          // console.log(error)
          if (error?.response?.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    opt_get_complects ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_COMPLECTS', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    opt_upload_products_file ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_PRODUCT_FILE', response.data.data)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    opt_get_prices ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_PRICES', response.data.data)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    opt_get_remain_prices ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_OPT_REMAIN_PRICES', response.data.data)
          return response
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
    opt_warehouse_basket ({ commit }, data) {
      return Axios('/rest/front_opt', {
        method: 'POST',
        data: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then((response) => {
          commit('SET_BASKET_WAREHOUSE', response.data)
        })
        .catch(error => {
          if (error.response.status === 403) {
            localStorage.removeItem('user')
            router.push({ name: 'main' })
          }
        })
    },
  },
  mutations: {
    SET_OPT_MAINPAGE_TO_VUEX: (state, data) => {
      state.mainpage = data.data
    },
    SET_OPT_CATALOG_TO_VUEX: (state, data) => {
      state.optcatalog = data.data
    },
    SET_OPT_WAREHOUSE_CATALOG_TO_VUEX: (state, data) => {
      state.optcatalogwarehouse = data.data
    },
    
    SET_OPT_CATALOG_TREE_TO_VUEX: (state, data) => {
      state.optcatalogtree = data.data
    },
    SET_OPT_VENDORS_TO_VUEX: (state, data) => {
      state.optvendors = data.data
    },
    SET_OPT_WAREHOUSE_TO_VUEX: (state, data) => {
      state.optwarehouse = data.data
    },
    SET_OPT_PRODUCTS_TO_VUEX: (state, data) => {
      state.optproducts = data.data
    },
    GET_OPT_MY_ORDER_TO_VUEX: (state, data) => {
      state.my_orders = data.data
    },
    SET_OPT_PRODUCT_FILE: (state, data) => {
      state.optproductsfile = data.data
    },
    SET_OPT_PRICES: (state, data) => {
      state.oprprices = data
    },
    SET_OPT_REMAIN_PRICES: (state, data) => {
      state.oprpricesremain = data
    },
    SET_OPT_PRODUCT_TO_VUEX: (state, data) => {
      if (Object.keys(state.optproducts).length) {
        for (let i = 0; i < Object.keys(state.optproducts.items).length; i++) {
          if (state.optproducts.items[i].remain_id == data.remain_id) {
            for (let j = 0; j < Object.keys(state.optproducts.items[i].stores).length; j++) {
              if (state.optproducts.items[i].stores[j].store_id === data.store_id) {
                for (let h = 0; h < Object.keys(state.optproducts.items[i].stores[j].actions).length; h++) {
                  state.optproducts.items[i].stores[j].price = data.data.price
                  state.optproducts.items[i].stores[j].delay = data.data.delay
                  state.optproducts.items[i].stores[j].basket = data.data.basket
                  state.optproducts.items[i].stores[j].action = data.data
                }
              }
            }
          }
        }
      }
    },
    SET_OPT_PRODUCTS_MUTATION_TO_VUEX: (state, data) => {
      // console.log('SET_OPT_PRODUCTS_MUTATION_TO_VUEX')
      if (state.optproducts.length) {
        for (let i = 0; i < Object.keys(state.optproducts.items).length; i++) {
          if (state.optproducts.items[i].remain_id === data.remain_id) {
            for (let j = 0; j < Object.keys(state.optproducts.items[i].stores).length; j++) {
              if (state.optproducts.items[i].stores[j].store_id === data.store_id) {
                // console.log(data.complect_id)
                state.optproducts.items[i].stores[j].basket.availability = true
                state.optproducts.items[i].stores[j].basket.count = data.count
              }
            }
          }
        }
      }
    },
    SET_OPT_COMPLECT_MUTATION_TO_VUEX: (state, data) => {
      // console.log('SET_OPT_COMPLECT_MUTATION_TO_VUEX', state.optproducts.length)
      if (state.optproducts.length) {
        for (let i = 0; i < Object.keys(state.optproducts.items).length; i++) {
          for (let j = 0; j < Object.keys(state.optproducts.items[i].complects).length; j++) {
            for (let h = 0; h < Object.keys(state.optproducts.items[i].complects[j]).length; h++) {
              if (state.optproducts.items[i].complects[j][h].complect_id === data.complect_id) {
                state.optproducts.items[i].complects[j][h].basket.availability = true
                state.optproducts.items[i].complects[j][h].basket.count = data.count
              }
            }
          }
        }
      }
    },
    SET_BUSKET_TO_VUEX: (state, data) => {
      if(data.data.success){
        state.optbasket = data.data.data
        state.optbasketall = data.data.data
        if(data.data.data.props.warehouse != 'all'){
          //Корзина склада
          state.optbasket = data.data.data
        } else {
          //Вся корзина
          state.optbasketall = data.data.data
        }
      }
    },
    GET_OPT_ORDER_TO_VUEX: (state, data) => {
      state.optorder = data.data
    },
    SET_OPT_COMPLECTS: (state, data) => {
      state.optcomplects = data.data
    },
    SET_BASKET_WAREHOUSE: (state, data) => {
      state.warehouse_basket = data.data
    },
  },
  getters: {
    mainpage (state) {
      return state.mainpage
    },
    optcatalog (state) {
      return state.optcatalog
    },
    optvendors (state) {
      return state.optvendors
    },
    optwarehouse (state) {
      return state.optwarehouse
    },
    optproducts (state) {
      return state.optproducts
    },
    optbasket (state) {
      return state.optbasket
    },
    optbasketall (state) {
      return state.optbasketall
    },
    optorder (state) {
      return state.optorder
    },
    optcomplects (state) {
      return state.optcomplects
    },
    optproductsfile (state) {
      return state.optproductsfile
    },
    oprprices (state) {
      return state.oprprices
    },
    oprpricesremain (state) {
      return state.oprpricesremain
    },
    optcatalogtree (state) {
      return state.optcatalogtree
    },
    my_orders (state) {
      return state.my_orders
    },
    optcatalogwarehouse (state) {
      return state.optcatalogwarehouse
    },
    warehouse_basket (state) {
      return state.warehouse_basket
    },
  }
}
