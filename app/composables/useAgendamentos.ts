import { ref } from 'vue'
import type { Agendamento, AgendamentoInsert, AgendamentoReport } from '../../shared/types/Agendamento'

export function useAgendamentos() {
  const agendamentos = ref<Agendamento[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

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
    for (const k of Array.from(cache.keys())) {
      if (k.startsWith(profissionalId + ':')) cache.delete(k)
    }
  }

  async function insertAgendamento(agendamento: Omit<AgendamentoInsert, 'user_id'>) {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      const { data: d, error: err } = await supabase
        .from('ag_agendamentos')
        .insert([agendamento] as any)
        .select()
        .single()
      if (err) throw err
      agendamentos.value = agendamentos.value ? [d, ...agendamentos.value] : [d]
      return d as Agendamento
    } catch (err: any) {
      error.value = err.message || 'Erro ao inserir agendamento'
      return null
    } finally {
      loading.value = false
    }
  }

  // ---- Relatórios / histórico de agendamentos (view: ag_view_agendamentos) ----
  const relatorios = ref<AgendamentoReport[] | null>(null)
  const relLoading = ref(false)
  const relError = ref<string | null>(null)

  type RelatorioFilters = {
    startDate?: string
    endDate?: string
    profissionalId?: number
    clienteId?: number
    cancelado?: boolean
  }

  async function fetchRelatorios(filters: RelatorioFilters = {}) {
    relLoading.value = true
    relError.value = null
    try {
      const supabase = useSupabaseClient()
      let query: any = supabase.from('ag_view_agendamentos').select('*')

      if (filters.profissionalId != null) {
        query = query.eq('profissional_id', filters.profissionalId)
      }
      if (filters.clienteId != null) {
        query = query.eq('cliente_id', filters.clienteId)
      }
      if (filters.startDate) {
        query = query.gte('data', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('data', filters.endDate)
      }
      if (filters.cancelado != null) {
        query = query.eq('cancelado', filters.cancelado)
      }

      // order by date + start time
      query = query.order('data', { ascending: true }).order('hora_inicio', { ascending: true })

      const { data: d, error: err } = await query
      if (err) throw err
      relatorios.value = d as AgendamentoReport[]
      return relatorios.value
    } catch (err: any) {
      relError.value = err.message || 'Erro ao buscar relatórios de agendamentos'
      relatorios.value = null
      return null
    } finally {
      relLoading.value = false
    }
  }

  return {
    agendamentos,
    loading,
    error,
    fetchAgendamentosPorProfissional,
    fetchAgendamentosPorProfissionalRange,
    fetchAgendamentosPorProfissionalWeek,
    invalidateCache,
    insertAgendamento
    ,
    // relatórios
    relatorios,
    relLoading,
    relError,
    fetchRelatorios
  }
}
