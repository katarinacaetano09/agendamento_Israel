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
    // Use RPC (security-definer) which returns the complete agendamentos view results
    relLoading.value = true
    relError.value = null
    try {
      const supabase = useSupabaseClient()
      const { data: d, error: err } = await supabase.rpc('ag_get_agendamentos_completo')
      if (err) throw err
      let rows = (d as unknown) as AgendamentoReport[]

      // apply optional client-side filters if provided (RPC returns full dataset)
      if (filters.profissionalId != null) {
        rows = rows.filter(r => r.profissional_id === filters.profissionalId)
      }
      if (filters.clienteId != null) {
        rows = rows.filter(r => r.cliente_id === filters.clienteId)
      }
      if (filters.startDate) {
        rows = rows.filter(r => (r.data ?? '') >= filters.startDate!)
      }
      if (filters.endDate) {
        rows = rows.filter(r => (r.data ?? '') <= filters.endDate!)
      }
      if (filters.cancelado != null) {
        rows = rows.filter(r => Boolean(r.cancelado) === Boolean(filters.cancelado))
      }

      // sort by date then start time — newest first (mais novo primeiro)
      rows.sort((a, b) => {
        const da = a.data ?? ''
        const db = b.data ?? ''
        if (da < db) return 1
        if (da > db) return -1
        const ta = (a.hora_inicio ?? '')
        const tb = (b.hora_inicio ?? '')
        return ta < tb ? 1 : ta > tb ? -1 : 0
      })

      relatorios.value = rows
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
