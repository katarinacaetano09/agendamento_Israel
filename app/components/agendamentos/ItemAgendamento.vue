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
import { computed, ref, watch, onMounted } from 'vue'
import SlotAgendamento from './SlotAgendamento.vue'
import { HEADER_OFFSET, HOUR_HEIGHT, START_HOUR } from '~~/shared/constants/layout'
import { useAgendamentos } from '~/composables/useAgendamentos'
import { useAgendamentoStore } from '~/stores/agendamento'
import { storeToRefs } from 'pinia'

const props = defineProps<{ data: Date, slots?: Array<any> }>()

const dataFormatada = computed(() =>
  props.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
)

// Props: `slots` is an array of agendamento rows for this date (may be empty)
function parseDateTime(dateStr: string | null, timeStr: string | null) {
  if (!dateStr || !timeStr) return null
  // timeStr pode ser '12:00:00-03' ou '12:00:00'.
  // Para preservar o horário marcado (hora local), extraímos horas e minutos e
  // construímos uma Date local a partir das partes (ignorando sufixo de timezone).
  const m = timeStr.match(/^(\d{2}):(\d{2})/)
  if (!m) return null
  const hh = Number(m[1])
  const mm = Number(m[2])
  const parts = dateStr.split('-')
  if (parts.length < 3) return null
  const year = Number(parts[0])
  const month = Number(parts[1]) - 1
  const day = Number(parts[2])
  const d = new Date(year, month, day, hh, mm, 0, 0)
  if (isNaN(d.getTime())) return null
  return d
}

type Slot = { inicio: Date; fim: Date; titulo: string; descricao: string }

const slotsDoDia = computed<Slot[]>(() => {
  const rows = props.slots || []
  const mapped = rows.map((a: any): Slot | null => {
    const inicio = parseDateTime(a.data, a.hora_inicio)
    const fim = parseDateTime(a.data, a.hora_fim)
    if (!inicio || !fim) return null
    return {
      inicio,
      fim,
      titulo: a.titulo ?? '',
      descricao: a.descricao ?? ''
    }
  })
  return mapped.filter((s): s is Slot => s !== null)
})
</script>
