// https://nuxt.com/docs/api/configuration/nuxt-config
// If the Nuxt types are not available to the editor/TS server,
// provide a minimal ambient declaration so `defineNuxtConfig` is recognized.
declare function defineNuxtConfig<T = any>(config: T): T

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  css: [
    '~/assets/css/toast.css'
  ]
  ,
  // Supabase module options: make /esqueci-senha public (excluded from auth redirect)
  supabase: {
    // keep redirect on for protected pages, but exclude our public recovery page
    redirect: true,
    redirectOptions: {
      exclude: ['/esqueci-senha', '/recuperar-senha']
    }
  }
})