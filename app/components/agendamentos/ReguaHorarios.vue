<template>
  <div class="flex flex-col gap-0 py-0">
    <div v-for="hora in horas" :key="hora" :style="{ minHeight: HOUR_HEIGHT + 'px' }" class="text-xs text-neutral-500 text-right pr-2 flex items-start justify-end">
      <span>{{ hora }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HOUR_HEIGHT, START_HOUR } from '~~/shared/constants/layout'

const horas: string[] = []
for (let h = START_HOUR; h <= 22; h++) {
  horas.push(h.toString().padStart(2, '0') + ':00')
}
</script>
