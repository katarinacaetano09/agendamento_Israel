export interface Cliente {
  id: number;
  created_at: Date;
  cpf: string;
  nome?: string;
  endereco?: string;
  email?: string;
  telefone?: string;
}

export type ClienteInsert = {
  cpf: string;
  nome: string;
  endereco?: string;
  email?: string;
  telefone?: string;
}