<script lang="ts" setup>
import ManagePanel from './ManagePanel.vue'
</script>

<template>
  <div class="flex justify-center items-center bg-surface-50 min-h-dvh">
    <div class="w-full flex max-w-[1200px] max-h-[900px] shadow-xl bg-white items-stretch h-dvh">
      <div class="w-full max-w-96 grow shrink-0 hidden md:block">
        <ManagePanel />
      </div>
      <div class="grow border-l border-surface-200 h-full">
        <slot />
      </div>
    </div>
  </div>
</template>
