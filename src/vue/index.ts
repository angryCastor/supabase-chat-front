import { createApp } from 'vue'
import '@/vue/assets/base.css'
import 'primeicons/primeicons.css'
import App from '@/vue/App.vue'
import PrimeVue from 'primevue/config'
import { ioc, vueRouterKey } from '@/di'
import type { Router } from 'vue-router'
import { ru } from 'primelocale/ru.json'
import ToastService from 'primevue/toastservice'
import AuthCubit from '@/presentation/auth/AuthCubit'
import Tooltip from 'primevue/tooltip'
import DialogService from 'primevue/dialogservice'
import pt from './shared/pt'
import mobileHeightScreenFix from './shared/utils/mobileHeightScreenFix'

const router = ioc.get<Router>(vueRouterKey)
const authCubit = ioc.get(AuthCubit)

export default async function () {
  mobileHeightScreenFix()

  await authCubit.initialize()

  createApp(App)
    .use(router)
    .use(ToastService)
    .use(DialogService)
    .use(PrimeVue, {
      unstyled: true,
      locale: ru,
      pt: pt,
    })
    .directive('tooltip', Tooltip)
    .mount('#app')
}
