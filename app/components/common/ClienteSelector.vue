<template>
  <div>
    <BaseInput v-model="text" :placeholder="placeholder" clearable @clear="clear" />
    <div v-if="showList && text.length > 0 && filtered.length > 0" class="border rounded-md bg-white shadow mt-1 max-h-40 overflow-auto z-50">
      <div v-for="c in filtered" :key="c.id" class="px-3 py-2 hover:bg-primary-50 cursor-pointer text-sm" @click="select(c)">
        {{ c.nome }} <span class="text-neutral-400">({{ c.cpf }})</span>
      </div>
    </div>
    <div v-if="text.length > 0 && filtered.length === 0 && !loading" class="mt-2 text-sm text-neutral-500">Cliente não encontrado.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseInput from '../BaseInput.vue'
import { useClientes } from '~/composables/useClientes'

const props = defineProps<{ modelValue?: string; placeholder?: string }>()
const emit = defineEmits(['update:modelValue', 'select'])

const { clientes, fetchClientes, loading } = useClientes()
if (!clientes.value) fetchClientes()

const text = ref(props.modelValue || '')
const showList = ref(true)

const filtered = computed(() => {
  if (!clientes.value) return []
  const busca = (text.value || '').trim().toLowerCase()
  if (!busca) return clientes.value
  return clientes.value.filter(c => (c.nome && c.nome.toLowerCase().includes(busca)) || (c.cpf && c.cpf.replace(/\D/g, '').includes(busca.replace(/\D/g, ''))))
})

function select(c: any) {
  emit('update:modelValue', c.nome)
  emit('select', c)
  showList.value = false
}

function clear() {
  text.value = ''
  emit('update:modelValue', '')
  showList.value = true
}

watch(() => props.modelValue, (v) => { text.value = v || '' })
watch(text, (v) => { emit('update:modelValue', v); if (!v) showList.value = true })
</script>

<style scoped>
</style>
