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
          @edit="onEditAgendamento"
        />
      </div>
    </div>
  </div>

  <!-- Modal inserido dentro do template para garantir renderização/prop binding corretos -->
  <NewAgendamentoModal
    :show="showNewModal"
    :profissional="modalProfissional"
    :datas="diasSemana"
    :ocupados="semanaSlots"
    @update:show="onModalUpdateShow"
    @confirm="onModalConfirm"
    @cancel="onModalCancel"
  />
  <EditAgendamentoModal
    :show="showEditModal"
    :agendamento="editAgendamento"
    @update:show="onEditModalUpdateShow"
    @confirm="onEditModalConfirm"
    @cancel="onEditModalCancel"
  />
</template>

<script lang="ts">
import AgendamentoSemanaControl from './AgendamentoSemanaControl.vue'
import ProfissionalInfo from './ProfissionalInfo.vue'
import ListaDias from './ListaDias.vue'
import ReguaHorarios from './ReguaHorarios.vue'
import ItemAgendamento from './ItemAgendamento.vue'
import BaseButton from '../BaseButton.vue'
import NewAgendamentoModal from './NewAgendamentoModal.vue'
import EditAgendamentoModal from './EditAgendamentoModal.vue'

import { useAgendamentoStore } from '~/stores/agendamento'
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import { useAgendamentos } from '~/composables/useAgendamentos'

export default {
  name: 'AgendamentoManager',
  components: { AgendamentoSemanaControl, ProfissionalInfo, ListaDias, ReguaHorarios, ItemAgendamento, BaseButton, NewAgendamentoModal, EditAgendamentoModal },
  setup() {
    const agendamentoStore = useAgendamentoStore()
    const { dataSemana } = storeToRefs(agendamentoStore)
    const { selectedProfissionalId, selectedProfissional } = storeToRefs(agendamentoStore)
  const { fetchAgendamentosPorProfissionalWeek, invalidateCache } = useAgendamentos()

  const semanaSlots = ref<Record<string, Array<any>>>({})
  const showNewModal = ref(false)
  const modalProfissional = ref<any>(null)
  const showEditModal = ref(false)
  const editAgendamento = ref<any>(null)

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
      // map by date (normalize to YYYY-MM-DD)
      const map: Record<string, Array<any>> = {}
      // load local client-side color mappings (if user selected color but DB doesn't store it)
      let localColors: Record<string, string> = {}
      try {
        const raw = localStorage.getItem('agendamentoColors')
        if (raw) localColors = JSON.parse(raw)
      } catch (e) {
        localColors = {}
      }
      for (const a of res) {
        // a.data may be a Date object, a string like '2025-10-24' or an ISO timestamp.
        const raw = a?.data
        let key = ''
        if (raw && typeof raw === 'object' && typeof (raw as any).toISOString === 'function') {
          // treat as Date-like
          key = (raw as any).toISOString().slice(0, 10)
        } else if (typeof raw === 'string') {
          key = (raw || '').slice(0, 10)
        } else {
          key = String(raw ?? '').slice(0, 10)
        }
        if (!key) continue
        if (!map[key]) map[key] = []
        // attach client-side color if DB didn't provide one
        try {
          const id = String(a?.id ?? '')
          if (!(a as any).color && localColors[id]) (a as any).color = localColors[id]
        } catch (e) {}
        map[key]!.push(a)
      }
      semanaSlots.value = map
    }

    function openNovo() {
      modalProfissional.value = selectedProfissional.value || null
      // debug log: open modal
      try { console.log('[debug] openNovo called, profissional:', modalProfissional.value) } catch(e) {}
      showNewModal.value = true
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
    function onModalUpdateShow(val: boolean) {
      try { console.log('[debug] onModalUpdateShow:', val) } catch(e) {}
      showNewModal.value = val
    }

    async function onModalConfirm(payload: any) {
      console.log('Novo agendamento payload (layout only):', payload)
      showNewModal.value = false
      // if payload contains profissional_id, invalidate cache for that profissional and reload
      try {
        const profId = Number(payload?.profissional_id ?? payload?.profissional?.id ?? selectedProfissionalId.value)
        if (profId) {
          // invalidate cache for the week range to force fresh fetch
          if (dataSemana.value && dataSemana.value.length > 0 && dataSemana.value[0] && dataSemana.value[dataSemana.value.length - 1]) {
            const start = formatDate(dataSemana.value[0] as Date)
            const end = formatDate(dataSemana.value[dataSemana.value.length - 1] as Date)
            invalidateCache(profId, start, end)
          } else {
            invalidateCache(profId)
          }
        } else {
          // fallback: full invalidate
          invalidateCache()
        }
        await loadSemana()
      } catch (e) {
        console.warn('Erro ao recarregar semana após salvar agendamento', e)
      }
    }

    function onModalCancel() {
      try { console.log('[debug] onModalCancel') } catch(e) {}
      showNewModal.value = false
    }

    function onEditAgendamento(agendamento: any) {
      editAgendamento.value = agendamento
      showEditModal.value = true
    }
    function onEditModalUpdateShow(val: boolean) {
      showEditModal.value = val
    }
  async function onEditModalConfirm(payload: any) {
      showEditModal.value = false
      // reload semana se necessário
        // Invalidate cache for this professional and week range so loadSemana fetches fresh data
        try {
          const profId = Number(payload?.profissional_id ?? payload?.profissional?.id ?? selectedProfissionalId.value)
          if (profId) {
            if (dataSemana.value && dataSemana.value.length > 0 && dataSemana.value[0] && dataSemana.value[dataSemana.value.length - 1]) {
              const start = formatDate(dataSemana.value[0] as Date)
              const end = formatDate(dataSemana.value[dataSemana.value.length - 1] as Date)
              invalidateCache(profId, start, end)
            } else {
              invalidateCache(profId)
            }
          } else {
            invalidateCache()
          }
        } catch (e) {
          console.warn('Erro ao invalidar cache após editar agendamento', e)
        }
        // reload semana com dados atualizados
        await loadSemana()
    }
    function onEditModalCancel() {
      showEditModal.value = false
    }

    return {
      diasSemana: dataSemana,
      semanaSlots,
      clearCache,
      showNewModal,
      modalProfissional,
      openNovo,
      showEditModal,
      editAgendamento,
      onModalUpdateShow,
      onModalConfirm,
      onModalCancel,
      onEditAgendamento,
      onEditModalUpdateShow,
      onEditModalConfirm,
      onEditModalCancel
    }
  },
  methods: {
    onNovoAgendamento() {
      // open the new appointment modal
      this.openNovo()
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
