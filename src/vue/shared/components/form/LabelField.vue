<script lang="ts" setup>
import Message from '../volt/Message.vue'

export interface LabelFieldProps {
  id: string
  error?: string
  label?: string
}

defineProps<LabelFieldProps>()
</script>

<template>
  <div class="card">
    <div class="flex flex-col gap-2 items-stretch">
      <label :for="id">
        <div class="text-center">{{ label }}</div>
      </label>
      <slot></slot>
      <Message v-if="error" size="small" severity="error" variant="simple">
        {{ error }}
      </Message>
    </div>
  </div>
</template>
