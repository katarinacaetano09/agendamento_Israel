<template>
  <div>
    <button @click="open = !open" class="fixed z-50 bottom-4 right-4 bg-indigo-600 text-white px-3 py-2 rounded-md shadow-lg">Debug</button>
    <div v-if="open" class="fixed z-50 bottom-16 right-4 w-96 max-h-96 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl p-3 text-xs">
      <div class="flex items-center justify-between mb-2">
        <strong>Debug logs</strong>
        <div class="flex gap-2">
          <button @click="copyAll" class="px-2 py-1 bg-green-500 text-white rounded">Copiar</button>
          <button @click="clear" class="px-2 py-1 bg-red-500 text-white rounded">Limpar</button>
        </div>
      </div>
      <div v-if="logs.length === 0" class="text-gray-500">Sem logs</div>
      <pre v-for="(l, i) in logs" :key="i" class="whitespace-pre-wrap mb-2 text-[11px]">{{ l }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { debugLogs, clearDebug } from '~/utils/debug'

const open = ref(false)
const logs = computed(() => debugLogs.value.slice().reverse())

function copyAll() {
  try {
    const text = debugLogs.value.join('\n')
    void navigator.clipboard.writeText(text)
    // optional: give quick feedback
    open.value = true
  } catch (e) {
    // ignore
  }
}

function clear() {
  clearDebug()
}
</script>

<style scoped>
.debug-toggle { display:none }
</style>
