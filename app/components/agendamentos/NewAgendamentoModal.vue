<template>
  <BaseModal :show="show" @confirm="onConfirm" @cancel="onCancel">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold">Novo agendamento</h3>
      </div>
    </template>

    <div class="p-4 grid grid-cols-1 gap-4">
      <!-- Cliente (dropdown do banco) -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Cliente</label>
        <select
          v-model="clienteSelecionadoId"
          class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm"
        >
          <option value="">Selecione um cliente</option>
          <option v-for="c in clientesLista" :key="c.id" :value="c.id">{{ c.nome }} ({{ c.cpf }})</option>
        </select>
        <div v-if="clientesLista.length === 0 && !loadingClientes" class="mt-2 text-sm text-neutral-500">
          Nenhum cliente encontrado. <button class="text-primary underline ml-1" type="button" @click="abrirCadastroCliente">Cadastrar novo cliente</button>
        </div>
        <div v-else-if="clientesLista.length > 0" class="mt-2 text-sm text-neutral-500">
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
            <option v-for="t in timeInicioOptions" :key="t" :value="t">{{ t }}</option>
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

const props = defineProps<{ show: boolean; profissional?: any; datas?: Date[] }>()
const emit = defineEmits(['update:show', 'confirm', 'cancel'])

// use a reactive ref that points to the parent's prop so v-if updates reliably
const show = toRef(props, 'show')



// Dropdown de cliente
import { useClientes } from '~/composables/useClientes'
const { clientes, fetchClientes, loading: loadingClientes } = useClientes()
const clienteSelecionadoId = ref('')
const clientesLista = computed(() => clientes.value || [])
if (!clientes.value) fetchClientes()
function abrirCadastroCliente() {
  // Aqui você pode abrir um modal de cadastro ou redirecionar para a tela de clientes
  alert('Abrir modal/cadastro de novo cliente (implementar)')
}

// Demais campos do formulário
const titulo = ref('')
const descricao = ref('')
const selectedDate = ref('')
const horaInicio = ref('')
const horaFim = ref('')

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

const timeFimOptions = computed(() => {
  if (!horaInicio.value) return []
  // pega o próximo slot após horaInicio
  const idx = timeInicioOptions.indexOf(horaInicio.value)
  if (idx === -1) return []
  // hora_fim deve ser pelo menos 30min depois do início
  return timeInicioOptions.slice(idx + 1)
})

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

function onConfirm() {
  // layout only: emit the filled data
  const payload = {
    clienteId: clienteSelecionadoId.value || null,
    profissional: props.profissional || null,
    titulo: titulo.value,
    descricao: descricao.value,
    data: selectedDate.value,
    hora_inicio: horaInicio.value,
    hora_fim: horaFim.value
  }
  try { console.log('[debug] NewAgendamentoModal onConfirm payload:', payload) } catch(e) {}
  emit('confirm', payload)
  emit('update:show', false)
}

// watch show prop for debugging
import { watch } from 'vue'
watch(() => props.show, (v) => {
  try { console.log('[debug] NewAgendamentoModal show changed ->', v) } catch(e) {}
})
</script>


