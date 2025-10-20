<template>
  <div class="flex flex-col items-center justify-start h-full w-full px-2">
    <span class="text-xs text-neutral-500">Agendamentos para</span>
    <span class="text-base font-semibold text-neutral-800 mt-1">{{ dataFormatada }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ data: Date }>()

const dataFormatada = computed(() =>
  props.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
)
</script>
