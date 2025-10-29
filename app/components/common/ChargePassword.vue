<template>
  <div class="space-y-3">
    <BaseInput
      label="Senha atual"
      type="password"
      v-model="senhaLocal"
      placeholder="Digite sua senha atual"
    />

    <BaseInput
      label="Nova senha"
      type="password"
      v-model="novaSenhaLocal"
      placeholder="Digite a nova senha"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '~/components/BaseInput.vue'

const props = withDefaults(defineProps<{
  senha?: string | null
  novaSenha?: string | null
}>(), {
  senha: null,
  novaSenha: null
})

// define emits for v-model bindings
const emit = defineEmits(["update:senha", "update:novaSenha"])

const senhaLocal = ref(props.senha ?? '')
const novaSenhaLocal = ref(props.novaSenha ?? '')

watch(senhaLocal, (v) => emit('update:senha', v))
watch(novaSenhaLocal, (v) => emit('update:novaSenha', v))

// keep props in sync when parent updates
watch(() => props.senha, (v) => { if (v !== senhaLocal.value) senhaLocal.value = v ?? '' })
watch(() => props.novaSenha, (v) => { if (v !== novaSenhaLocal.value) novaSenhaLocal.value = v ?? '' })
</script>
