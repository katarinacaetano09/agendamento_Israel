
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold text-neutral-800 dark:text-white">Profissionais</h1>
    </div>
    <TabelaProfissionais />
  </div>
</template>

<script setup lang="ts">
import TabelaProfissionais from '~/components/TabelaProfissionais.vue'

// Configuração da página
useHead({
  title: 'Profissionais - Sistema de Agendamentos',
  meta: [
    { name: 'description', content: 'Gerenciar profissionais do sistema de agendamentos' }
  ]
})
</script>