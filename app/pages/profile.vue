<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-semibold mb-4">Meu Perfil</h1>

  <div class="bg-white text-neutral-900 p-6 rounded-lg space-y-4 shadow">
  <BaseInput label="Nome" v-model="nome" placeholder="Seu nome" />
  <BaseInput label="Email" :modelValue="email" @update:modelValue="setEmail" placeholder="Seu email" />

      <div class="pt-4">
        <h2 class="text-lg font-medium mb-2">Alterar senha</h2>
  <ChargePassword v-model:novaSenha="novaSenha" v-model:confirmNovaSenha="confirmNovaSenha" />
      </div>

      <div class="pt-4">
  <!-- Botão salva apenas o nome (a alteração de senha é independente) -->
  <BaseButton class="mt-2" :disabled="saving" @click="saveChanges">Salvar alterações</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import ChargePassword from '~/components/common/ChargePassword.vue'
import { useUserStore } from '~/stores/user'
import { useAuth } from '~/composables/useAuth'

// Usa o layout padrão do projeto

const userStore = useUserStore()
const { user } = useAuth()

// campos locais (editáveis)
const nome = ref(userStore.profile?.nome ?? '')
const email = ref(user.value?.email ?? '')

// senha fields para o componente (ainda sem ação)
const novaSenha = ref('')
const confirmNovaSenha = ref('')
const saving = ref(false)

const { updateName } = useAuth()

// sincroniza quando o profile é carregado/atualizado
watch(() => userStore.profile, (p) => {
  nome.value = p?.nome ?? ''
})

// sincroniza email quando auth user muda
watch(() => user.value, (u) => {
  email.value = u?.email ?? ''
})

function setEmail(v: string) {
  email.value = v
}

async function saveChanges() {
  if (!nome.value || nome.value.trim().length === 0) {
    // simple client validation
    const toast = (await import('vue-toastification')).useToast()
    toast.error('Nome não pode ficar vazio')
    return
  }
  try {
    saving.value = true
    const ok = await updateName(nome.value.trim())
    // ok already shows toast via composable; we can do extra handling if needed
    if (ok) {
      // nothing else for now
    }
  } finally {
    saving.value = false
  }
}
</script>
