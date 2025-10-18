<template>
  <div class="flex flex-col items-center justify-center text-center w-full">
    <div class="text-lg font-bold text-neutral-800" v-if="profissional">
      {{ profissional.nome }}
    </div>
    <div class="text-base text-neutral-500 mt-1" v-if="especialidade">
      {{ especialidade }}
    </div>
    <div v-if="loading" class="mt-2 text-blue-500 text-sm">Carregando...</div>
    <div v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'

const { profissionais, especialidades, fetchProfissionais, fetchEspecialidades, loading, error } = useProfissionais()
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

const profissional = ref<any>(null)

const especialidade = ref<string>('')

onMounted(async () => {
  await fetchProfissionais()
  await fetchEspecialidades()
  let lista = profissionais.value || []
  let userId = profile.value?.id
  let encontrado = lista.find((p: any) => p.profile_id === userId)
  if (!encontrado && lista.length > 0) {
    encontrado = lista[0]
  }
  profissional.value = encontrado || null
  if (encontrado && especialidades.value) {
    const esp = especialidades.value.find((e: any) => e.id === encontrado.especialidade_id)
    especialidade.value = (esp && esp.especialidade) ? String(esp.especialidade) : ''
  } else {
    especialidade.value = ''
  }
})
</script>
