<script lang="ts" setup>
import type Chat from '@/domain/models/chat/Chat'
import generateChatColor from '@/vue/shared/utils/generateChatColor'
import { computed } from 'vue'
import formatMessageTime from '@/vue/shared/utils/formatMessageTime'

export interface ChatItemProps {
  chat: Chat
  selected?: boolean
}

const props = defineProps<ChatItemProps>()

defineEmits(['click'])

const chatColor = computed(() => generateChatColor(props.chat))
const lastMessageTime = computed(() => formatMessageTime(props.chat.displayCreatedAt))
</script>

<template>
  <div
    class="flex items-center p-2 cursor-pointer border-b border-surface-200"
    :class="{ 'bg-primary-200': selected, 'hover:bg-surface-200': !selected }"
    @click="() => $emit('click')"
  >
    <div
      class="rounded-full w-12 h-12 flex justify-center items-center shrink-0"
      :style="{ background: chatColor }"
    >
      {{ chat.chatShortTitle }}
    </div>
    <div class="pl-2" style="width: calc(100% - 3.5rem)">
      <div class="flex items-baseline">
        <div class="grow">{{ chat.chatTitle }}</div>
        <div class="text-sm shrink-0 ml-2 text-surface-500">
          {{ lastMessageTime }}
        </div>
      </div>

      <div class="text-surface-500 text-sm min-w-0">
        <div v-if="chat.lastMessage" class="truncate">
          {{ chat.lastMessage.text }}
        </div>
        <div class="italic" v-else>сообщений нет</div>
      </div>
    </div>
  </div>
</template>
