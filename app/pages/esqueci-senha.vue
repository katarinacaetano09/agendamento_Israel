<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-semibold mb-4">Esqueci minha senha</h1>

      <form @submit.prevent="handleSend" class="space-y-4" novalidate>
        <BaseInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="Digite seu email cadastrado"
          required
        />

        <div class="pt-2">
          <BaseButton :loading="sending" type="submit" class="w-full">Enviar link de recuperação</BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
// useSupabaseClient is auto-imported by Nuxt
import pkgToast from 'vue-toastification'
const useToast = () => (pkgToast as any).useToast()

const email = ref('')
const sending = ref(false)

const supabase = useSupabaseClient()
const toast = useToast()

async function handleSend() {
  if (!email.value) {
    toast.error('Informe o email')
    return
  }
  try {
    sending.value = true
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      // redirect the user to the recuperar-senha page after they click the link
      redirectTo: (process.env.SITE_URL || window.location.origin) + '/recuperar-senha'
    })
    if (error) {
      toast.error(error.message || 'Erro ao enviar link')
    } else {
      toast.success('Link de recuperação enviado. Verifique seu email.')
    }
  } finally {
    sending.value = false
  }
}
</script>
