<template>
  <BaseModal :show="show" @confirm="onConfirm" @cancel="onCancel">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold">Novo agendamento</h3>
      </div>
    </template>

    <div class="p-4 grid grid-cols-1 gap-4">
      <!-- Cliente (dropdown) -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Cliente</label>
        <select
          v-model="clienteId"
          class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm"
        >
          <option value="">Selecione um cliente</option>
          <!-- layout only: placeholder options -->
          <option v-for="c in clientesMock" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </div>

      <!-- Profissional (read-only) -->
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Profissional</label>
        <div class="bg-neutral-50 border border-neutral-200 rounded-md px-4 py-2">
          <!-- reuse ProfissionalInfo for display -->
          <ProfissionalInfo />
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
            <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-neutral-700">Hora fim</label>
          <select v-model="horaFim" :disabled="!selectedDate" class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm">
            <option value="">Selecione</option>
            <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
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
import { computed, ref, watch } from 'vue'
import BaseModal from '../BaseModal.vue'
import BaseInput from '../BaseInput.vue'
import BaseButton from '../BaseButton.vue'
import ProfissionalInfo from './ProfissionalInfo.vue'

const props = defineProps<{ show: boolean; profissional?: any; datas?: Date[] }>()
const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const show = props.show

// simple local form state (layout only)
const clienteId = ref('')
const clientesMock = ref([{ id: '1', nome: 'Cliente A' }, { id: '2', nome: 'Cliente B' }])
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

// hours from 08:00 to 22:00 hourly
const timeOptions = (() => {
  const res: string[] = []
  for (let h = 8; h <= 22; h++) {
    const hh = h.toString().padStart(2, '0')
    res.push(`${hh}:00`)
  }
  return res
})()

function onCancel() {
  emit('update:show', false)
  emit('cancel')
}

function onConfirm() {
  // layout only: emit the filled data
  const payload = {
    clienteId: clienteId.value,
    profissional: props.profissional || null,
    titulo: titulo.value,
    descricao: descricao.value,
    data: selectedDate.value,
    hora_inicio: horaInicio.value,
    hora_fim: horaFim.value
  }
  emit('confirm', payload)
  emit('update:show', false)
}
</script>


