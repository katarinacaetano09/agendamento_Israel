<template>
  <BaseModal :show="show" @cancel="onCancel" @confirm="onConfirm">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ isEdit ? 'Editar Especialidade' : 'Nova Especialidade' }}
      </h3>
    </template>

    <form @submit.prevent="onConfirm">
      <BaseInput
  v-model="especialidadeProxy"
        label="Nome da Especialidade"
        placeholder="Digite o nome"
        required
      />
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
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import type { Especialidade } from '../../shared/types/Especialidade'

const props = defineProps({
  show: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  id: { type: [String, Number], default: null }
})

const emit = defineEmits(['close', 'save'])

const especialidade = ref<Partial<Especialidade>>({ especialidade: '' })

// Proxy para garantir que o v-model nunca seja null
const especialidadeProxy = computed({
  get: () => especialidade.value.especialidade ?? '',
  set: (val: string) => { especialidade.value.especialidade = val }
})

watch(() => props.show, (val) => {
  if (val && props.isEdit && props.id) {
    // Buscar dados da especialidade para edição (mock)
    // Substitua por chamada real se necessário
    especialidade.value = { especialidade: 'Especialidade Exemplo', id: Number(props.id) }
  } else if (val && !props.isEdit) {
    especialidade.value = { especialidade: '' }
  }
})

function onCancel() {
  emit('close')
}

function onConfirm() {
  emit('save', { ...especialidade.value, id: props.isEdit ? Number(props.id) : undefined })
}
</script>
