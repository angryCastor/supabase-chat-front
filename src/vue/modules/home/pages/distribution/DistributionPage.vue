<script setup lang="ts">
import ManagePanel from '../../layouts/homeLayout/ManagePanel.vue'
</script>

<template>
  <div class="h-full w-screen md:hidden">
    <ManagePanel />
  </div>

  <div class="justify-center items-center w-full h-full hidden md:flex">
    <div class="text-center text-surface-400 italic">
      Создайте новый чат <br />или выберите существующий
    </div>
  </div>
</template>
