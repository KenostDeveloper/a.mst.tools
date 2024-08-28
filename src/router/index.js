import MainLoyout from "../loyouts/MainLoyout.vue";
import ProfileOrganization from "../pages/ProfileOrganization.vue";
import ProfileProducts from "../pages/ProfileProducts.vue";
import ProfileStoreProducts from "../pages/ProfileStoreProducts.vue";
// import ReportCopoAll from '../pages/store/report_copo_all'
// import ReportCopoAllDetails from '../pages/store/report_copo_all_details'
import ReportCopo from "../pages/store/report_copo.vue";
import OrgProfile from '../pages/OrgProfile.vue'
import ProfileProduct from '../pages/ProfileProduct.vue'
import ReportCopoDetails from "../pages/store/report_copo_details.vue";
import Home from "../pages/Home.vue";
import notFound from "../pages/notFound.vue";
import { createRouter, createWebHistory } from "vue-router";
import ProfileShipping from "../pages/ProfileShipping.vue";
import Actions from '../pages/b2c/Actions.vue'
import ActionEdit from '../pages/b2c/ActionEdit.vue'
import Sales from '../pages/b2b/Sales.vue'
import SalesEdit from '../pages/b2b/SalesEdit.vue'
import ComplectAdd from '../pages/b2b/complects/ComplectAdd.vue'
import ComplectEdit from '../pages/b2b/complects/ComplectEdit.vue'
import ProfilePurchases from '../pages/opt/ProfilePurchases.vue'
import PurchasesCatalog from '../pages/opt/PurchasesCatalog.vue'
import PurchasesSearch from '../pages/opt/Search.vue'
import Promotion from '../pages/opt/Promotion/Promotion.vue'
import ProfileClients from "../pages/ProfileClients.vue";
import ProfileVendors from '../pages/ProfileVendors.vue'
import MyOrders from '../pages/MyOrders.vue'
import MyOrder from '../pages/MyOrder.vue'
import ProfileStatistics from '../pages/ProfileStatistics.vue'
import ProfileStoreStatistics from '../pages/ProfileStoreStatistics.vue'
import ProfileDiscounts from '../pages/ProfileDiscounts.vue'


const routes = [
  {
    path: "/",
    name: "home",
    component: MainLoyout,
    props: true,
    children: [
      {
        path: "",
        children: [
          {
            path: "",
            name: "main",
            props: true,
            label: "Главная",
            component: Home,
          },
          {
            path: "",
            beforeEnter: (to, from, next) => {
              if (localStorage.getItem("user")) {
                next();
              } else {
                next({ name: "main" });
              }
            },
            children: [
              {
                path: ":id",
                children: [
                  {
                    path: "",
                    name: "org",
                    props: true,
                    label: "Организация",
                    component: ProfileOrganization,
                  },
                  {
                    path: "stores",
                    children: [
                      {
                        path: "",
                        name: "stores",
                        props: true,
                        label: "Товары",
                        component: ProfileProducts,
                      },
                      {
                        path: "",
                        children: [
                          {
                            path: ":store_id",
                            children: [
                              {
                                path: "",
                                name: "store",
                                props: true,
                                label: "Товары на складе",
                                component: ProfileStoreProducts,
                              },
                              {
                                path: 'report',
                                children: [{
                                  path: '',
                                  name: 'report_copo_store',
                                  props: true,
                                  label: 'Отчет по сопоставлению',
                                  component: ReportCopo
                                }, {
                                  path: ':brand_id',
                                  name: 'report_copo_details_store',
                                  label: 'Отчет по бренду',
                                  component: ReportCopoDetails
                                }]
                              },
                              {
                                path: ":product_id",
                                name: "org_product",
                                props: true,
                                label: "Товар",
                                component: ProfileProduct,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: 'report',
                    children: [{
                      path: '',
                      name: 'report_copo',
                      props: true,
                      label: 'Отчет по сопоставлению',
                      component: ReportCopo
                    }, {
                      path: ':brand_id',
                      name: 'report_copo_details',
                      label: 'Отчет по бренду',
                      component: ReportCopoDetails
                    }]
                  },
                  {
                    path: 'b2c',
                    children: [{
                      path: '',
                      name: 'b2c',
                      props: true,
                      label: 'Акции',
                      component: Actions
                    }, {
                      path: 'add',
                      name: 'org_action_add',
                      props: true,
                      label: 'Добавление акции',
                      component: ActionEdit
                    }, {
                      path: ':action_id',
                      name: 'org_action_edit',
                      props: true,
                      label: 'Редактирование акции',
                      component: ActionEdit
                    }]
                  },
                  {
                    path: 'b2b',
                    children: [{
                      path: '',
                      name: 'b2b',
                      props: true,
                      label: 'Акции',
                      component: Sales
                    }, {
                      path: 'add',
                      name: 'org_sales_add',
                      props: true,
                      label: 'Добавление акции',
                      component: SalesEdit
                    }, {
                      path: ':sales_id',
                      name: 'org_sales_edit',
                      props: true,
                      label: 'Редактирование акции',
                      component: SalesEdit
                    }]
                  },
                  {
                    path: 'complects',
                    children: [{
                      path: 'add',
                      name: 'complect_add',
                      props: true,
                      label: 'Добавление комлекта',
                      component: ComplectAdd
                    },
                    {
                      path: ':complect_id',
                      name: 'complect_edit',
                      props: true,
                      label: 'Редактирование комлекта',
                      component: ComplectEdit
                    }]
                  },
                  {
                    path: 'opt',
                    name: 'purchases',
                    children: [{
                      path: '',
                      name: 'purchases_home',
                      component: ProfilePurchases,
                      meta: {
                        breadcrumb: {
                          label: 'Закупки'
                        }
                      }
                    }, {
                      path: ':category_id',
                      name: 'purchases_catalog',
                      component: PurchasesCatalog,
                      meta: {
                        breadcrumb: {
                          label: 'Каталог'
                        }
                      }
                    }, {
                      path: 'action/:action',
                      name: 'promotion',
                      component: Promotion
                    }, {
                      path: 'warehouses/:warehouse_id',
                      children: [{
                        path: '',
                        name: 'purchases_catalog_warehouse',
                        component: PurchasesCatalog,
                        meta: {
                          breadcrumb: {
                            label: 'Каталог оптовика',
                            link: 'warehouse_id'
                          }
                        }
                      },
                      {
                        path: ':warehouse_cat_id',
                        children: [{
                          path: '',
                          name: 'org_opt_waregouse_category',
                          label: 'Мой оптовик',
                          component: PurchasesCatalog
                        }]
                      }]
                    }, {
                      path: 'search/:search',
                      name: 'opt_search',
                      component: PurchasesSearch
                    }]
                  },
                  {
                    path: 'settings',
                    name: 'org_settings',
                    component: OrgProfile
                  },
                  {
                    path: 'shipments',
                    name: 'shipments',
                    component: ProfileShipping
                  },
                  {
                    path: 'discounts',
                    name: 'discounts',
                    component: ProfileDiscounts
                  },
                  {
                    path: 'statistics',
                    children: [{
                      path: '',
                      name: 'statistics',
                      component: ProfileStatistics
                    },
                    {
                      path: ':store_id',
                      name: 'statistics_id',
                      component: ProfileStoreStatistics
                    }  
                    ]
                  },
                  {
                    path: 'orders',
                    children: [{
                      path: 'my',
                      children: [{
                        path: '',
                        name: 'my_orders',
                        component: MyOrders
                      },
                      {
                        path: ':order_id',
                        name: 'my_orders_id',
                        component: MyOrder
                      }]
                    }]
                    
                  },
                  {
                    path: 'vendors',
                    name: 'vendors',
                    component: ProfileVendors
                  },
                  {
                    path: 'clients',
                    name: 'clients',
                    component: ProfileClients
                  }
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: notFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
