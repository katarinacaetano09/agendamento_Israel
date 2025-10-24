<template>
  <div>
    <button type="button" class="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-300 bg-white text-sm"
      @click="open = !open"
      :aria-expanded="open"
    >
      <slot>Escolher cor</slot>
      <span class="w-4 h-4 rounded-full" :style="{ backgroundColor: bg }" aria-hidden="true"></span>
    </button>

    <div v-if="open" class="mt-2 p-2 border rounded-md bg-white shadow grid grid-cols-4 gap-2">
      <button v-for="c in cores" :key="c" type="button"
        class="w-8 h-8 rounded-full border-2 focus:outline-none"
        :class="{ 'ring-2 ring-offset-1 ring-black': modelValue === c }"
        :style="{ backgroundColor: c, borderColor: modelValue === c ? '#000000' : 'transparent' }"
        @click="select(c)"
        :aria-label="`Selecionar cor ${c}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
const props = defineProps<{ modelValue?: string | null }>()
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const cores = ['#e5e7eb','#fef3c7','#fde68a','#fca5a5','#bbf7d0','#bfdbfe','#e9d5ff','#fce7f3']

const bg = computed(() => props.modelValue ?? '#e5e7eb')

function select(c: string) {
  emit('update:modelValue', c)
  open.value = false
}

// close when value changes externally
watch(() => props.modelValue, () => { open.value = false })
</script>

<style scoped>
.ring-black { box-shadow: 0 0 0 2px rgba(0,0,0,0.12); }
</style>
