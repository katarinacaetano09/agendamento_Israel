<template>
  <BaseModal :show="show" @confirm="onConfirm" @cancel="onCancel">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold">Novo agendamento</h3>
      </div>
    </template>

    <div class="p-4 grid grid-cols-1 gap-4">
      <!-- Cliente (pesquisável) -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Cliente</label>
        <ClienteSelector v-model="clienteTexto" placeholder="Pesquisar cliente..." @select="onClienteSelect" />
        <div class="mt-2 text-sm text-neutral-500">
          Não encontrou o cliente? <button class="text-primary underline ml-1" type="button" @click="abrirCadastroCliente">Cadastrar novo cliente</button>
        </div>
      </div>

      <!-- Profissional (read-only) -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Profissional</label>
        <div class="bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2 text-sm text-neutral-800">
          {{ profissionalNome }}
        </div>
      </div>

      <!-- Título -->
      <div>
        <BaseInput v-model="titulo" label="Título" placeholder="Titulo do agendamento" />
      </div>

      <!-- Descrição -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Descrição</label>
        <textarea v-model="descricao" class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm" rows="3" placeholder="Descrição (opcional)"></textarea>
      </div>

      <!-- Data (dropdown) -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Data</label>
        <select v-model="selectedDate" class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm">
          <option value="">Selecione uma data</option>
          <option v-for="d in dateOptions" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
      </div>

      <!-- Horários -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block mb-1 text-sm font-medium text-neutral-700">Hora início</label>
          <select v-model="horaInicio" :disabled="!selectedDate" class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm">
            <option value="">Selecione</option>
                    <option v-for="t in timeInicioOptionsFiltered" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-neutral-700">Hora fim</label>
          <select v-model="horaFim" :disabled="!selectedDate || !horaInicio" class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm">
            <option value="">Selecione</option>
            <option v-for="t in timeFimOptions" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <BaseButton variant="secondary" @click="onCancel">Cancelar</BaseButton>
        <BaseButton variant="primary" :disabled="!selectedDate" @click="onConfirm">Salvar</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import BaseModal from '../BaseModal.vue'
import BaseInput from '../BaseInput.vue'
import BaseButton from '../BaseButton.vue'

const props = defineProps<{ show: boolean; profissional?: any; datas?: Date[]; ocupados?: Record<string, any[]> }>()
const emit = defineEmits(['update:show', 'confirm', 'cancel'])

// use a reactive ref that points to the parent's prop so v-if updates reliably
const show = toRef(props, 'show')



// Dropdown de cliente
import ClienteSelector from '../common/ClienteSelector.vue'
import { navigateTo } from '#app'
import { useToast } from 'vue-toastification'

// cliente selecionado: guardamos o id e o texto exibido
const clienteSelecionadoId = ref<number | null>(null)
const clienteTexto = ref('')

function onClienteSelect(c: any) {
  clienteSelecionadoId.value = c?.id ?? null
  clienteTexto.value = c?.nome ?? ''
}

function abrirCadastroCliente() {
  // fechar o modal e redirecionar para a página de clientes
  try { emit('update:show', false) } catch (e) {}
  navigateTo('/clientes')
}

// Demais campos do formulário
const titulo = ref('')
const descricao = ref('')
const selectedDate = ref('')
const horaInicio = ref('')
const horaFim = ref('')

// configurações
const MIN_DURATION_MIN = 30 // duração mínima em minutos

// helpers de tempo
function timeToMinutes(t: string) {
  const [hh, mm] = (t || '').split(':')
  return Number(hh || 0) * 60 + Number(mm || 0)
}
function minutesToTime(m: number) {
  const hh = Math.floor(m / 60).toString().padStart(2, '0')
  const mm = (m % 60).toString().padStart(2, '0')
  return `${hh}:${mm}`
}

function mergeIntervals(intervals: Array<[number, number]>) {
  if (!intervals || intervals.length === 0) return [] as Array<[number, number]>
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0])
  const res: Array<[number, number]> = []
  const first = sorted[0]!
  let curStart = first[0]
  let curEnd = first[1]
  for (let i = 1; i < sorted.length; i++) {
    const pair = sorted[i]!
    const s = pair[0]
    const e = pair[1]
    if (s <= curEnd) {
      curEnd = Math.max(curEnd, e)
    } else {
      res.push([curStart, curEnd])
      curStart = s
      curEnd = e
    }
  }
  res.push([curStart, curEnd])
  return res
}

function intervalsIntersect(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd)
}

// pega os agendamentos ocupados para a data selecionada e transforma em intervalos mesclados (minutos)
const ocupadosParaData = computed(() => {
  const key = selectedDate.value || ''
  const list = (props.ocupados && props.ocupados[key]) || []
  const intervals: Array<[number, number]> = []
  for (const a of list) {
    if (!a || !a.hora_inicio || !a.hora_fim) continue
    const s = timeToMinutes(String(a.hora_inicio).slice(0,5))
    const e = timeToMinutes(String(a.hora_fim).slice(0,5))
    if (!isNaN(s) && !isNaN(e) && e > s) intervals.push([s, e])
  }
  return mergeIntervals(intervals)
})

// opções de início filtradas — remove inícios que gerariam conflito com ocupados
const timeInicioOptionsFiltered = computed(() => {
  const occupied = ocupadosParaData.value
  const res: string[] = []
  for (const t of timeInicioOptions) {
    const s = timeToMinutes(t)
    const e = s + MIN_DURATION_MIN
    // se intersecta com algum ocupado, não inclui
    const intersects = occupied.some(([os, oe]) => intervalsIntersect(s, e, os, oe))
    if (!intersects) res.push(t)
  }
  return res
})

// timeFimOptions agora deve derivar não só do slice, mas também considerando ocupados
const timeFimOptions = computed(() => {
  if (!horaInicio.value) return []
  const base = timeInicioOptions
  const idx = base.indexOf(horaInicio.value)
  if (idx === -1) return []
  const candidate = base.slice(idx + 1)
  const occupied = ocupadosParaData.value
  const start = timeToMinutes(horaInicio.value)
  const allowed: string[] = []
  for (const t of candidate) {
    const end = timeToMinutes(t)
    if (end <= start) continue
    // check if [start, end) intersects occupied
    const intersects = occupied.some(([os, oe]) => intervalsIntersect(start, end, os, oe))
    if (!intersects) allowed.push(t)
  }
  return allowed
})

const dateOptions = computed(() => {
  const arr: Array<{ value: string; label: string }> = []
  const datas = props.datas || []
  for (const d of datas) {
    const iso = d.toISOString().slice(0, 10)
    arr.push({ value: iso, label: d.toLocaleDateString() })
  }
  return arr
})

const profissionalNome = computed(() => {
  return props.profissional?.nome || '—'
})


// Horários de 30 em 30 minutos
function gerarHorarios(inicio: string, fim: string, stepMin: number = 30) {
  const res: string[] = [];
  const [hRaw, mRaw] = inicio.split(':');
  const [hFimRaw, mFimRaw] = fim.split(':');
  const h = Number(hRaw);
  const m = Number(mRaw);
  const hFim = Number(hFimRaw);
  const mFim = Number(mFimRaw);
  if ([h, m, hFim, mFim].some(v => isNaN(v))) return res;
  let curH = h;
  let curM = m;
  while (curH < hFim || (curH === hFim && curM < mFim)) {
    const hh = curH.toString().padStart(2, '0');
    const mm = curM.toString().padStart(2, '0');
    res.push(`${hh}:${mm}`);
    curM += stepMin;
    if (curM >= 60) { curH++; curM = curM - 60; }
  }
  return res;
}
const timeInicioOptions = gerarHorarios('08:00', '22:00')

// removed simple timeFimOptions; replaced by the occupied-aware computed earlier

// Sempre que horaInicio mudar, já sugere o próximo slot para horaFim
// (já importado acima)
watch(horaInicio, (novo) => {
  if (!novo) { horaFim.value = '' }
  else {
    const idx = timeInicioOptions.indexOf(novo)
    if (idx !== -1 && typeof timeInicioOptions[idx + 1] === 'string') {
      horaFim.value = timeInicioOptions[idx + 1] as string
    } else {
      horaFim.value = ''
    }
  }
})

function onCancel() {
  emit('update:show', false)
  emit('cancel')
}

async function onConfirm() {
  const payload = {
    clienteId: clienteSelecionadoId.value || null,
    profissional: props.profissional || null,
    titulo: titulo.value,
    descricao: descricao.value,
    data: selectedDate.value,
    hora_inicio: horaInicio.value,
    hora_fim: horaFim.value
  }

  // validações básicas
  if (!payload.data || !payload.hora_inicio || !payload.hora_fim) {
    alert('Por favor selecione data, hora início e hora fim.')
    return
  }

  // verifica conflito contra ocupados
  const start = timeToMinutes(String(payload.hora_inicio))
  const end = timeToMinutes(String(payload.hora_fim))
  const occupied = ocupadosParaData.value
  const conflict = occupied.some(([os, oe]) => intervalsIntersect(start, end, os, oe))
  if (conflict) {
    alert('O horário selecionado conflita com um agendamento existente. Por favor escolha outro horário.')
    return
  }

    const toast = useToast()
    try {
      const supabase = useSupabaseClient()
      const insertRow: any = {
        // prefer the backend field name `profissional_id` if present on the profissional object,
        // fallback to `id` if that's the shape, otherwise null
        profissional_id: props.profissional?.profissional_id ?? props.profissional?.id ?? null,
        cliente_id: payload.clienteId,
        titulo: payload.titulo,
        descricao: payload.descricao,
        data: payload.data,
        hora_inicio: payload.hora_inicio,
        hora_fim: payload.hora_fim,
        cancelado: false
      }
      console.debug('[debug] NewAgendamentoModal insertRow:', insertRow)
      const { data: d, error: err } = await supabase.from('ag_agendamentos').insert(insertRow).select().single()
      if (err) {
        console.error('[debug] Supabase insert error:', err)
        toast.error('Erro ao salvar agendamento: ' + (err.message || err))
        return
      }
      console.log('[debug] Agendamento inserido:', d)
      toast.success('Agendamento salvo com sucesso!')
      // notifica o parent que salvou (ele deve recarregar a semana)
      emit('confirm', d)
      emit('update:show', false)
    } catch (e: any) {
      console.error('Erro ao salvar agendamento', e)
      toast.error('Erro ao salvar agendamento: ' + (e?.message || e))
    }
}

// watch show prop for debugging
import { watch } from 'vue'
watch(() => props.show, (v) => {
  try { console.log('[debug] NewAgendamentoModal show changed ->', v) } catch(e) {}
})
</script>


