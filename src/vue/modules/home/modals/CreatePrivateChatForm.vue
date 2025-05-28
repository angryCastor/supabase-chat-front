<script lang="ts" setup>
import { ioc } from '@/di'
import type User from '@/domain/models/user/user'
import CreatePrivateChatCubit from '@/presentation/chat/createPrivateChat/CreatePrivateChatCubit'
import { useCubitState } from '@/vue/common/useCubitState'
import LabelField from '@/vue/shared/components/form/LabelField.vue'
import AutoComplete from '@/vue/shared/components/volt/AutoComplete.vue'
import Button from '@/vue/shared/components/volt/Button.vue'
import stringToHLS from '@/vue/shared/utils/stringToHLS'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { useToast } from 'primevue/usetoast'
import { computed, inject, watch, type Ref } from 'vue'

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const cubit = ioc.get(CreatePrivateChatCubit)
const state = useCubitState(cubit)
const toast = useToast()

const suggestions = computed(() => state.value.suggestions as User[])

const close = (chatId?: number) => {
  dialogRef?.value.close({ chatId })
}

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
  () => state.value.successChatId,
  (value) => {
    if (value) {
      close(value)
    }
  },
)
</script>

<template>
  <div class="relative">
    <div class="text-center text-2xl">Новый чат</div>
    <form action="" class="mt-4" @submit.prevent="() => cubit.submit()">
      <LabelField id="searchUser" label="Поиск пользователя">
        <AutoComplete
          :model-value="state.userTarget"
          @update:model-value="(value) => cubit.selectUser(value)"
          :suggestions="suggestions"
          id="searchUser"
          option-label="name"
          data-key="id"
          :disabled="state.submitLoading"
          @complete="({ query }) => cubit.searchUsers(query)"
        >
          <template #option="slotProps">
            <div class="flex items-center">
              <div
                class="w-10 h-10 flex justify-center items-center rounded-full shrink-0"
                :style="{ background: stringToHLS(slotProps.option.id) }"
              >
                {{ slotProps.option.shortName }}
              </div>
              <div class="ml-2">
                <div class="text-sm">{{ slotProps.option.name }}</div>
                <div class="text-xs italic text-surface-400">
                  {{ slotProps.option.email }}
                </div>
              </div>
            </div>
          </template>
        </AutoComplete>
      </LabelField>
      <div class="card mt-4">
        <Button
          type="submit"
          :disabled="!state.userTarget"
          :loading="state.submitLoading"
          class="w-full"
          label="Добавить"
        />
      </div>
    </form>
    <div class="absolute top-0 right-0 cursor-pointer" @click="() => close()">
      <i class="pi pi-times"></i>
    </div>
  </div>
</template>
