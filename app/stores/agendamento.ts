import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push(day)
  }
  return days
}

export const useAgendamentoStore = defineStore('agendamento', () => {
  const dataReferencia = ref(new Date())
  const selectedProfissionalId = ref<number | null>(null)
  const selectedProfissional = ref<any | null>(null)

  const dataSemana = computed(() => {
    const startOfWeek = getStartOfWeek(dataReferencia.value)
    return getWeekDays(startOfWeek)
  })

  function avancarSemana() {
    dataReferencia.value = new Date(dataReferencia.value)
    dataReferencia.value.setDate(dataReferencia.value.getDate() + 7)
  }

  function voltarSemana() {
    dataReferencia.value = new Date(dataReferencia.value)
    dataReferencia.value.setDate(dataReferencia.value.getDate() - 7)
  }

  function setSelectedProfissional(prof: any | null) {
    if (!prof) {
      selectedProfissionalId.value = null
      selectedProfissional.value = null
      return
    }
    // support several possible shapes: { profissional_id }, { id }, or a plain number
    if (typeof prof === 'number' || typeof prof === 'string') {
      const idNum = Number(prof)
      selectedProfissionalId.value = isNaN(idNum) ? null : idNum
      selectedProfissional.value = { profissional_id: selectedProfissionalId.value }
      return
    }
    const id = prof.profissional_id ?? prof.id ?? prof.profissionalId ?? null
    selectedProfissionalId.value = id != null ? Number(id) : null
    selectedProfissional.value = prof
  }

  return {
    dataReferencia,
    dataSemana,
    avancarSemana,
    voltarSemana,
    selectedProfissionalId,
    selectedProfissional,
    setSelectedProfissional
  }
})
