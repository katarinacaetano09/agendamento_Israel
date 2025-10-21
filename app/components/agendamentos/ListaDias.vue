<template>
  <div class="w-full mt-0 rounded-xl flex gap-2 items-stretch">
    <div class="min-w-[52px]" />
    <DiaItem v-for="(dia, idx) in props.dias" :key="idx" :data="dia" class="flex-1 min-w-0" />
  </div>
</template>

<script setup lang="ts">
import DiaItem from './DiaItem.vue'
const props = defineProps<{ dias: Date[] }>()
</script>
