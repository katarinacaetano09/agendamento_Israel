<template>
  <div class="w-full mt-2 border border-dashed border-gray-400 rounded p-2 flex justify-center">
    <!-- Apenas para visualização temporária -->
    <span class="text-xs text-gray-500">{{ diasFormatados }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ dias: Date[] }>()

const diasFormatados = computed(() =>
  props.dias.map(d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })).join(' | ')
)
</script>
