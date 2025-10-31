// Tipo para o retorno da função ag_get_all_profiles_if_admin
// Representa um perfil simples com id e nome
export interface SimpleProfile {
  id: number
  created_at: string
  user_id: string
  nome: string
  role: string | null
  email: string | null
}
