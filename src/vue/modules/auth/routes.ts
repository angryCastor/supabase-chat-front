import allowAnonymousMiddleware from '@/vue/services/middleware/allowAnonymousMiddleware'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('./LoginPage.vue'),
    beforeEnter: [allowAnonymousMiddleware],
  },
  {
    path: '/registration',
    component: () => import('./RegistrationPage.vue'),
    beforeEnter: [allowAnonymousMiddleware],
  },
]

export { routes }
