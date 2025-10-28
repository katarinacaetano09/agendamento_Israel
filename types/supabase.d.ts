// Declaração global para o auto-import do Nuxt
export {}
declare global {
  function useSupabaseClient<T = any>(): any;
}
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Agendamento {
  id: number;
  created_at: string;
  user_id: string | null;
  profissional_id: number | null;
  cliente_id: number | null;
  data: string | null;
  hora_inicio: string | null;
  hora_fim: string | null;
  titulo: string | null;
  descricao: string | null;
  cancelado: boolean | null;
  cancelado_as: string | null;
}

export interface Database {
  public: {
    Tables: {
      ag_agendamentos: {
        Row: Agendamento;
        Insert: Omit<Agendamento, 'id' | 'created_at'>;
        Update: Partial<Omit<Agendamento, 'id' | 'created_at'>>;
      };
    };
  };
}
