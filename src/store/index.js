import Vuex from 'vuex'

import user from './user'
import products from './products'
import product from './product'
import organizations from './organizations'
import organization from './organization'
import dilers from './dilers'
import orders from './orders'
import order from './order'
import shipping from './shipping'
import topsales from './topsales'
import available from './available'
import present from './present'
import regions from './regions'
import catalog from './catalog'
import vendors from './vendors'
import stores from './stores'
import warehouses from './warehouses'
import matrixs from './matrixs'
import matrix from './matrix'
import getAvailableProd from './get_available_prod'
import opt from './opt'
import training from './training'
import returns from './returns'
import allorganizations from './allOrganizations'
import sales from './sales'
import bonus from './bonus'
import org from './org'

export default new Vuex.Store({
  modules: {
    user,
    products,
    product,
    organizations,
    organization,
    dilers,
    orders,
    order,
    shipping,
    topsales,
    available,
    present,
    regions,
    catalog,
    vendors,
    stores,
    warehouses,
    matrixs,
    matrix,
    getAvailableProd,
    opt,
    training,
    returns,
    allorganizations,
    sales,
    bonus,
    org
  }
})
