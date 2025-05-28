<script setup lang="ts">
import type Message from '@/domain/models/message/Message'
import type User from '@/domain/models/user/user'
import formatMessageTime from '@/vue/shared/utils/formatMessageTime'
import stringToHLS from '@/vue/shared/utils/stringToHLS'
import { computed } from 'vue'

export interface ChatMessageItemProps {
  message: Message
  isSelf: boolean
  isUserPreview: boolean
  user?: User
}

const props = defineProps<ChatMessageItemProps>()

const userColor = computed(() => (props.user ? stringToHLS(props.user.id) : 'var(--p-surface-400)'))

const userShortName = computed(() => (props.user ? props.user.shortName : 'RM'))

const userName = computed(() => (props.user ? props.user.name : 'Удален'))

const time = computed(() => formatMessageTime(props.message.createdAt))
</script>

<template>
  <div>
    <div class="flex flex-col px-2 py-1" :class="isSelf ? 'items-end' : 'items-start'">
      <div
        v-if="!isUserPreview && message.chatId < 0"
        class="flex items-center mb-1"
        :class="{
          'flex-row-reverse': isSelf,
        }"
      >
        <div
          class="w-6 h-6 rounded-full flex justify-center items-center"
          :style="{
            background: userColor,
          }"
        >
          <div class="text-xs">{{ userShortName }}</div>
        </div>
        <div class="ml-1 text-sm text-surface-600" :class="isSelf ? 'mr-1' : 'ml-1'">
          {{ userName }}
        </div>
      </div>
      <div
        class="max-w-96 py-1 px-2 rounded-md text-primary-contrast text-sm"
        :class="isSelf ? 'bg-primary-300' : 'bg-surface-300'"
      >
        {{ message.value }}
      </div>
      <div class="text-xs text-surface-400 mt-1">
        {{ time }}
      </div>
    </div>
  </div>
</template>
