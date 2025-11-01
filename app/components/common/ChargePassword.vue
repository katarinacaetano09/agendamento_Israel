<template>
  <div class="space-y-3">
    <BaseInput
      label="Nova senha"
      type="password"
      v-model="novaSenhaLocal"
      placeholder="Digite a nova senha"
    />

    <BaseInput
      label="Confirme nova senha"
      type="password"
      v-model="confirmNovaSenhaLocal"
      placeholder="Repita a nova senha"
    />
    <div class="pt-2">
      <BaseButton :disabled="changing" @click="handleChange">Alterar senha</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import * as VueToastification from 'vue-toastification'
const useToast = (VueToastification as any).useToast || (VueToastification as any).default?.useToast
import { useAuth } from '~/composables/useAuth'

const props = withDefaults(defineProps<{
  novaSenha?: string | null
  confirmNovaSenha?: string | null
}>(), {
  novaSenha: null,
  confirmNovaSenha: null
})

// emits for v-model bindings
const emit = defineEmits(["update:novaSenha", "update:confirmNovaSenha"])

const novaSenhaLocal = ref(props.novaSenha ?? '')
const confirmNovaSenhaLocal = ref(props.confirmNovaSenha ?? '')
const changing = ref(false)

const toast = useToast()
const { updatePassword } = useAuth()

watch(novaSenhaLocal, (v) => emit('update:novaSenha', v))
watch(confirmNovaSenhaLocal, (v) => emit('update:confirmNovaSenha', v))

// keep props in sync when parent updates
watch(() => props.novaSenha, (v) => { if (v !== novaSenhaLocal.value) novaSenhaLocal.value = v ?? '' })
watch(() => props.confirmNovaSenha, (v) => { if (v !== confirmNovaSenhaLocal.value) confirmNovaSenhaLocal.value = v ?? '' })

async function handleChange() {
  if (!novaSenhaLocal.value) {
    toast.error('Informe a nova senha')
    return
  }
  if (novaSenhaLocal.value.length < 6) {
    toast.error('A senha deve ter pelo menos 6 caracteres')
    return
  }
  if (novaSenhaLocal.value !== confirmNovaSenhaLocal.value) {
    toast.error('As senhas não conferem')
    return
  }

  try {
    changing.value = true
    const ok = await updatePassword(novaSenhaLocal.value)
    if (ok) {
      // limpa campos e emite updates
      novaSenhaLocal.value = ''
      confirmNovaSenhaLocal.value = ''
      emit('update:novaSenha', '')
      emit('update:confirmNovaSenha', '')
    }
  } finally {
    changing.value = false
  }
}
</script>
