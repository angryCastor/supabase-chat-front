import { ioc } from '@/di'
import AuthState from '@/domain/models/auth/AuthState'
import AuthCubit from '@/presentation/auth/AuthCubit'
import type { RouteLocationRaw } from 'vue-router'

export default function allowLoginMiddleware(): void | Error | boolean | RouteLocationRaw {
  const cubit = ioc.get(AuthCubit)
  if (cubit.state == AuthState.LoggedOut) {
    return { path: '/login' }
  }
}
