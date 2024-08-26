import MainLoyout from "../loyouts/MainLoyout.vue";
import ProfileOrganization from "../pages/ProfileOrganization.vue";
import ProfileProducts from '../pages/ProfileProducts.vue'
import ProfileStoreProducts from '../pages/ProfileStoreProducts.vue'
// import ReportCopoAll from '../pages/store/report_copo_all'
// import ReportCopoAllDetails from '../pages/store/report_copo_all_details'
import ReportCopo from '../pages/store/report_copo.vue'
import ReportCopoDetails from '../pages/store/report_copo_details.vue'
import Home from "../pages/Home.vue";
import notFound from "../pages/notFound.vue";
import { createRouter, createWebHistory } from "vue-router";
import ProfileShipping from "../pages/ProfileShipping.vue";

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
            meta: {
              breadcrumb: {
                label: "Главная",
              },
            },
            component: Home,
          },
          {
            path: "",
            beforeEnter: (to, from, next) => {
              if (localStorage.getItem('user')) {
                next()
              } else {
                next({ name: 'main' })
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
                        path: ":store_id",
                        name: "store",
                        props: true,
                        label: "Товары на складе",
                        component: ProfileStoreProducts,
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
                    path: 'shipping_test',
                    component: ProfileShipping
                  }
                ]
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: notFound
  }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
