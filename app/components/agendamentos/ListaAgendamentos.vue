<template>
  <div>
    <div class="flex items-center justify-between mb-4 gap-4">
      <div>
        <h2 class="text-xl font-semibold text-neutral-800">Histórico de Agendamentos</h2>
        <p class="text-sm text-neutral-500">Visão geral e relatórios dos agendamentos</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-sm text-neutral-600">Total: <span class="font-medium">{{ total }}</span></div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
      <div class="w-full sm:w-80">
        <label class="block text-xs text-neutral-500 mb-1">Cliente</label>
        <ClienteSelector @select="onSelectCliente" placeholder="Busque um cliente..." />
      </div>
      <div class="w-full sm:w-64">
        <label class="block text-xs text-neutral-500 mb-1">Profissional</label>
        <select v-model="selectedProfissionalId" class="w-full border rounded px-3 py-2 text-sm">
          <option :value="null">Todos os profissionais</option>
          <option v-for="p in profissionaisList" :key="p.profissional_id" :value="p.profissional_id">{{ p.nome }} - {{ p.especialidade }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-2 bg-gray-100 rounded text-sm" @click="clearFilters">Limpar filtros</button>
      </div>
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
import { onMounted, computed, ref, watch } from 'vue'
import { useAgendamentos } from '~/composables/useAgendamentos'
import ClienteSelector from '~/components/common/ClienteSelector.vue'
import { useProfissionais } from '~/composables/useProfissionais'
import { useClientes } from '~/composables/useClientes'

const { relatorios, relLoading, relError, fetchRelatorios } = useAgendamentos()

const profs = useProfissionais()
const clientesComp = useClientes()

const profissionaisList = ref<any[]>([])
const selectedProfissionalId = ref<number | null>(null)
const selectedCliente = ref<any | null>(null)

// initial load and warm-up
onMounted(async () => {
  await fetchRelatorios()
  // warm up professionals and clients in background
  profs.fetchProfissionais().then(() => { profissionaisList.value = profs.profissionais?.value || [] }).catch(() => {})
  clientesComp.fetchClientes().catch(() => {})
})

const total = computed(() => (relatorios && relatorios.value ? relatorios.value.length : 0))

// when filters change, reload
watch([selectedProfissionalId, selectedCliente], () => {
  loadWithFilters()
})

async function loadWithFilters() {
  const filters: any = {}
  if (selectedProfissionalId.value != null) filters.profissionalId = selectedProfissionalId.value
  if (selectedCliente.value != null) filters.clienteId = selectedCliente.value.id
  await fetchRelatorios(filters)
}

function onSelectCliente(c: any) {
  selectedCliente.value = c || null
}

function clearFilters() {
  selectedProfissionalId.value = null
  selectedCliente.value = null
  fetchRelatorios()
}

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
