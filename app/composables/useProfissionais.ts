  async function deleteEspecialidade(id: number) {
    const supabase = useSupabaseClient()
    const { error: delError } = await supabase
      .from('ag_especialidades')
      .delete()
      .eq('id', id)
    if (delError) {
      return { success: false, message: delError.message || 'Erro ao deletar especialidade.' }
    }
    return { success: true, message: 'Especialidade deletada com sucesso.' }
  }
  async function editEspecialidade(id: number, novaEspecialidade: string) {
    const supabase = useSupabaseClient()
    const { data: editData, error: editError } = await supabase.rpc('ag_update_especialidade', {
      p_id: id,
      p_nova_especialidade: novaEspecialidade
    } as any)
    if (editError) {
      return { success: false, message: editError.message || 'Erro ao editar especialidade.' }
    }
    return editData || { success: false, message: 'Erro desconhecido.' }
  }

import type { Especialidade } from '../../shared/types/Especialidade'
import type { Profissional } from '../../shared/types/Profissional'
import type { SimpleProfile } from '../../shared/types/SimpleProfile'

export function useProfissionais() {
  const especialidades = ref<Especialidade[] | null>(null)
  const profissionais = ref<Profissional[] | null>(null)
  const simpleProfiles = ref<SimpleProfile[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  // Busca todos os perfis simples (id e nome) para uso de admin
  async function fetchSimpleProfiles() {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      const { data, error: err } = await supabase.rpc('ag_get_all_profiles_if_admin')
      if (err) throw err
      simpleProfiles.value = data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar perfis'
      simpleProfiles.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchEspecialidades() {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      const { data, error: err } = await supabase
        .from('ag_especialidades')
        .select('id, especialidade')
      if (err) throw err
      especialidades.value = data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar especialidades'
      especialidades.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchProfissionais() {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      const { data, error: err } = await supabase.rpc('ag_get_profissionais')
      if (err) throw err
      profissionais.value = data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar profissionais'
      profissionais.value = null
    } finally {
      loading.value = false
    }
  }

  async function addEspecialidade(especialidade: string) {
    const supabase = useSupabaseClient()
    const { data: addData, error: addError } = await supabase.rpc('ag_add_especialidade', { p_especialidade: especialidade } as any)
    if (addError) {
      return { success: false, message: addError.message || 'Erro ao adicionar especialidade.' }
    }
    // data esperado: { success: boolean, message: string }
    return addData || { success: false, message: 'Erro desconhecido.' }
  }

  return {
    especialidades,
    profissionais,
    simpleProfiles,
    loading,
    error,
    fetchEspecialidades,
    fetchProfissionais,
    fetchSimpleProfiles,
    addEspecialidade,
    editEspecialidade,
    deleteEspecialidade
  }
}
