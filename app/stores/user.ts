
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserProfile } from '../../shared/types/UserProfile'

export const useUserStore = defineStore('user', () => {
  // Estado do perfil
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Buscar perfil do usuário autenticado
  async function fetchProfile(userId?: string) {
    loading.value = true
    error.value = null
    try {
      const supabase = useSupabaseClient()
      let query = supabase.from('ag_profiles').select('*')
      if (userId) {
        query = query.eq('user_id', userId)
      }
      const { data, error: err } = await query.single()
      if (err) throw err
      profile.value = data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar perfil'
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  function setProfile(data: UserProfile | null) {
    profile.value = data
  }

  function resetProfile() {
    profile.value = null
    error.value = null
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    setProfile,
    resetProfile
  }
})
