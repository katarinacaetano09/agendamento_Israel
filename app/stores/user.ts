
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserProfile } from '../../shared/types/UserProfile'

export const useUserStore = defineStore('user', () => {
  // Estado do perfil
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Buscar perfil do usuário autenticado
  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      // Supabase client via composable Nuxt
      const supabase = useSupabaseClient()
      const { data, error: err } = await supabase
        .from('ag_profiles')
        .select('*')
        .single()
      if (err) throw err
      profile.value = data
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar perfil'
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile
  }
})
