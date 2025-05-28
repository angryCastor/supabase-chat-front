<script setup lang="ts">
import RoundedIconButton from '@/vue/shared/components/RoundedIconButton.vue'
import { useDialog } from 'primevue/usedialog'
import CreatePrivateChatForm from '../modals/CreatePrivateChatForm.vue'
import CreateGroupChatForm from '../modals/CreateGroupChatForm.vue'
import { useRouter } from 'vue-router'
import type { Component } from 'vue'

const dialog = useDialog()
const router = useRouter()

const openCreateChatForm = (component: Component) => {
  dialog.open(component, {
    props: {
      modal: true,
      closable: false,
      showHeader: false,
      style: {
        maxWidth: '500px',
        width: '100vw',
      },
    },
    onClose(options) {
      const chatId = options?.data?.chatId
      if (chatId) {
        router.push(`/${chatId}`)
      }
    },
  })
}

const createPrivateChat = () => {
  openCreateChatForm(CreatePrivateChatForm)
}

const createGroupChat = () => {
  openCreateChatForm(CreateGroupChatForm)
}
</script>

<template>
  <div class="flex flex-col gap-1 items-center">
    <RoundedIconButton icon="pi-users" tooltip="Создать группу" @click="createGroupChat" />
    <RoundedIconButton
      icon="pi-user-plus"
      tooltip="Добавить пользователя"
      @click="createPrivateChat"
    />
  </div>
</template>
