
<template>
  <BaseModal :show="show" @cancel="onCancel" @confirm="onConfirm">
    <template #header>
      <h3 class="text-lg font-semibold text-red-600">Excluir Especialidade</h3>
    </template>
    <div class="py-4 text-center">
      <p class="text-lg font-medium">{{ nome }}</p>
    </div>
    <template #footer>
      <BaseButton @click="onCancel" variant="secondary">Cancelar</BaseButton>
      <BaseButton @click="onConfirm" variant="danger">Excluir</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  nome: { type: String, default: '' }
})
const emit = defineEmits(['cancel', 'confirm'])

function onCancel() {
  emit('cancel')
}
function onConfirm() {
  emit('confirm')
}
</script>
