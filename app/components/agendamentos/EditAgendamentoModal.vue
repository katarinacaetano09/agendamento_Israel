<template>
  <BaseModal :show="show" @confirm="onSave" @cancel="onCancel">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h3 class="text-lg font-semibold">Editar agendamento</h3>
      </div>
    </template>

    <div class="p-4 grid grid-cols-1 gap-4 max-w-md w-full mx-auto max-h-[65vh] overflow-y-auto">
      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Título</label>
        <BaseInput v-model="titulo" placeholder="Título do agendamento" :disabled="isDisabled" />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Cor</label>
        <ColorPicker v-model="selectedColor" :disabled="isDisabled" />
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium text-neutral-700">Descrição</label>
        <textarea v-model="descricao" class="block w-full rounded-md border-neutral-300 px-4 py-2 text-sm" rows="4" placeholder="Descrição (opcional)" :disabled="isDisabled"></textarea>
      </div>

      <div v-if="agendamento?.data" class="text-sm text-neutral-500">
        <strong>Data:</strong> {{ agendamento.data }}
        <div><strong>Horário:</strong> {{ agendamento.hora_inicio }} - {{ agendamento.hora_fim }}</div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <div class="flex gap-2">
          <BaseButton variant="secondary" @click="onCancel">Fechar</BaseButton>
          <BaseButton variant="danger" @click="onCancelarAgendamento" :disabled="isDisabled">Cancelar agendamento</BaseButton>
        </div>
        <div>
          <BaseButton variant="primary" :disabled="!canSave || isDisabled" @click="onSave">Salvar</BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAgendamentoService } from '~/composables/useAgendamentoService'
import BaseModal from '../BaseModal.vue'
import BaseInput from '../BaseInput.vue'
import BaseButton from '../BaseButton.vue'
import ColorPicker from '../common/ColorPicker.vue'
import * as VueToastification from 'vue-toastification'
const useToast = (VueToastification as any).useToast || (VueToastification as any).default?.useToast
import ConfirmDeleteModal from '../ConfirmDeleteModal.vue'

const props = defineProps<{ show: boolean; agendamento?: any }>()
const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const titulo = ref('')
const descricao = ref('')
const selectedColor = ref<string | null>(null)

watch(() => props.agendamento, (v) => {
  titulo.value = v?.titulo ?? ''
  descricao.value = v?.descricao ?? ''
  selectedColor.value = v?.color ?? v?.cor ?? null
})

const canSave = computed(() => titulo.value.trim().length > 0)
const isDisabled = computed(() => !!props.agendamento?.cancelado)

async function onSave() {
  if (!props.agendamento) return
  const toast = useToast()
  try {
    const { updateAgendamento } = useAgendamentoService()
    const upd: any = {
      titulo: titulo.value,
      descricao: descricao.value,
      cor: selectedColor.value ?? null
    }
    console.debug('[debug] EditAgendamentoModal onSave, upd:', upd, 'id=', props.agendamento?.id)
    const { data, error } = await updateAgendamento(props.agendamento.id, upd)
    console.debug('[debug] EditAgendamentoModal onSave response:', { data, error })
    if (error) {
      toast.error('Erro ao atualizar: ' + (error.message || error))
      return
    }
    if (!data) {
      toast.error('Não foi possível atualizar — registro não encontrado ou sem permissão.')
      return
    }
    // persist color locally as fallback
    try {
      const key = 'agendamentoColors'
      const raw = localStorage.getItem(key)
      const map: Record<string, string> = raw ? JSON.parse(raw) : {}
  const id = String((data as any)?.id ?? '')
      if (id && selectedColor.value) {
        map[id] = selectedColor.value
        localStorage.setItem(key, JSON.stringify(map))
      }
    } catch (e) {}

    toast.success('Agendamento atualizado')
    emit('confirm', data)
    emit('update:show', false)
  } catch (e: any) {
    toast.error('Erro ao atualizar agendamento: ' + (e?.message || e))
  }
}

const showConfirm = ref(false)

async function onCancelarAgendamento() {
  if (!props.agendamento) return
  // open confirmation modal instead of browser confirm
  showConfirm.value = true
}

async function onConfirmDelete() {
  if (!props.agendamento) return
  const toast = useToast()
  try {
    const { cancelAgendamento } = useAgendamentoService()
    console.debug('[debug] EditAgendamentoModal onConfirmDelete id=', props.agendamento?.id)
    const { data, error } = await cancelAgendamento(props.agendamento.id)
    console.debug('[debug] EditAgendamentoModal onConfirmDelete response:', { data, error })
    if (error) {
      toast.error('Erro ao cancelar: ' + (error.message || error))
      showConfirm.value = false
      return
    }
    if (!data) {
      toast.error('Não foi possível cancelar — registro não encontrado ou sem permissão.')
      showConfirm.value = false
      return
    }
    toast.success('Agendamento cancelado')
    showConfirm.value = false
    emit('confirm', data)
    emit('update:show', false)
  } catch (e: any) {
    toast.error('Erro ao cancelar agendamento: ' + (e?.message || e))
    showConfirm.value = false
  }
}

function onCancel() {
  emit('update:show', false)
  emit('cancel')
}
</script>
