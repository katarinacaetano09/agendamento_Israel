<template>
  <div
    class="absolute left-1 right-1 rounded bg-gray-200 text-neutral-800 px-2 py-1 shadow-md text-xs flex flex-col border border-gray-300"
    :style="slotStyle"
  >
    <span class="font-bold w-full block">{{ titulo }}</span>
    <span class="w-full block">{{ descricao }}</span>
    <span class="mt-1 opacity-80">{{ horaInicio }} - {{ horaFim }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HOUR_HEIGHT, HEADER_OFFSET, START_HOUR } from '~~/shared/constants/layout'
const props = defineProps<{
  inicio: Date,
  fim: Date,
  titulo: string,
  descricao: string
}>()

function formatHora(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const horaInicio = computed(() => formatHora(props.inicio))
const horaFim = computed(() => formatHora(props.fim))

// Para posicionamento vertical (usa constantes do layout):
const slotStyle = computed(() => {
  const start = props.inicio.getHours() + props.inicio.getMinutes() / 60
  const end = props.fim.getHours() + props.fim.getMinutes() / 60
  const top = HEADER_OFFSET + (start - START_HOUR) * HOUR_HEIGHT
  const height = (end - start) * HOUR_HEIGHT
  return {
    top: top + 'px',
    height: height + 'px',
    zIndex: 10
  }
})
</script>
