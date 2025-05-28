<script setup lang="ts">
import { ioc } from '@/di'
import ChatDetailCubit from '@/presentation/chat/chatDetail/ChatDetailCubit'
import { useCubitState } from '@/vue/common/useCubitState'
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ChatLoading from './components/ChatLoading.vue'
import ChatError from './components/ChatError.vue'
import ChatHeader from './components/ChatHeader.vue'
import ChatMessageList from './components/ChatMessageList.vue'
import ChatInputField from './components/ChatInputField.vue'

const route = useRoute()
const chatId = Number.parseInt(route.params.id.toString())
const cubit = ioc.get<() => (chatId: number) => ChatDetailCubit>(ChatDetailCubit)()(chatId)

const state = useCubitState(cubit)

onMounted(() => cubit.initialize())

onUnmounted(() => cubit.dispose())
</script>

<template>
  <div class="h-full">
    <ChatLoading v-if="state.initLoad" />
    <ChatError v-else-if="state.initError" :error="state.initError" />
    <div v-else class="flex-col flex overflow-hidden h-full">
      <ChatHeader :chat="state.chat!" />
      <div class="grow"></div>
      <ChatMessageList
        :me="state.me!"
        :messages="state.messages"
        :users="state.users"
        :can-load-more="state.canLoadMore"
        :load-more-loading="state.loadMoreLoading"
        @load-more="() => cubit.loadMore()"
      />
      <ChatInputField
        style="flex: auto 0 0"
        :model-value="state.messageValue"
        :loading="state.sendMessageLoading"
        @update:model-value="(value) => cubit.setMessage(value)"
        @submit="() => cubit.sendMessage()"
      />
    </div>
  </div>
</template>
