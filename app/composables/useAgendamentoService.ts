import type { Agendamento } from '../../shared/types/Agendamento'
import type { Database } from '../../types/supabase'

export function useAgendamentoService() {
  // Atualiza apenas título, descrição e cor
  async function updateAgendamento(id: number, upd: { titulo: string; descricao: string; cor: string | null }) {
    const supabase = useSupabaseClient<Database>()
    const { data, error } = await supabase
      .from('ag_agendamentos')
      .update({
        titulo: upd.titulo,
        descricao: upd.descricao,
        cor: upd.cor
      } as any)
      .eq('id', id)
      .select()
      .single()
    return { data: data as unknown as Agendamento, error }
  }

  // Marca como cancelado e registra data do cancelamento
  async function cancelAgendamento(id: number) {
    const supabase = useSupabaseClient<Database>()
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('ag_agendamentos')
      .update({ cancelado: true, cancelado_as: now } as any)
      .eq('id', id)
      .select()
      .single()
    return { data: data as unknown as Agendamento, error }
  }

  return {
    updateAgendamento,
    cancelAgendamento
  }
}
