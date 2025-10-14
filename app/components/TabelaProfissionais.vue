<template>
  <div>
    <table class="min-w-full bg-white border border-gray-200 rounded">
      <thead>
        <tr>
          <th class="px-4 py-2 border-b text-center align-middle">ID</th>
          <th class="px-4 py-2 border-b text-center align-middle">NOME</th>
          <th class="px-4 py-2 border-b text-center align-middle">ESPECIALIDADE</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prof in profissionais" :key="prof.profissional_id">
          <td class="px-4 py-2 border-b text-center align-middle">{{ prof.profissional_id }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ prof.nome }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ prof.especialidade }}</td>
        </tr>
        <tr v-if="!profissionais || profissionais.length === 0">
          <td colspan="3" class="text-center py-4 text-gray-400">Nenhum profissional cadastrado.</td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="mt-4 text-blue-500">Carregando...</div>
    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'

const { profissionais, loading, error, fetchProfissionais } = useProfissionais()

onMounted(() => {
  fetchProfissionais()
})
</script>
