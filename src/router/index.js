import MainLoyout from '../loyouts/MainLoyout.vue'
import Home from '../pages/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: MainLoyout,
        props: true,
        children: [{
            path: '',
            children: [{
              path: '',
              name: 'org',
              props: true,
              label: 'Организации',
              meta: {
                breadcrumb: {
                  label: 'Организации'
                }
              },
              component: Home
            }]
        }]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
  
export default router