<template>
  <div class="flex flex-col items-center justify-center text-center w-full">
    <div class="w-full cursor-pointer" @click="openModal">
      <div class="text-lg font-bold text-neutral-800" v-if="profissional">
        {{ profissional.nome }}
      </div>
      <div class="text-base text-neutral-500 mt-1" v-if="especialidade">
        {{ especialidade }}
      </div>
    </div>
    <div v-if="loading" class="mt-2 text-blue-500 text-sm">Carregando...</div>
    <div v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</div>

    <ProfissionalListModal
      :show="showModal"
      :profissionais="profissionais"
      :loading="loading"
      :error="error"
      :selectedId="profissional?.profissional_id"
      @update:show="(v) => (showModal = v)"
      @select="onSelectProfissional"
      @cancel="onCancelModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import { useUserStore } from '~/stores/user'
import { useAgendamentoStore } from '~/stores/agendamento'
import ProfissionalListModal from './ProfissionalListModal.vue'

const { profissionais, especialidades, fetchProfissionais, fetchEspecialidades, loading, error } = useProfissionais()
const userStore = useUserStore()
const profile = userStore.profile

const profissional = ref<any>(null)

const especialidade = ref<string>('')

const showModal = ref(false)

const agendamentoStore = useAgendamentoStore()

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
  // store selected professional in agendamento store
  agendamentoStore.setSelectedProfissional(profissional.value)
  if (encontrado && especialidades.value) {
    const esp = especialidades.value.find((e: any) => e.id === encontrado.especialidade_id)
    especialidade.value = (esp && esp.especialidade) ? String(esp.especialidade) : ''
  } else {
    especialidade.value = ''
  }
})

function openModal() {
  showModal.value = true
}

function onSelectProfissional(p: any) {
  profissional.value = p || null
  // update especialidade text if available
  if (p && especialidades.value) {
    const esp = especialidades.value.find((e: any) => e.id === p.especialidade_id)
    especialidade.value = (esp && esp.especialidade) ? String(esp.especialidade) : ''
  } else {
    especialidade.value = ''
  }
  // update agendamento store
  agendamentoStore.setSelectedProfissional(profissional.value)
  showModal.value = false
}

function onCancelModal() {
  showModal.value = false
}
</script>
