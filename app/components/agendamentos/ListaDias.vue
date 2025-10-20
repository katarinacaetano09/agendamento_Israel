<template>
  <div class="w-full mt-2 rounded p-2 flex gap-0">
    <div class="min-w-[56px]" />
    <DiaItem v-for="(dia, idx) in props.dias" :key="idx" :data="dia" class="flex-1 min-w-0" />
  </div>
</template>

<script setup lang="ts">
import DiaItem from './DiaItem.vue'
const props = defineProps<{ dias: Date[] }>()
</script>
