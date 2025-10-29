<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-neutral-800 dark:text-white">Agendamento da Clinica</h1>
    </div>

    <ListaAgendamentos />
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
import ListaAgendamentos from '~/components/agendamentos/ListaAgendamentos.vue'
// Configuração da página
useHead({
  title: 'Agendamento da Clinica - Sistema de Agendamentos',
  meta: [
    { name: 'description', content: 'Relatórios e histórico de agendamentos' }
  ]
})
</script>
