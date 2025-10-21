import { ref } from 'vue'
import type { Agendamento } from '../../shared/types/Agendamento'

export function useAgendamentos() {
  const agendamentos = ref<Agendamento[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Busca agendamentos de um profissional, não trazendo os cancelados.
   * @param profissionalId id do profissional (campo profissional_id)
   * @param data opcional: filtrar por data (YYYY-MM-DD)
   */
  async function fetchAgendamentosPorProfissional(profissionalId: number, data?: string) {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      let query = supabase
        .from('ag_agendamentos')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)

      if (data) {
        query = query.eq('data', data)
      }

      const { data: d, error: err } = await query
      if (err) throw err
      agendamentos.value = d as Agendamento[]
      return agendamentos.value
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar agendamentos'
      agendamentos.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    agendamentos,
    loading,
    error,
    fetchAgendamentosPorProfissional
  }
}
