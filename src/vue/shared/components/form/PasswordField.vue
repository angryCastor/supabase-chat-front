<script lang="ts" setup>
import Password from '../volt/Password.vue'
import LabelField from './LabelField.vue'

export interface PasswordFieldProps {
  loading?: boolean
  id: string
  label?: string
  error?: string
  feedback?: boolean
  toggleMask?: boolean
}

defineProps<PasswordFieldProps>()

const model = defineModel<string>()
</script>

<template>
  <LabelField :id="id" :label="label" :error="error">
    <Password
      class="w-full"
      :disabled="loading"
      :id="id"
      v-model="model"
      :toggleMask="toggleMask"
      :feedback="feedback"
      :inputProps="{ autocomplete: 'off' }"
    />
  </LabelField>
</template>
