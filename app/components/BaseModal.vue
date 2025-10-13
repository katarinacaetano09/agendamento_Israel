<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <slot name="header">
          <h3 class="text-lg font-semibold">Modal</h3>
        </slot>
        <button @click="onCancel" class="text-gray-400 hover:text-gray-600">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <!-- Main Content -->
      <div class="px-6 py-4">
        <slot />
      </div>
      <!-- Footer -->
      <div class="flex justify-end gap-2 px-6 py-4 border-t">
        <slot name="footer">
          <BaseButton @click="onCancel" variant="secondary">Cancelar</BaseButton>
          <BaseButton @click="onConfirm" variant="primary">Confirmar</BaseButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function onConfirm() {
  emit('confirm')
}
function onCancel() {
  emit('cancel')
}
</script>
