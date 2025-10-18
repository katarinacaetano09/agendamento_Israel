<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-3">
      <button
        class="p-2 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-blue-100 transition flex items-center justify-center"
        @click="voltarSemana"
        title="Semana anterior"
        aria-label="Semana anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <span class="text-lg font-semibold text-neutral-800 bg-blue-50 px-4 py-1 rounded">
        {{ semanaInicio ? formatDate(semanaInicio) : '--/--' }}
        <span class="text-base font-normal text-neutral-500">até</span>
        {{ semanaFim ? formatDate(semanaFim) : '--/--' }}
      </span>
      <button
        class="p-2 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-blue-100 transition flex items-center justify-center"
        @click="avancarSemana"
        title="Próxima semana"
        aria-label="Próxima semana"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAgendamentoStore } from '~/stores/agendamento'
import { computed } from 'vue'

const agendamentoStore = useAgendamentoStore()
const { dataSemana } = storeToRefs(agendamentoStore)

const semanaInicio = computed(() => dataSemana.value?.[0])
const semanaFim = computed(() => dataSemana.value?.[6])

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function avancarSemana() {
  agendamentoStore.avancarSemana()
}
function voltarSemana() {
  agendamentoStore.voltarSemana()
}
</script>
