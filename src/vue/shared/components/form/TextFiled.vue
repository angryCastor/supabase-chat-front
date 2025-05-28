<script lang="ts" setup>
import InputText from '../volt/InputText.vue'
import LabelField from './LabelField.vue'

export interface TextFieldProps {
  loading?: boolean
  id: string
  label?: string
  type?: 'text' | 'email'
  error?: string
}

defineProps<TextFieldProps>()

const model = defineModel<string>()
</script>

<template>
  <LabelField :id="id" :label="label" :error="error">
    <InputText :disabled="loading" :id="id" v-model="model" :type="type ?? 'text'" />
  </LabelField>
</template>
