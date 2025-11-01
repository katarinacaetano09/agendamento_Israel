<template>
  <BaseModal :show="show" @cancel="onCancel" @confirm="onConfirm">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ isEdit ? 'Editar Cliente' : 'Novo Cliente' }}
      </h3>
      <button @click="onCancel" class="text-gray-400 hover:text-gray-600">
        <span aria-hidden="true">&times;</span>
      </button>
    </template>

    <form @submit.prevent="onConfirm">
      <BaseInput
        v-model="cliente.nome"
        label="Nome"
        placeholder="Digite o nome"
        required
        :error="errors.nome"
      />
      <BaseInput
        v-model="cpfMasked"
        label="CPF"
        placeholder="Digite o CPF"
        required
        :error="errors.cpf"
      />
      <BaseInput
        v-model="cliente.email"
        label="Email"
        placeholder="Digite o email"
        type="email"
        :error="errors.email"
      />
      <BaseInput
        v-model="telefoneMasked"
        label="Telefone"
        placeholder="Digite o telefone"
        :error="errors.telefone"
      />
      <BaseInput
        v-model="cliente.endereco"
        label="Endereço"
        placeholder="Digite o endereço"
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
import { ref, defineProps, defineEmits, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import type { ClienteInsert } from '../../shared/types/Cliente'

const props = defineProps({
  show: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  cliente: { type: Object as () => ClienteInsert, default: () => ({ nome: '', cpf: '', email: '', telefone: '', endereco: '' }) }
})

const emit = defineEmits(['close', 'save'])

const cliente = ref<ClienteInsert>({ nome: '', cpf: '', email: '', telefone: '', endereco: '' })

// Máscara e validação CPF
const cpfMasked = computed({
  get() {
    const digits = (cliente.value.cpf || '').replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0,3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`
    return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`
  },
  set(val: string) {
    cliente.value.cpf = val.replace(/\D/g, '').slice(0, 11)
  }
})

// Máscara e validação telefone
const telefoneMasked = computed({
  get() {
    const digits = (cliente.value.telefone || '').replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0,2)})${digits.slice(2)}`
    return `(${digits.slice(0,2)})${digits.slice(2,7)}-${digits.slice(7)}`
  },
  set(val: string) {
    cliente.value.telefone = val.replace(/\D/g, '').slice(0, 11)
  }
})

// Validação de email
function isEmailValid(email: string) {
  if (!email) return true
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

const errors = ref<{ nome?: string; cpf?: string; email?: string; telefone?: string }>({})

function onCancel() {
  emit('close')
}

function onConfirm() {
  errors.value = {}
  if (!cliente.value.nome || cliente.value.nome.trim() === '') {
    errors.value.nome = 'Nome é obrigatório.'
  }
  if (!cliente.value.cpf || cliente.value.cpf.length !== 11) {
    errors.value.cpf = 'CPF deve ter 11 números.'
  }
  if (cliente.value.email && !isEmailValid(cliente.value.email)) {
    errors.value.email = 'Email inválido.'
  }
  if (cliente.value.telefone && cliente.value.telefone.length < 10) {
    errors.value.telefone = 'Telefone deve ter ao menos 10 dígitos.'
  }
  if (Object.keys(errors.value).length > 0) return
  emit('save', { ...cliente.value })
}
</script>

watch([
  () => props.show,
  () => props.cliente
], ([show, clienteProp]) => {
  if (show) {
    // Sempre faz um reset profundo do objeto local
    cliente.value = { ...clienteProp }
  }
})