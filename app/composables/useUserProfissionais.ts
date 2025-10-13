import type { Especialidade } from '../../shared/types/Especialidade'

export function useUserProfissionais() {
  const especialidades = ref<Especialidade[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

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

  return {
    especialidades,
    loading,
    error,
    fetchEspecialidades
  }
}
