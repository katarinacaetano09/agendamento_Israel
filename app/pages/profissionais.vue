<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold text-neutral-800 dark:text-white">Profissionais</h1>
      <BaseButton
        label="Adicionar Profissional"
        variant="primary"
        size="md"
        class="ml-4"
        :disabled="!isAdmin"
        @click="openAddModal"
      >
        <template #icon-left>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        </template>
      </BaseButton>
    </div>
    <table class="min-w-full bg-white border border-gray-200 rounded">
      <thead>
        <tr>
          <th class="px-4 py-2 border-b text-center align-middle">ID</th>
          <th class="px-4 py-2 border-b text-center align-middle">NOME</th>
          <th class="px-4 py-2 border-b text-center align-middle">ESPECIALIDADE</th>
          <th class="px-4 py-2 border-b text-center align-middle">AÇÕES</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prof in profissionais || []" :key="prof.profissional_id">
          <td class="px-4 py-2 border-b text-center align-middle">{{ prof.profissional_id }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ prof.nome }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">{{ prof.especialidade }}</td>
          <td class="px-4 py-2 border-b text-center align-middle">
            <BaseButton
              variant="ghost"
              size="sm"
              :disabled="!isAdmin"
              title="Editar"
              class="p-1 text-blue-500 hover:text-blue-700"
              @click="() => openEditModal(prof)"
            >
              <template #icon-left>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
              </template>
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="sm"
              :disabled="!isAdmin"
              title="Deletar"
              class="p-1 text-red-500 hover:text-red-700 ml-2"
              @click="() => openDeleteModal(prof)"
            >
              <template #icon-left>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </template>
            </BaseButton>
          </td>
        </tr>
        <tr v-if="!profissionais || profissionais.length === 0">
          <td colspan="4" class="text-center py-4 text-gray-400">Nenhum profissional cadastrado.</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para adicionar profissional -->
    <ModalProfissional
      :show="showAddModal"
      :isEdit="false"
      :profiles="simpleProfiles || []"
      :especialidades="especialidades || []"
      @close="() => showAddModal = false"
      @save="onSaveProfissional"
    />
    <!-- Modal para editar profissional -->
    <ModalProfissional
      :show="showEditModal"
      :isEdit="true"
      :profiles="simpleProfiles || []"
      :especialidades="especialidades || []"
      :initialProfileId="editProfileId"
      :initialEspecialidadeId="editEspecialidadeId"
      @close="() => showEditModal = false"
      @save="onUpdateProfissional"
    />

    <!-- Modal de confirmação de exclusão -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      :nome="deleteNome"
  @cancel="() => showDeleteModal = false"
      @confirm="onDeleteProfissional"
    />
  </div>
</template>


<script setup lang="ts">


import { ref, computed, onMounted } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import { useUserStore } from '~/stores/user'
import BaseButton from '~/components/BaseButton.vue'
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import type { Profissional } from '~/../shared/types/Profissional'
import type { SimpleProfile } from '~/../shared/types/SimpleProfile'
import type { Especialidade } from '~/../shared/types/Especialidade'
import pkgToast from 'vue-toastification'
const useToast = () => (pkgToast as any).useToast()

const { profissionais, fetchProfissionais, fetchSimpleProfiles, fetchEspecialidades, simpleProfiles, especialidades, addProfissional, editProfissional, deleteProfissional } = useProfissionais()
// Handler para deletar profissional
async function onDeleteProfissional() {
  if (!deleteId.value) {
    toast.error('ID do profissional não encontrado.')
    return
  }
  const result = await deleteProfissional(Number(deleteId.value))
  if (result.success) {
    toast.success(result.message)
    await fetchProfissionais()
    showDeleteModal.value = false
  } else {
    toast.error(result.message)
  }
}
const toast = useToast()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.profile?.role === 'admin')

// Modais e dados para edição/exclusão (placeholders)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editProfileId = ref<string | number>('')
const editEspecialidadeId = ref<string | number>('')
const editId = ref<string | number>('') // id do profissional
const deleteId = ref<string | number | null>(null)
const deleteNome = ref('')

function openAddModal() { showAddModal.value = true }
function openEditModal(prof: Profissional) {
  editId.value = prof.profissional_id
  editProfileId.value = prof.profile_id
  editEspecialidadeId.value = prof.especialidade_id
  showEditModal.value = true
}
function openDeleteModal(prof: Profissional) {
  deleteId.value = prof.profissional_id
  deleteNome.value = prof.nome
  showDeleteModal.value = true
}

// Handlers para salvar/adicionar/editar profissional (placeholders)
async function onSaveProfissional(data: { profileId: string | number, especialidadeId: string | number }) {
  const result = await addProfissional(data.profileId, data.especialidadeId)
  if (result.success) {
    toast.success(result.message)
    await fetchProfissionais()
    showAddModal.value = false
  } else {
    toast.error(result.message)
  }
}
async function onUpdateProfissional(data: { profileId: string | number, especialidadeId: string | number }) {
  const profissionalId = editId.value
  if (!profissionalId) {
    toast.error('ID do profissional não encontrado.')
    return
  }
  const result = await editProfissional(Number(profissionalId), data.profileId, data.especialidadeId)
  if (result.success) {
    toast.success(result.message)
    await fetchProfissionais()
    showEditModal.value = false
  } else {
    toast.error(result.message)
  }
}

onMounted(async () => {
  await Promise.all([
    fetchProfissionais(),
    fetchSimpleProfiles(),
    fetchEspecialidades()
  ])
})

</script>