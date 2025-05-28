<script setup lang="ts">
import type Chat from '@/domain/models/chat/Chat'
import generateChatColor from '@/vue/shared/utils/generateChatColor'
import { computed } from 'vue'

export interface ChatHeaderProps {
  chat: Chat
}

const props = defineProps<ChatHeaderProps>()

const chatColor = computed(() => generateChatColor(props.chat))
</script>

<template>
  <div class="p-2 bg-surface-100 shadow">
    <div class="flex items-center">
      <RouterLink to="/" class="flex items-center mx-4 md:hidden">
        <i class="pi pi-arrow-left text-2xl text-primary"></i>
      </RouterLink>
      <div
        class="w-16 h-16 rounded-full flex justify-center items-center"
        :style="{
          background: chatColor,
        }"
      >
        <div class="text-xl">{{ chat.chatShortTitle }}</div>
      </div>
      <div class="ml-2 text-xl">{{ chat.chatTitle }}</div>
    </div>
  </div>
</template>
