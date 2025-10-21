

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
        <BaseButton label="Novo" variant="primary" size="md" @click="onNovoAgendamento" />
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

export default {
  name: 'AgendamentoManager',
  components: { AgendamentoSemanaControl, ProfissionalInfo, ListaDias, ReguaHorarios, ItemAgendamento, BaseButton },
  setup() {
    const agendamentoStore = useAgendamentoStore()
    const { dataSemana } = storeToRefs(agendamentoStore)
    return {
      diasSemana: dataSemana
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
