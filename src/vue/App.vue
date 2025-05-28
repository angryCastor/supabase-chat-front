<script lang="ts" setup>
import { ioc } from '@/di'
import AuthState from '@/domain/models/auth/AuthState'
import AuthCubit from '@/presentation/auth/AuthCubit'
import DynamicDialog from 'primevue/dynamicdialog'
import { useRouter } from 'vue-router'
import { Subject } from 'rxjs'
import Toast from './shared/components/volt/Toast.vue'

const authCubit = ioc.get(AuthCubit)
const broadcastSteam = new Subject<AuthState>()
const router = useRouter()

authCubit.stream.subscribe(broadcastSteam)

broadcastSteam.subscribe((state) => {
  if (state == AuthState.LoggedOut) {
    router.push('/login')
  }
})
</script>

<template>
  <DynamicDialog />
  <Toast />
  <RouterView />
</template>
