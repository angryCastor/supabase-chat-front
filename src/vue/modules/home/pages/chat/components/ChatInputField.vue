<script setup lang="ts">
import Button from '@/vue/shared/components/volt/Button.vue'

export interface ChatInputFieldProps {
  loading?: boolean
}

defineProps<ChatInputFieldProps>()
defineEmits(['submit'])

const model = defineModel()
const scrollToBottom = () => setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 200)
</script>

<template>
  <form class="bg-surface-100 flex p-2" @submit.prevent="() => $emit('submit')">
    <input
      type="text"
      class="grow outline-none focus:outline-none active:outline-none px-2"
      placeholder="Написать сообщение"
      v-model="model"
      @click="scrollToBottom"
    />
    <div class="shrink-0">
      <Button icon="pi pi-angle-double-right" aria-label="Save" type="submit" :loading="loading" />
    </div>
  </form>
</template>
