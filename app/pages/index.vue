<template>
  <div>
    <h1 class="text-3xl font-bold text-neutral-800 dark:text-white">Dashboard</h1>
    <div v-if="profile?.nome" class="mt-4">
      <span class="text-lg font-semibold">Olá, {{ profile.nome }}!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

// Configuração da página
useHead({
  title: 'Dashboard - Sistema de Agendamentos',
  meta: [
    { name: 'description', content: 'Dashboard principal do sistema de agendamentos online' }
  ]
})
</script>