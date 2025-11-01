<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold text-neutral-800 dark:text-white">Clientes</h1>
      <BaseButton
        label="Adicionar"
        variant="primary"
        size="md"
        class="ml-4"
        @click="openAddModal"
      >
        <template #icon-left>
          <HeroiconsPlus class="w-5 h-5 mr-1" />
        </template>
      </BaseButton>
    </div>
    <ClienteModal
      :show="showAddModal"
      :isEdit="false"
      @close="showAddModal = false"
      @save="onSaveCliente"
    />
    <ClienteModal
      :show="showEditModal"
      :isEdit="true"
      :cliente="editClienteData"
      @close="closeEditModal"
      @save="onSaveEditCliente"
    />
    <ConfirmDeleteModal
      :show="showDeleteModal"
      :nome="deleteNome"
      @cancel="closeDeleteModal"
      @confirm="onConfirmDelete"
    />
    <table class="min-w-full bg-white border border-gray-200 rounded">
      <thead>
        <tr>
          <th class="px-4 py-2 border-b text-center align-middle">ID</th>
          <th class="px-4 py-2 border-b text-center align-middle">NOME</th>
          <th class="px-4 py-2 border-b text-center align-middle">CPF</th>
          <th class="px-4 py-2 border-b text-center align-middle">EMAIL</th>
          <th class="px-4 py-2 border-b text-center align-middle">TELEFONE</th>
          <th class="px-4 py-2 border-b text-center align-middle">ENDEREÇO</th>
          <th class="px-4 py-2 border-b text-center align-middle">AÇÃO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientes" :key="cliente.id">
          <td class="px-4 py-2 border-b text-center align-middle">{{ cliente.id }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ cliente.nome }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ cliente.cpf }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ cliente.email }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ cliente.telefone }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ cliente.endereco }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">
            <BaseButton
              variant="ghost"
              size="sm"
              title="Editar"
              class="p-1 text-blue-500 hover:text-blue-700"
              @click="openEditModal(cliente)"
            >
              <template #icon-left>
                <HeroiconsPencil class="w-5 h-5" />
              </template>
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="sm"
              title="Deletar"
              class="p-1 text-red-500 hover:text-red-700 ml-2"
              @click="openDeleteModal(cliente.id, cliente.nome)"
            >
              <template #icon-left>
                <HeroiconsTrash class="w-5 h-5" />
              </template>
            </BaseButton>
          </td>
        </tr>
        <tr v-if="!clientes || clientes.length === 0">
          <td colspan="7" class="text-center py-4 text-gray-400">Nenhum cliente cadastrado.</td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="mt-4 text-blue-500">Carregando...</div>
    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as VueToastification from 'vue-toastification'
const useToast = (VueToastification as any).useToast || (VueToastification as any).default?.useToast
import { useClientes } from '../composables/useClientes'
import { PlusIcon as HeroiconsPlus, PencilIcon as HeroiconsPencil, TrashIcon as HeroiconsTrash } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/BaseButton.vue'
import ClienteModal from '~/components/ClienteModal.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import type { Cliente, ClienteInsert } from '../../shared/types/Cliente'

const { clientes, loading, error, fetchClientes, addCliente, editCliente, deleteCliente } = useClientes()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editClienteData = ref<ClienteInsert>({ nome: '', cpf: '', email: '', telefone: '', endereco: '' })
const editId = ref<number | null>(null)
const deleteId = ref<number | null>(null)
const deleteNome = ref('')

function openAddModal() {
  showAddModal.value = true
}

function openEditModal(cliente: Cliente) {
  editId.value = cliente.id
  editClienteData.value = {
    nome: cliente.nome ?? '',
    cpf: cliente.cpf ?? '',
    email: cliente.email ?? '',
    telefone: cliente.telefone ?? '',
    endereco: cliente.endereco ?? ''
  }
  showEditModal.value = false
  // Garante que o modal será reaberto com os dados atualizados
  setTimeout(() => {
    showEditModal.value = true
  }, 0)
}

function closeEditModal() {
  showEditModal.value = false
  editId.value = null
  editClienteData.value = { nome: '', cpf: '', email: '', telefone: '', endereco: '' }
}

function openDeleteModal(id: number, nome: string | null | undefined) {
  deleteId.value = id
  deleteNome.value = nome || ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  deleteId.value = null
  deleteNome.value = ''
}

const toast = useToast()

async function onSaveCliente(data: ClienteInsert) {
  const result = await addCliente(data)
  if (result.success) {
    await fetchClientes()
    showAddModal.value = false
    toast.success('Cliente cadastrado com sucesso!')
  } else {
    toast.error(result.message)
  }
}

async function onSaveEditCliente(data: ClienteInsert) {
  if (editId.value !== null) {
    const result = await editCliente(editId.value, data)
    if (result.success) {
      await fetchClientes()
      closeEditModal()
    } else {
      alert(result.message)
    }
  }
}

async function onConfirmDelete() {
  if (deleteId.value !== null) {
    const result = await deleteCliente(deleteId.value)
    if (result.success) {
      await fetchClientes()
      closeDeleteModal()
      toast.success('Cliente deletado com sucesso!')
    } else {
      toast.error(result.message)
    }
  }
}

onMounted(() => {
  fetchClientes()
})

// Configuração da página - useHead é auto-importado pelo Nuxt
// useHead({
//   title: 'Clientes - Sistema de Agendamentos',
//   meta: [
//     { name: 'description', content: 'Gerenciar clientes do sistema de agendamentos' }
//   ]
// })
</script>