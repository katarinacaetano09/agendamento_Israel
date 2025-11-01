<template>
  <div class="max-w-xl mx-auto py-12 px-4">
    <h1 class="text-2xl font-semibold mb-4">Recuperar senha</h1>
    <p class="text-sm text-gray-600 mb-6">Cole o link do email de recuperação aqui ou apenas insira a nova senha abaixo.</p>

    <ChargePassword @update:novaSenha="onNovaSenha" @update:confirmNovaSenha="onConfirm" />

    <div class="pt-4">
      <BaseButton @click="goHome">Voltar</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChargePassword from '~/components/common/ChargePassword.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useRouter } from 'vue-router'
import pkgToast from 'vue-toastification'
const useToast = () => (pkgToast as any).useToast()

const router = useRouter()
const toast = useToast()

function onNovaSenha(val: string) {
  // optional: react to value updates if needed
}

function onConfirm(val: string) {
  // optional
}

function goHome() {
  toast.success('Senha alterada com sucesso (se aplicável)')
  router.push('/')
}
</script>
