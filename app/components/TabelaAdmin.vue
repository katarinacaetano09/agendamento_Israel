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
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in simpleProfiles || []" :key="p.id" class="border-b last:border-b-0">
            <td class="py-2">{{ p.id }}</td>
            <td class="py-2">{{ p.nome }}</td>
            <td class="py-2">{{ p.email ?? '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!simpleProfiles || simpleProfiles.length === 0" class="py-4 text-neutral-600">Nenhum usuário encontrado.</div>
    </div>

    <BaseModal :show="showModal" @cancel="handleCancel" @confirm="handleConfirm">
      <template #header>
        <h3 class="text-lg font-semibold">Novo Usuário</h3>
      </template>

      <div class="space-y-3 px-2">
        <BaseInput v-model="novoNome" label="Nome" placeholder="Nome completo" />
        <BaseInput v-model="novoEmail" label="Email" type="email" placeholder="email@exemplo.com" />
        <BaseInput v-model="novaSenha" label="Senha" type="password" placeholder="Senha" />
      </div>
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

function resetForm() {
  novoNome.value = ''
  novoEmail.value = ''
  novaSenha.value = ''
}

function handleCancel() {
  showModal.value = false
  resetForm()
}

function handleConfirm() {
  // apenas fechar por enquanto — não implementar criação ainda
  showModal.value = false
  resetForm()
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
