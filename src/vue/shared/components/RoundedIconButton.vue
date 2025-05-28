<script setup lang="ts">
import ptTooltip from '../pt/ptTooltip'

export interface RoundedIconButtonProps {
  icon: string
  tooltip?: string
}

defineProps<RoundedIconButtonProps>()
</script>

<template>
  <div
    class="flex items-center justify-center rounded-full w-12 h-12 bg-primary cursor-pointer"
    v-tooltip="{ value: tooltip, pt: ptTooltip }"
  >
    <i class="pi text-white text-xl" :class="icon"></i>
  </div>
</template>
