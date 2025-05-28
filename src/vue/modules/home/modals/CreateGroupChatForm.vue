<script lang="ts" setup>
import { ioc } from '@/di'
import type User from '@/domain/models/user/user'
import CreateGroupChatCubit from '@/presentation/chat/createGroupChat/CreateGroupChatCubit'
import { useCubitState } from '@/vue/common/useCubitState'
import LabelField from '@/vue/shared/components/form/LabelField.vue'
import stringToHLS from '@/vue/shared/utils/stringToHLS'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import { useToast } from 'primevue/usetoast'
import { computed, inject, watch, type Ref } from 'vue'
import TextFiled from '@/vue/shared/components/form/TextFiled.vue'
import AutoComplete from '@/vue/shared/components/volt/AutoComplete.vue'
import Button from '@/vue/shared/components/volt/Button.vue'
import Chip from '@/vue/shared/components/volt/Chip.vue'

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')
const cubit = ioc.get(CreateGroupChatCubit)
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
    <div class="text-center text-2xl">Новый групповой чат</div>
    <form action="" class="mt-4" @submit.prevent="() => cubit.submit()">
      <LabelField id="title" label="Название">
        <TextFiled
          id="title"
          :model-value="state.chatTitle"
          @update:model-value="(e) => cubit.setTitle(e as string)"
        />
      </LabelField>
      <LabelField id="searchUser" label="Поиск пользователя" class="mt-4">
        <AutoComplete
          @update:model-value="(value) => cubit.addUser(value)"
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
        <div class="flex flex-col gap-2 items-stretch">
          <div class="text-center">Выбранные пользователи</div>
          <div
            v-if="state.chatUsers.length === 0"
            class="text-sm text-surface-300 italic text-center"
          >
            Пользователи не выбраны
          </div>
          <div v-else>
            <Chip
              v-for="user in state.chatUsers"
              pt:root:class="py-0 pl-0 pr-4 mb-2 mr-1"
              removable
              @remove="() => cubit.removeUser(user)"
              :key="user.id"
            >
              <span
                class="w-8 h-8 flex items-center justify-center rounded-full"
                :style="{ background: stringToHLS(user.id) }"
                >{{ user.shortName }}</span
              >
              <span class="font-medium">{{ user.email }}</span>
            </Chip>
          </div>
        </div>
      </div>
      <div class="card mt-4">
        <Button type="submit" :loading="state.submitLoading" class="w-full" label="Добавить" />
      </div>
    </form>
    <div class="absolute top-0 right-0 cursor-pointer" @click="() => close()">
      <i class="pi pi-times"></i>
    </div>
  </div>
</template>
