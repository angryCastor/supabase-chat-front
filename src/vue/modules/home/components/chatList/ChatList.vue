<script lang="ts" setup>
import { ioc } from '@/di'
import ChatListCubit from '@/presentation/chat/chatList/ChatListCubit'
import { useCubitState } from '@/vue/common/useCubitState'
import { computed } from 'vue'
import ChatItem from './ChatItem.vue'
import type Chat from '@/domain/models/chat/Chat'
import { useRoute, useRouter } from 'vue-router'

const cubit = ioc.get(ChatListCubit)
const state = useCubitState(cubit)
const router = useRouter()
const route = useRoute()

const chatClickHandler = (chat: Chat) => {
  router.push(`/${chat.id}`)
}

const selectedChatId = computed(() => Number(route.params?.id?.toString()))
</script>

<template>
  <div>
    <div v-if="state.list.length > 0">
      <div v-for="chat in state.list" :key="chat.id">
        <ChatItem
          :chat="chat"
          @click="() => chatClickHandler(chat)"
          :selected="selectedChatId == chat.id"
        />
      </div>
    </div>
    <div v-else class="flex items-center justify-center text-surface-300 italic h-full">
      У вас еще нет чатов
    </div>
  </div>
</template>
