import allowLoginMiddleware from '@/vue/services/middleware/allowLoginMiddleware'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./HomePage.vue'),
    beforeEnter: [allowLoginMiddleware],
    children: [
      {
        path: '',
        component: () => import('./pages/distribution/DistributionPage.vue'),
      },
      { path: ':id', component: () => import('./pages/chat/ChatPage.vue') },
    ],
  },
]

export { routes }
