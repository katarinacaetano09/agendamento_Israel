<!--
  ItemAgendamento.vue
  - Dados de agendamentos são MOCKADOS para teste. Depois serão trazidos do banco.
  - Interface temporária, apenas para visualização e validação de layout.
-->
<template>
  <div class="flex flex-col items-center justify-start h-full w-full flex-1 min-w-0 p-0 m-0">
  <div class="relative w-full flex-1" :style="{ minHeight: (HOUR_HEIGHT * (22 - START_HOUR)) + 'px', paddingTop: HEADER_OFFSET + 'px', paddingBottom: HEADER_OFFSET + 'px' }">
      <SlotAgendamento
        v-for="(slot, idx) in slotsDoDia"
        :key="idx"
        :inicio="slot.inicio"
        :fim="slot.fim"
        :titulo="slot.titulo"
        :descricao="slot.descricao"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SlotAgendamento from './SlotAgendamento.vue'
import { HEADER_OFFSET, HOUR_HEIGHT, START_HOUR } from '~~/shared/constants/layout'
const props = defineProps<{ data: Date }>()

const dataFormatada = computed(() =>
  props.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
)

// Dados de agendamentos MOCKADOS para teste. Depois serão trazidos do banco.
const agendamentosMock = [
  // Slot exemplo para todos os dias
  {
    inicio: new Date(props.data.getFullYear(), props.data.getMonth(), props.data.getDate(), 8, 0, 0),
    fim: new Date(props.data.getFullYear(), props.data.getMonth(), props.data.getDate(), 9, 0, 0),
    titulo: 'Consulta João',
    descricao: 'Retorno clínico'
  },
  // Slots específicos de outros exemplos
  {
    inicio: new Date('2025-10-20T10:00:00'),
    fim: new Date('2025-10-20T11:30:00'),
    titulo: 'Exame Maria',
    descricao: 'Exame de sangue'
  },
  {
    inicio: new Date('2025-10-21T14:00:00'),
    fim: new Date('2025-10-21T15:00:00'),
    titulo: 'Consulta Pedro',
    descricao: 'Avaliação nutricional'
  },
  {
    inicio: new Date('2025-10-22T16:00:00'),
    fim: new Date('2025-10-22T17:00:00'),
    titulo: 'Retorno Ana',
    descricao: 'Revisão de exames'
  },
  {
    inicio: new Date('2025-10-23T09:30:00'),
    fim: new Date('2025-10-23T10:00:00'),
    titulo: 'Consulta Lucas',
    descricao: 'Primeira consulta'
  },
  {
    inicio: new Date('2025-10-24T13:00:00'),
    fim: new Date('2025-10-24T14:00:00'),
    titulo: 'Exame Carla',
    descricao: 'Ultrassom'
  },
  {
    inicio: new Date('2025-10-25T11:00:00'),
    fim: new Date('2025-10-25T12:00:00'),
    titulo: 'Consulta Paulo',
    descricao: 'Consulta de rotina'
  }
]

const slotsDoDia = computed(() =>
  agendamentosMock.filter(a =>
    a.inicio.toDateString() === props.data.toDateString()
  )
)
</script>
