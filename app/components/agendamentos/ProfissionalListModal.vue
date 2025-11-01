<template>
  <BaseModal :show="show" @update:show="onUpdateShow" @cancel="onCancel">
    <template #header>
      <h3 class="text-lg font-semibold">Selecionar profissional</h3>
      <button @click="onCancel" class="text-gray-400 hover:text-gray-600">
        <span aria-hidden="true">&times;</span>
      </button>
    </template>

    <div class="px-2 py-2 max-h-80 overflow-auto">
      <div v-if="loading" class="text-sm text-gray-500">Carregando...</div>
      <div v-if="error" class="text-sm text-red-500">{{ error }}</div>
      <ul v-if="profissionais && profissionais.length" class="divide-y divide-gray-100">
        <li v-for="p in profissionais" :key="p.profissional_id" class="px-3 py-2 hover:bg-gray-50">
          <button type="button" class="w-full text-left flex items-center gap-3" @click="select(p)">
            <div class="flex-1">
              <div class="font-medium text-neutral-800">{{ p.nome || p.profile_name || ('#' + p.profissional_id) }}</div>
              <div class="text-sm text-neutral-500">{{ p.especialidade || '' }}</div>
            </div>
            <div v-if="selectedId && selectedId === p.profissional_id" class="text-sm text-blue-600">Selecionado</div>
          </button>
        </li>
      </ul>
      <div v-else class="text-sm text-gray-500">Nenhum profissional encontrado.</div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="onCancel">Fechar</BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'
import BaseButton from '../BaseButton.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  profissionais: { type: Array as () => Array<any>, default: () => [] },
  selectedId: { type: [Number, String, null], default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

const emit = defineEmits(['update:show', 'select', 'cancel'])

function onUpdateShow(val: boolean) {
  emit('update:show', val)
}

function select(p: any) {
  // normalize emitted object to always include profissional_id when possible
  const normalized = {
    ...p,
    profissional_id: p?.profissional_id ?? p?.id ?? p?.profissionalId ?? null
  }
  emit('select', normalized)
  emit('update:show', false)
}

function onCancel() {
  emit('cancel')
  emit('update:show', false)
}
</script>

<style scoped>
.profissional-item:hover { background: #f8fafc }
</style>
