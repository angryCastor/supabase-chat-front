<script setup lang="ts">
import { ioc } from '@/di'
import AuthCubit from '@/presentation/auth/AuthCubit'
import UserCubit from '@/presentation/user/UserCubit'
import { useCubitState } from '@/vue/common/useCubitState'
import ptTooltip from '@/vue/shared/pt/ptTooltip'
import stringToHLS from '@/vue/shared/utils/stringToHLS'
import { computed, onMounted } from 'vue'

const userCubit = ioc.get(UserCubit)
const authCubit = ioc.get(AuthCubit)

const state = useCubitState(userCubit)

const userColor = computed(() => {
  if (state.value.user) {
    return stringToHLS(state.value.user.id)
  }

  return 'transparent'
})

onMounted(() => {
  userCubit.fetchMe()
})
</script>

<template>
  <div class="p-2 relative">
    <div v-if="state.loading"></div>
    <div v-else>
      <div class="flex items-center">
        <div
          class="w-20 h-20 rounded-full flex justify-center items-center"
          :style="{
            background: userColor,
          }"
        >
          <div class="text-3xl">{{ state.user?.shortName }}</div>
        </div>
        <div class="ml-2 text-xl">{{ state.user?.name }}</div>
      </div>

      <div
        class="absolute top-2 right-2 cursor-pointer"
        v-tooltip="{ value: 'Выйти', pt: ptTooltip }"
        @click="() => authCubit.signOut()"
      >
        <i class="pi pi-sign-out"></i>
      </div>
    </div>
  </div>
</template>
