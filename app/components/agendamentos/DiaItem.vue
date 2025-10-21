<template>
  <div class="flex flex-col items-center justify-center h-full w-full py-2 transition-colors duration-150 cursor-pointer bg-gray-200 rounded-t-xl">
    <span class="text-lg font-bold text-neutral-800">{{ diaNumero }}</span>
    <span class="text-xs text-neutral-500 uppercase mt-1">{{ diaSemana }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ data: Date }>()

const diaNumero = computed(() => props.data.getDate())
const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
const diaSemana = computed(() => diasSemana[props.data.getDay()])
</script>
