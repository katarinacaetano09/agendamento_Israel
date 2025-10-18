

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
      class="body flex-1 px-8 flex items-center"
      style="min-height: 200px;"
    >
      <div>
        <span class="font-semibold text-base text-neutral-800">Corpo – Conteúdo Principal</span><br>
        <span class="text-xs text-neutral-500">Ocupa todo o espaço restante</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AgendamentoSemanaControl from './AgendamentoSemanaControl.vue'
import ProfissionalInfo from './ProfissionalInfo.vue'
import ListaDias from './ListaDias.vue'
import BaseButton from '../BaseButton.vue'

import { useAgendamentoStore } from '~/stores/agendamento'
import { storeToRefs } from 'pinia'

export default {
  name: 'AgendamentoManager',
  components: { AgendamentoSemanaControl, ProfissionalInfo, ListaDias, BaseButton },
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
