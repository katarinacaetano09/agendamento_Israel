// @ts-nocheck
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

import { ref } from 'vue'
import type { Especialidade } from '../../shared/types/Especialidade'
import type { Profissional, ProfissionalInsert } from '../../shared/types/Profissional'
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

  // Função para inserir profissional
  /**
   * Insere um novo profissional na tabela ag_profissionais
   * @param profileId id do perfil (usuário)
   * @param especialidadeId id da especialidade
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async function addProfissional(profileId: number | string, especialidadeId: number | string) {
    const supabase = useSupabaseClient()
    const insertData: ProfissionalInsert = {
      profile_id: Number(profileId),
      especialidade_id: Number(especialidadeId)
    }
    const { error: insertError } = await supabase
      .from('ag_profissionais')
      .insert([insertData] as any)
    if (insertError) {
      return { success: false, message: insertError.message || 'Erro ao adicionar profissional.' }
    }
    return { success: true, message: 'Profissional adicionado com sucesso.' }
  }

  /**
   * Edita um profissional existente
   * @param profissionalId id do profissional (não confundir com id do perfil)
   * @param profileId novo id do perfil
   * @param especialidadeId novo id da especialidade
   */
  async function editProfissional(profissionalId: number, profileId: number | string, especialidadeId: number | string) {
    const supabase = useSupabaseClient()
    const query = supabase
      .from('ag_profissionais')
    const { error: updateError } = await query
      .update({ profile_id: Number(profileId), especialidade_id: Number(especialidadeId) } as any)
      .eq('id', profissionalId)
    if (updateError) {
      return { success: false, message: updateError.message || 'Erro ao editar profissional.' }
    }
    return { success: true, message: 'Profissional atualizado com sucesso.' }
  }

  /**
   * Deleta um profissional pelo id
   * @param profissionalId id do profissional
   */
  async function deleteProfissional(profissionalId: number) {
    const supabase = useSupabaseClient()
    const { error: delError } = await supabase
      .from('ag_profissionais')
      .delete()
      .eq('id', profissionalId)
    if (delError) {
      return { success: false, message: delError.message || 'Erro ao deletar profissional.' }
    }
    return { success: true, message: 'Profissional deletado com sucesso.' }
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
    deleteEspecialidade,
    addProfissional,
    editProfissional,
    deleteProfissional
  }
}
