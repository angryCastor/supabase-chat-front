<script setup lang="ts">
export interface ChatErrorProps {
  error: string
}

defineProps<ChatErrorProps>()
</script>

<template>
  <div class="flex justify-center items-center w-full h-full">
    <div class="text-center text-surface-400 italic">
      {{ error }}
    </div>
  </div>
</template>
