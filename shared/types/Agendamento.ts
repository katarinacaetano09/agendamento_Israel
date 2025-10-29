export interface Agendamento {
  id: number
  created_at: string
  user_id: string | null
  profissional_id: number | null
  cliente_id: number | null
  data: string | null // date string YYYY-MM-DD
  hora_inicio: string | null // time with timezone as string
  hora_fim: string | null
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null
}

export type AgendamentoInsert = Omit<Agendamento, 'id' | 'created_at'>

// Interface used for reports (view: ag_view_agendamentos)
export interface AgendamentoReport {
  id: number
  created_at: string | null
  user_id: string | null
  profissional_id: number | null
  cliente_id: number | null
  data: string | null
  hora_inicio: string | null
  hora_fim: string | null
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null
  cor: string | null
  cliente_nome: string | null
  cliente_cpf: string | null
  profissional_nome: string | null
  profissional_especialidade: string | null
}
