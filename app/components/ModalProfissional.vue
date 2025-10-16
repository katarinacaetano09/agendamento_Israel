<!-- ModalProfissional.vue: Modal para adicionar/editar profissional -->
<template>
  <BaseModal :show="show" @cancel="onCancel" @confirm="onConfirm">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ isEdit ? 'Editar Profissional' : 'Novo Profissional' }}
      </h3>
    </template>

    <form @submit.prevent="onConfirm">
      <!-- Dropdown de perfis (usuários) -->
      <label class="block mb-2 text-sm font-medium text-neutral-700">Usuário</label>
      <select v-model="selectedProfileId" required class="w-full mb-4 px-3 py-2 border rounded">
        <option value="" disabled>Selecione um usuário</option>
        <option v-for="profile in profiles" :key="profile.id" :value="profile.id">
          {{ profile.nome }}
        </option>
      </select>

      <!-- Dropdown de especialidades -->
      <label class="block mb-2 text-sm font-medium text-neutral-700">Especialidade</label>
      <select v-model="selectedEspecialidadeId" required class="w-full mb-4 px-3 py-2 border rounded">
        <option value="" disabled>Selecione uma especialidade</option>
        <option v-for="esp in especialidades" :key="esp.id" :value="esp.id">
          {{ esp.especialidade }}
        </option>
      </select>
    </form>

    <template #footer>
      <BaseButton @click="onCancel" variant="secondary">Cancelar</BaseButton>
      <BaseButton @click="onConfirm" variant="primary">
        {{ isEdit ? 'Salvar' : 'Adicionar' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
// Modal para adicionar/editar profissional
import { ref, watch, defineProps, defineEmits } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import type { Especialidade } from '../../shared/types/Especialidade'
import type { SimpleProfile } from '../../shared/types/SimpleProfile'

// Props recebidas do parent
const props = defineProps({
  show: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  profiles: { type: Array as () => SimpleProfile[], default: () => [] }, // lista de perfis
  especialidades: { type: Array as () => Especialidade[], default: () => [] }, // lista de especialidades
  initialProfileId: { type: [Number, String], default: '' }, // para edição
  initialEspecialidadeId: { type: [Number, String], default: '' } // para edição
})

const emit = defineEmits(['close', 'save'])

// Estado local dos selects (aceita string ou number)
const selectedProfileId = ref<string | number>('')
const selectedEspecialidadeId = ref<string | number>('')

// Atualiza selects se abrir para edição ou quando os valores iniciais mudam
watch([
  () => props.show,
  () => props.initialProfileId,
  () => props.initialEspecialidadeId
], ([show, initialProfileId, initialEspecialidadeId]) => {
  console.log('[ModalProfissional] watch', { show, initialProfileId, initialEspecialidadeId, isEdit: props.isEdit })
  if (show && props.isEdit) {
    selectedProfileId.value = initialProfileId ?? ''
    selectedEspecialidadeId.value = initialEspecialidadeId ?? ''
  } else if (show && !props.isEdit) {
    selectedProfileId.value = ''
    selectedEspecialidadeId.value = ''
  }
})

function onCancel() {
  emit('close')
}
function onConfirm() {
  // Emite os ids selecionados para o parent
  emit('save', {
    profileId: selectedProfileId.value,
    especialidadeId: selectedEspecialidadeId.value
  })
}
</script>
