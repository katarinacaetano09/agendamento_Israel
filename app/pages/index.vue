


<template>
  <div class="px-8 pt-2 max-w-7xl mx-auto min-h-screen flex flex-col">
    <div class="flex-1 flex flex-col mt-0">
      <AgendamentoManager class="flex-1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { useAgendamentoStore } from '../stores/agendamento'
import AgendamentoManager from '../components/agendamentos/AgendamentoManager.vue'

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

// Inicializa o store de agendamento ao montar a página
const agendamentoStore = useAgendamentoStore()

// Configuração da página
useHead({
  title: 'Agendamentos - Sistema de Agendamentos',
  meta: [
    { name: 'description', content: 'Página de agendamentos do sistema de agendamentos online' }
  ]
})
</script>