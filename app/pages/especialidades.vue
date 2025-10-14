
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Especialidades</h1>
      <BaseButton
        label="Adicionar"
        variant="primary"
        size="md"
        class="ml-4"
        :disabled="!isAdmin"
        @click="openAddModal"
      >
        <template #icon-left>
          <HeroiconsPencilSquare class="w-5 h-5 mr-1" />
        </template>
      </BaseButton>
  <EspecialidadeModal
    :show="showAddModal"
    :isEdit="false"
    @close="showAddModal = false"
    @save="onSaveEspecialidade"
  />
  <EspecialidadeModal
    :show="showEditModal"
    :isEdit="true"
    :id="editId !== null ? editId : undefined"
    @close="closeEditModal"
    @save="onSaveEditEspecialidade"
  />
    </div>
    <table class="min-w-full bg-white border border-gray-200 rounded">
      <thead>
        <tr>
          <th class="px-4 py-2 border-b text-center align-middle">ID</th>
          <th class="px-4 py-2 border-b text-center align-middle">ESPECIALIDADE</th>
          <th class="px-4 py-2 border-b text-center align-middle">AÇÃO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="esp in especialidades" :key="esp.id">
          <td class="px-4 py-2 border-b text-center align-middle">{{ esp.id }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ esp.especialidade }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">
            <BaseButton
              variant="ghost"
              size="sm"
              :disabled="!isAdmin"
              title="Editar"
              class="p-1 text-blue-500 hover:text-blue-700"
              @click="openEditModal(esp.id)"
            >
              <template #icon-left>
                <HeroiconsPencilSquare class="w-5 h-5" />
              </template>
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="sm"
              :disabled="!isAdmin"
              title="Deletar"
              class="p-1 text-red-500 hover:text-red-700 ml-2"
              @click="openDeleteModal(esp.id, esp.especialidade)"
            >
              <template #icon-left>
                <HeroiconsTrash class="w-5 h-5" />
              </template>
            </BaseButton>
  <ConfirmDeleteModal
    :show="showDeleteModal"
    :nome="deleteNome"
    @cancel="closeDeleteModal"
    @confirm="onConfirmDelete"
  />
          </td>
        </tr>
        <tr v-if="!especialidades || especialidades.length === 0">
          <td colspan="3" class="text-center py-4 text-gray-400">Nenhuma especialidade cadastrada.</td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="mt-4 text-blue-500">Carregando...</div>
    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { useProfissionais } from '../composables/useProfissionais'
import { PencilSquareIcon as HeroiconsPencilSquare, TrashIcon as HeroiconsTrash, PlusIcon as HeroiconsPlus } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/BaseButton.vue'
import EspecialidadeModal from '~/components/EspecialidadeModal.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'

const { especialidades, loading, error, fetchEspecialidades, addEspecialidade, editEspecialidade, deleteEspecialidade } = useProfissionais()

const showDeleteModal = ref(false)
const deleteId = ref<number|null>(null)
const deleteNome = ref('')

function openDeleteModal(id: number, nome: string | null) {
  deleteId.value = id
  deleteNome.value = nome ?? ''
  showDeleteModal.value = true
}


function closeDeleteModal() {
  showDeleteModal.value = false
  deleteId.value = null
}

async function onConfirmDelete() {
  if (deleteId.value !== null) {
    const result = await deleteEspecialidade(deleteId.value)
    if (result.success) {
      await fetchEspecialidades()
      // Aqui pode exibir um toast de sucesso se desejar
      closeDeleteModal()
    } else {
      // Aqui pode exibir um toast de erro se desejar
      alert(result.message)
    }
  }
}

// Verifica se o usuário é admin
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)
const isAdmin = computed(() => profile.value?.role === 'admin')


const showAddModal = ref(false)
const showEditModal = ref(false)
const editId = ref<number|null>(null)

function openAddModal() {
  showAddModal.value = true
}

function openEditModal(id: number) {
  editId.value = id
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editId.value = null
}

async function onSaveEspecialidade(data: any) {
  // Chama a função do composable para adicionar especialidade
  const result = await addEspecialidade(data.especialidade)
  if (result.success) {
    await fetchEspecialidades()
    // Aqui pode exibir um toast de sucesso se desejar
    showAddModal.value = false
  } else {
    // Aqui pode exibir um toast de erro se desejar
    alert(result.message)
  }
}

async function onSaveEditEspecialidade(data: any) {
  // Chama a função do composable para editar especialidade
  const result = await editEspecialidade(data.id, data.especialidade)
  if (result.success) {
    await fetchEspecialidades()
    // Aqui pode exibir um toast de sucesso se desejar
    showEditModal.value = false
    editId.value = null
  } else {
    // Aqui pode exibir um toast de erro se desejar
    alert(result.message)
  }
}

onMounted(() => {
  fetchEspecialidades()
})

// Configuração da página
useHead({
  title: 'Especialidades - Sistema de Agendamentos',
  meta: [
    { name: 'description', content: 'Gerenciar especialidades do sistema de agendamentos' }
  ]
})
</script>