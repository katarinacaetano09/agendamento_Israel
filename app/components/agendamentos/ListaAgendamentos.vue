<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-semibold text-neutral-800">Histórico de Agendamentos</h2>
        <p class="text-sm text-neutral-500">Visão geral e relatórios dos agendamentos</p>
      </div>
      <div class="text-sm text-neutral-600">Total: <span class="font-medium">{{ total }}</span></div>
    </div>

    <div v-if="relLoading" class="py-8 text-center text-blue-500">Carregando...</div>
    <div v-else-if="relError" class="py-8 text-center text-red-500">{{ relError }}</div>

    <div v-else class="space-y-3">
      <div v-for="r in relatorios || []" :key="r.id" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="flex items-stretch">
          <div :style="{ backgroundColor: r.cor || '#eef2ff' }" class="w-1.5"></div>
          <div class="p-4 flex-1">
            <div class="flex items-center gap-6">
              <div class="w-48">
                <div class="text-xs text-neutral-400">Data</div>
                <div class="text-sm font-medium text-neutral-800">{{ formatDate(r.data) }}</div>
                <div class="text-xs text-neutral-500">{{ formatTime(r.hora_inicio) }} - {{ formatTime(r.hora_fim) }}</div>
              </div>

              <div class="flex-1">
                <div class="text-sm text-neutral-500">Título</div>
                <div class="text-sm font-semibold text-neutral-800">{{ r.titulo || 'Sem título' }}</div>
                <div class="text-xs text-neutral-500 mt-1">{{ r.descricao || '' }}</div>
              </div>

              <div class="w-56">
                <div class="text-xs text-neutral-400">Profissional</div>
                <div class="text-sm font-medium text-neutral-800">{{ r.profissional_nome || '-' }}</div>
                <div class="text-xs text-neutral-500">{{ r.profissional_especialidade || '' }}</div>
              </div>

              <div class="w-56">
                <div class="text-xs text-neutral-400">Cliente</div>
                <div class="text-sm font-medium">{{ r.cliente_nome || '-' }}</div>
                <div class="text-xs text-neutral-500">{{ r.cliente_cpf || '' }}</div>
              </div>

              <div class="w-36 text-right">
                <div class="text-xs text-neutral-400">Status</div>
                <div :class="r.cancelado ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'">
                  {{ r.cancelado ? 'Cancelado' : 'Confirmado' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="(!relatorios || relatorios.length === 0) && !relLoading && !relError" class="py-8 text-center text-gray-400">Nenhum agendamento encontrado.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAgendamentos } from '~/composables/useAgendamentos'

const { relatorios, relLoading, relError, fetchRelatorios } = useAgendamentos()

onMounted(async () => {
  // fetch all reports by default; can be filtered by parent in the future
  await fetchRelatorios()
})

const total = computed(() => (relatorios && relatorios.value ? relatorios.value.length : 0))

function formatDate(d?: string | null) {
  if (!d) return '-'
  try {
    const dt = new Date(d + 'T00:00:00')
    return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (e) {
    return d
  }
}

function formatTime(t?: string | null) {
  if (!t) return '-'
  // time could be '12:00:00-03' or '12:00:00'
  const m = t.match(/^(\d{2}:\d{2})/)
  return m ? m[1] : t
}
</script>

<style scoped>
.card-color { width: 6px }
.rounded-lg { border-radius: 10px }
.shadow-sm { box-shadow: 0 1px 4px rgba(16,24,40,0.06) }
@media (max-width: 640px) {
  .w-48 { width: 10rem }
  .w-56 { width: 12rem }
  .w-36 { width: 9rem }
}
</style>
