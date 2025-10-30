// Local declaration to satisfy TS server if Nuxt types aren't available in this environment
declare function defineNuxtRouteMiddleware(fn: any): any
declare function navigateTo(url: string): any

export default defineNuxtRouteMiddleware(async (to: any) => {
  // Use supabase client auto-import
  const supabase = useSupabaseClient()

  try {
    const { data, error } = await supabase.rpc('ag_isadmin')
    if (error) {
      console.error('ag_isadmin rpc error', error)
      return navigateTo('/')
    }
    const isadmin = (data && (data as any).isadmin) || (Array.isArray(data) && data[0] && data[0].isadmin)
    if (!isadmin) return navigateTo('/')
    // allow navigation
    return
  } catch (err) {
    console.error('admin middleware error', err)
    return navigateTo('/')
  }
})