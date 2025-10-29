<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Meu Perfil</h1>

    <div class="bg-neutral-800 p-6 rounded-lg space-y-4">
      <BaseInput label="Nome" v-model="nome" placeholder="Seu nome" />
      <BaseInput label="Email" v-model="email" placeholder="Seu email" disabled />

      <div class="pt-4">
        <h2 class="text-lg font-medium mb-2">Alterar senha</h2>
        <ChargePassword v-model:senha="senha" v-model:novaSenha="novaSenha" />
      </div>

      <div class="pt-4">
        <!-- Ainda sem ação; o botão é apenas visual por enquanto -->
        <BaseButton class="mt-2">Salvar alterações</BaseButton>
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
const senha = ref('')
const novaSenha = ref('')

// sincroniza quando o profile é carregado/atualizado
watch(() => userStore.profile, (p) => {
  nome.value = p?.nome ?? ''
})

// sincroniza email quando auth user muda
watch(() => user.value, (u) => {
  email.value = u?.email ?? ''
})
</script>
