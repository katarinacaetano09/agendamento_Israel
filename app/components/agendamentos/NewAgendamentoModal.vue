<template>
  <BaseModal :show="show" @confirm="onConfirm" @cancel="onCancel">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold">Novo agendamento</h3>
      </div>
    </template>

  <!-- constrain modal inner width and height so it fits smaller screens and the content can scroll -->
  <div class="p-4 grid grid-cols-1 gap-4 max-w-lg w-full mx-auto max-h-[65vh] overflow-y-auto">
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

      <!-- Cor do slot -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Cor</label>
        <ColorPicker v-model="selectedColor" />
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
import { toRef, watch } from 'vue'
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
import ColorPicker from '../common/ColorPicker.vue'

// composable: extrai estados e helpers do formulário
import { useNewAgendamentoForm } from '~/composables/useNewAgendamentoForm'
const {
  clienteSelecionadoId,
  clienteTexto,
  titulo,
  descricao,
  selectedDate,
  horaInicio,
  horaFim,
  timeInicioOptionsFiltered,
  timeFimOptions,
  dateOptions
  ,selectedColor
} = useNewAgendamentoForm(props)

const profissionalNome = computed(() => {
  return props.profissional?.nome || '—'
})

// helper: combine selected date and time and append Brazil GMT-3 offset
function formatDateTimeWithGMTMinus3(dateStr: string | null | undefined, timeStr: string | null | undefined) {
  if (!dateStr || !timeStr) return null
  // ensure time has seconds
  const time = timeStr.length === 5 ? `${timeStr}:00` : timeStr
  // return a timezone-aware string like '2025-10-26T14:00:00-03:00'
  return `${dateStr}T${time}-03:00`
}

function onClienteSelect(c: any) {
  clienteSelecionadoId.value = c?.id ?? null
  clienteTexto.value = c?.nome ?? ''
}

function abrirCadastroCliente() {
  try { emit('update:show', false) } catch (e) {}
  navigateTo('/clientes')
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

  const toast = useToast()
  try {
    const supabase = useSupabaseClient()
    const insertRow: any = {
      profissional_id: props.profissional?.profissional_id ?? props.profissional?.id ?? null,
      cliente_id: payload.clienteId,
      titulo: payload.titulo,
      descricao: payload.descricao,
      // persist selected color server-side so slots are consistent across devices
      cor: selectedColor?.value ?? null,
      data: payload.data,
      // save times with explicit Brazil GMT-3 offset so DB receives timezone-aware values
      hora_inicio: formatDateTimeWithGMTMinus3(payload.data, payload.hora_inicio) ?? payload.hora_inicio,
      hora_fim: formatDateTimeWithGMTMinus3(payload.data, payload.hora_fim) ?? payload.hora_fim,
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
    // persist selected color mapping in localStorage for client-side rendering
    try {
      const key = 'agendamentoColors'
      const raw = localStorage.getItem(key)
      const map: Record<string, string> = raw ? JSON.parse(raw) : {}
      const insertedId = (d && (d as any).id) ? String((d as any).id) : null
      if (insertedId && selectedColor?.value) {
        map[insertedId] = selectedColor.value
        localStorage.setItem(key, JSON.stringify(map))
      }
    } catch (e) {
      // ignore localStorage errors
    }
    emit('confirm', d)
    emit('update:show', false)
  } catch (e: any) {
    console.error('Erro ao salvar agendamento', e)
    toast.error('Erro ao salvar agendamento: ' + (e?.message || e))
  }
}

function onCancel() {
  emit('update:show', false)
  emit('cancel')
}

// watch show prop for debugging
watch(() => props.show, (v) => {
  try { console.log('[debug] NewAgendamentoModal show changed ->', v) } catch(e) {}
})
</script>


