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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '~/components/BaseInput.vue'

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

watch(novaSenhaLocal, (v) => emit('update:novaSenha', v))
watch(confirmNovaSenhaLocal, (v) => emit('update:confirmNovaSenha', v))

// keep props in sync when parent updates
watch(() => props.novaSenha, (v) => { if (v !== novaSenhaLocal.value) novaSenhaLocal.value = v ?? '' })
watch(() => props.confirmNovaSenha, (v) => { if (v !== confirmNovaSenhaLocal.value) confirmNovaSenhaLocal.value = v ?? '' })
</script>
