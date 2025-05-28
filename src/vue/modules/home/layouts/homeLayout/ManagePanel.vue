<script setup lang="ts">
import ChatList from '../../components/chatList/ChatList.vue'
import CreateChatButtons from '../../components/CreateChatButtons.vue'
import UserPanel from '../../components/UserPanel.vue'
</script>

<template>
  <div class="h-full relative">
    <UserPanel />
    <ChatList class="overflow-auto" style="height: calc(100% - 6rem)" />
    <CreateChatButtons class="absolute bottom-2 right-2" />
  </div>
</template>
