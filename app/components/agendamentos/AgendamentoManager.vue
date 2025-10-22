

<template>
  <div class="agendamento-manager-container w-full mt-4 flex flex-col rounded-xl overflow-hidden" style="height: 100%; min-height: 400px;">
    <div
      class="header px-8 flex flex-col justify-between"
    >
      <div class="w-full flex items-center justify-between">
        <AgendamentoSemanaControl />
        <div class="flex-1 flex items-center justify-center">
          <ProfissionalInfo />
        </div>
        <div class="flex items-center gap-2">
          <BaseButton label="Limpar cache" variant="secondary" size="sm" @click="clearCache" />
          <BaseButton label="Novo" variant="primary" size="md" @click="onNovoAgendamento" />
        </div>
      </div>
      <ListaDias :dias="diasSemana" />
    </div>
    <div
      class="body flex-1 px-4 flex items-start gap-4 mt-2"
      style="min-height: 200px;"
    >
      <ReguaHorarios />
      <div class="flex-1 flex gap-2 h-full">
        <ItemAgendamento
          v-for="(dia, idx) in diasSemana"
          :key="idx"
          :data="dia"
          :slots="semanaSlots[ dia.toISOString().slice(0,10) ] || []"
          class="flex-1 min-w-0"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AgendamentoSemanaControl from './AgendamentoSemanaControl.vue'
import ProfissionalInfo from './ProfissionalInfo.vue'
import ListaDias from './ListaDias.vue'
import ReguaHorarios from './ReguaHorarios.vue'
import ItemAgendamento from './ItemAgendamento.vue'
import BaseButton from '../BaseButton.vue'

import { useAgendamentoStore } from '~/stores/agendamento'
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import { useAgendamentos } from '~/composables/useAgendamentos'

export default {
  name: 'AgendamentoManager',
  components: { AgendamentoSemanaControl, ProfissionalInfo, ListaDias, ReguaHorarios, ItemAgendamento, BaseButton },
  setup() {
    const agendamentoStore = useAgendamentoStore()
    const { dataSemana } = storeToRefs(agendamentoStore)
    const { selectedProfissionalId, selectedProfissional } = storeToRefs(agendamentoStore)
  const { fetchAgendamentosPorProfissionalWeek, invalidateCache } = useAgendamentos()

  const semanaSlots = ref<Record<string, Array<any>>>({})

    function formatDate(d: Date) {
      return d.toISOString().slice(0, 10)
    }

    async function loadSemana() {
      const profId = Number(selectedProfissionalId.value)
      if (!profId) {
        semanaSlots.value = {}
        return
      }
      if (!dataSemana.value || dataSemana.value.length === 0) {
        semanaSlots.value = {}
        return
      }
      const startDate = dataSemana.value[0]
      const endDate = dataSemana.value[dataSemana.value.length - 1]
      if (!startDate || !endDate) {
        semanaSlots.value = {}
        return
      }
      const start = formatDate(startDate)
      const end = formatDate(endDate)
  const res = await fetchAgendamentosPorProfissionalWeek(profId, start, end)
      if (!res) {
        semanaSlots.value = {}
        return
      }
      // map by date
      const map: Record<string, Array<any>> = {}
      for (const a of res) {
        const key = a.data ?? ''
        if (!key) continue
        if (!map[key]) map[key] = []
        map[key].push(a)
      }
      semanaSlots.value = map
    }

    async function clearCache() {
      const profId = Number(selectedProfissionalId.value)
      if (!profId) {
        invalidateCache()
      } else {
        if (!dataSemana.value || dataSemana.value.length === 0) {
          invalidateCache(profId)
        } else {
          const startDate = dataSemana.value[0]
          const endDate = dataSemana.value[dataSemana.value.length - 1]
          if (!startDate || !endDate) {
            invalidateCache(profId)
          } else {
            const start = formatDate(startDate)
            const end = formatDate(endDate)
            invalidateCache(profId, start, end)
          }
        }
      }
      await loadSemana()
    }

    watch([() => selectedProfissionalId.value, () => dataSemana.value], () => {
      loadSemana()
    })

    onMounted(() => {
      loadSemana()
    })
    return {
      diasSemana: dataSemana,
      semanaSlots,
      clearCache
    }
  },
  methods: {
    onNovoAgendamento() {
      // Ação para inserir novo agendamento
      // Implemente aqui conforme necessário
      // Exemplo: abrir modal, etc.
      alert('Novo agendamento!')
    }
  }
};
</script>

<style scoped>
.agendamento-manager-container {
  height: 100%;
  min-height: 400px;
}
</style>
