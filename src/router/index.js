import MainLoyout from "../loyouts/MainLoyout.vue";
import ProfileOrganization from "../pages/ProfileOrganization.vue";
import Home from "../pages/Home.vue";
import notFound from '../pages/notFound.vue'
import { createRouter, createWebHistory } from "vue-router";

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
            path: "/org",
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
                children: [{
                  path: "",
                  name: "org",
                  props: true,
                  label: "Организация",
                  component: ProfileOrganization,
                  meta: {
                    breadcrumb: {
                      label: "Название организации",
                      link: "store_id",
                    },
                  },
                },
                {
                  path: "test",
                  name: "test",
                  props: true,
                  label: "Организация",
                  component: ProfileOrganization,
                  meta: {
                    breadcrumb: {
                      label: "Название организации",
                      link: "store_id",
                    },
                  },
                }]
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
