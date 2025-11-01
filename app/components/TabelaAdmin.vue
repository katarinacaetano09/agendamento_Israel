<template>
  <div class="bg-white rounded shadow p-4">
    <h2 class="text-lg font-medium mb-3">Usuários do sistema</h2>

    <div v-if="loadingLocal" class="py-8 text-center text-neutral-600">Carregando...</div>

    <div v-else>
      <div class="flex justify-end mb-3">
        <BaseButton @click="showModal = true">Novo Usuário</BaseButton>
      </div>

      <table class="w-full table-auto text-sm">
        <thead>
          <tr class="text-left border-b">
            <th class="py-2">ID</th>
            <th class="py-2">Nome</th>
            <th class="py-2">Email</th>
            <th class="py-2 w-16">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in simpleProfiles || []" :key="p.id" class="border-b last:border-b-0">
            <td class="py-2">{{ p.id }}</td>
            <td class="py-2">{{ p.nome }}</td>
            <td class="py-2">{{ p.email ?? '-' }}</td>
            <td class="py-2">
              <button 
                @click="showDeleteConfirm(p)" 
                class="text-red-600 hover:text-red-800 transition-colors p-1"
                title="Deletar usuário"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!simpleProfiles || simpleProfiles.length === 0" class="py-4 text-neutral-600">Nenhum usuário encontrado.</div>
    </div>

    <BaseModal :show="showModal" @cancel="handleCancel" @confirm="handleConfirm">
      <template #header>
        <h3 class="text-lg font-semibold">Novo Usuário</h3>
        <button @click="handleCancel" class="text-gray-400 hover:text-gray-600">
          <span aria-hidden="true">&times;</span>
        </button>
      </template>

      <div class="space-y-3 px-2">
        <div v-if="creatingUser" class="text-blue-600 text-sm">Criando usuário...</div>
        <div v-if="createUserError" class="text-red-600 text-sm">{{ createUserError }}</div>
        
        <BaseInput v-model="novoNome" label="Nome" placeholder="Nome completo" />
        <BaseInput v-model="novoEmail" label="Email" type="email" placeholder="email@exemplo.com" />
        <BaseInput v-model="novaSenha" label="Senha" type="password" placeholder="Senha" />
        <div>
          <label class="block text-sm font-medium mb-1" for="tipoUsuario">Tipo de Usuário</label>
          <select id="tipoUsuario" v-model="tipoUsuario" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300">
            <option value="">Selecione o tipo de usuário</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuário</option>
          </select>
        </div>
      </div>
      <!-- Rodapé padrão do BaseModal: Cancelar e Confirmar -->
    </BaseModal>

    <!-- Modal de confirmação para deletar -->
    <BaseModal :show="showDeleteModal" @cancel="handleCancelDelete" @confirm="handleConfirmDelete">
      <template #header>
        <h3 class="text-lg font-semibold">Confirmar Exclusão</h3>
        <button @click="handleCancelDelete" class="text-gray-400 hover:text-gray-600">
          <span aria-hidden="true">&times;</span>
        </button>
      </template>

      <div class="px-2">
        <div v-if="deletingUser" class="text-blue-600 text-sm mb-3">Deletando usuário...</div>
        <div v-if="deleteUserError" class="text-red-600 text-sm mb-3">{{ deleteUserError }}</div>
        
        <p class="text-gray-700">
          Tem certeza que deseja deletar o usuário <strong>{{ userToDelete?.nome }}</strong>?
        </p>
        <p class="text-sm text-gray-500 mt-2">
          Esta ação não pode ser desfeita. O usuário será removido permanentemente do sistema.
        </p>
      </div>
      <!-- Rodapé padrão do BaseModal: Cancelar e Confirmar -->
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import BaseButton from '~/components/BaseButton.vue'
import BaseModal from '~/components/BaseModal.vue'
import BaseInput from '~/components/BaseInput.vue'

const { simpleProfiles, fetchSimpleProfiles } = useProfissionais()
const loadingLocal = ref(false)

// modal state and form
const showModal = ref(false)
const novoNome = ref('')
const novoEmail = ref('')
const novaSenha = ref('')
const tipoUsuario = ref('')
const creatingUser = ref(false)
const createUserError = ref<string | null>(null)

// delete user state
const showDeleteModal = ref(false)
const userToDelete = ref<any>(null)
const deletingUser = ref(false)
const deleteUserError = ref<string | null>(null)

function resetForm() {
  novoNome.value = ''
  novoEmail.value = ''
  novaSenha.value = ''
  tipoUsuario.value = ''
  createUserError.value = null
}

function handleCancel() {
  showModal.value = false
  resetForm()
}

async function handleConfirm() {
  if (!novoNome.value || !novoEmail.value || !novaSenha.value || !tipoUsuario.value) {
    createUserError.value = 'Preencha todos os campos'
    return
  }
  
  creatingUser.value = true
  createUserError.value = null
  
  try {
    const role = tipoUsuario.value === 'admin' ? 'admin' : 'user'
    const data = await $fetch('/api/created_user', {
      method: 'POST',
      body: {
        nome: novoNome.value,
        email: novoEmail.value,
        password: novaSenha.value,
        role
      }
    })
    
    if ((data as any)?.success) {
      await fetchSimpleProfiles()
      showModal.value = false
      resetForm()
    } else {
      createUserError.value = (data as any)?.error || 'Erro ao criar usuário'
    }
  } catch (e: any) {
    createUserError.value = e?.data?.message || e?.message || 'Erro ao criar usuário'
  } finally {
    creatingUser.value = false
  }
}

function showDeleteConfirm(user: any) {
  userToDelete.value = user
  showDeleteModal.value = true
  deleteUserError.value = null
}

function handleCancelDelete() {
  showDeleteModal.value = false
  userToDelete.value = null
  deleteUserError.value = null
}

async function handleConfirmDelete() {
  if (!userToDelete.value?.user_id) {
    deleteUserError.value = 'Usuário inválido'
    return
  }
  
  deletingUser.value = true
  deleteUserError.value = null
  
  try {
    const data = await $fetch('/api/delete_user', {
      method: 'POST',
      body: {
        user_id: userToDelete.value.user_id
      }
    })
    
    if ((data as any)?.success) {
      await fetchSimpleProfiles()
      showDeleteModal.value = false
      userToDelete.value = null
    } else {
      deleteUserError.value = (data as any)?.error || 'Erro ao deletar usuário'
    }
  } catch (e: any) {
    deleteUserError.value = e?.data?.message || e?.message || 'Erro ao deletar usuário'
  } finally {
    deletingUser.value = false
  }
}

onMounted(async () => {
  loadingLocal.value = true
  try {
    await fetchSimpleProfiles()
  } finally {
    loadingLocal.value = false
  }
})
</script>
