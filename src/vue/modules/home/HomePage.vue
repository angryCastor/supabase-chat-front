<script setup lang="ts">
import HomeLayout from './layouts/homeLayout/HomeLayout.vue'
import { onMounted, onUnmounted } from 'vue'
import ChatDetailCubit from '@/presentation/chat/chatDetail/ChatDetailCubit'
import { ioc, messageRepositoryKey } from '@/di'
import type { MessageRepository } from '@/domain/repository/MessageRepository'
import ChatListCubit from '@/presentation/chat/chatList/ChatListCubit'

const messageRepository = ioc.get<MessageRepository>(messageRepositoryKey)
const chatListCubit = ioc.get(ChatListCubit)

onMounted(() => {
  chatListCubit.initialize()
  messageRepository.initialize()
})

onUnmounted(() => {
  ChatDetailCubit.dispose()
  messageRepository.dispose()
  chatListCubit.dispose()
  chatListCubit.clear()
})
</script>

<template>
  <div>
    <HomeLayout> <RouterView :key="$route.fullPath" /> </HomeLayout>
  </div>
</template>
