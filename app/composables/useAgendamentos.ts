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

  /**
   * Busca agendamentos de um profissional em um intervalo de datas (inclusive)
   * @param profissionalId id do profissional
   * @param startDate 'YYYY-MM-DD'
   * @param endDate 'YYYY-MM-DD'
   */
  async function fetchAgendamentosPorProfissionalRange(profissionalId: number, startDate: string, endDate: string) {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      const { data: d, error: err } = await supabase
        .from('ag_agendamentos')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)
        .gte('data', startDate)
        .lte('data', endDate)
      if (err) throw err
      agendamentos.value = d as Agendamento[]
      return agendamentos.value
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar agendamentos por intervalo'
      agendamentos.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  // Simple in-memory cache: key => data
  const cache = new Map<string, Agendamento[] | null>()

  function cacheKey(profissionalId: number, startDate: string, endDate: string) {
    return `${profissionalId}:${startDate}:${endDate}`
  }

  async function fetchAgendamentosPorProfissionalWeek(profissionalId: number, startDate: string, endDate: string) {
    const key = cacheKey(profissionalId, startDate, endDate)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const res = await fetchAgendamentosPorProfissionalRange(profissionalId, startDate, endDate)
    cache.set(key, res)
    return res
  }

  function invalidateCache(profissionalId?: number, startDate?: string, endDate?: string) {
    if (!profissionalId) {
      cache.clear()
      return
    }
    if (startDate && endDate) {
      cache.delete(cacheKey(profissionalId, startDate, endDate))
      return
    }
    // remove any entries for profissionalId
    for (const k of Array.from(cache.keys())) {
      if (k.startsWith(profissionalId + ':')) cache.delete(k)
    }
  }

  return {
    agendamentos,
    loading,
    error,
    fetchAgendamentosPorProfissional,
    fetchAgendamentosPorProfissionalRange,
    fetchAgendamentosPorProfissionalWeek,
    invalidateCache
  }
}
