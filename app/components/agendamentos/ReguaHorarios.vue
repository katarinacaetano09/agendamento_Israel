<template>
  <div class="flex flex-col gap-2 py-2">
    <div v-for="hora in horas" :key="hora" class="text-xs text-neutral-500 text-right pr-2 min-h-[32px] flex items-start justify-end">
      <span>{{ hora }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const horas: string[] = []
for (let h = 8; h <= 22; h++) {
  horas.push(h.toString().padStart(2, '0') + ':00')
}
</script>
