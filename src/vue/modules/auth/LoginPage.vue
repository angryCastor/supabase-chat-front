<script lang="ts" setup>
import { ioc } from '@/di'
import LoginCubit from '@/presentation/auth/login/LoginCubit'
import { useCubitState } from '@/vue/common/useCubitState'
import { watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import TextFiled from '@/vue/shared/components/form/TextFiled.vue'
import PasswordField from '@/vue/shared/components/form/PasswordField.vue'
import Button from '@/vue/shared/components/volt/Button.vue'

const cubit = ioc.get(LoginCubit)
const state = useCubitState(cubit)
const toast = useToast()
const router = useRouter()

watch(
  () => state.value.error,
  (value) => {
    if (value) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: value,
        life: 3000,
      })
    }
  },
)

watch(
  () => state.value.success,
  (value) => {
    if (value) {
      router.push('/')
    }
  },
)
</script>

<template>
  <div class="flex justify-center items-center" style="min-height: calc(var(--vh, 1vh) * 100)">
    <form class="max-w-80 w-screen p-4" @submit.prevent="() => cubit.login()">
      <h1 class="text-center text-2xl">Вход в систему</h1>
      <div class="mt-4">
        <TextFiled
          id="email"
          label="E-mail"
          type="email"
          :error="state.email.dirty ? state.errors.email : undefined"
          :loading="state.loading"
          :value="state.email.value"
          @update:model-value="(e) => cubit.changeEmail(e as string)"
        />
        <PasswordField
          class="mt-2"
          id="password"
          label="Пароль"
          :error="state.password.dirty ? state.errors.password : undefined"
          :loading="state.loading"
          :feedback="false"
          :value="state.password.value"
          toggle-mask
          @update:model-value="(e) => cubit.changePassword(e as string)"
        />
        <div class="card mt-4">
          <Button type="submit" :loading="state.loading" class="w-full" label="Войти" />
        </div>
        <div class="card mt-2 text-center">
          <RouterLink class="text-primary hover:text-primary-700" to="/registration">
            Регистрация
          </RouterLink>
        </div>
      </div>
    </form>
  </div>
</template>
