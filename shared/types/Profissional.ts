// Tipo para inserção de profissional (apenas os campos necessários)
export type ProfissionalInsert = {
  profile_id: number;
  especialidade_id: number;
};
export interface Profissional {
  profissional_id: number
  profile_id: number
  nome: string
  especialidade_id: number
  especialidade: string
}
