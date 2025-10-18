


<template>
  <div class="px-8 py-6 max-w-7xl mx-auto min-h-screen flex flex-col">
    <h1 class="text-3xl font-bold text-neutral-800 dark:text-white">Agendamentos</h1>
    <div class="flex-1 flex flex-col">
      <AgendamentoManager class="flex-1" />
    </div>
    <!-- Saudação ao usuário removida -->
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