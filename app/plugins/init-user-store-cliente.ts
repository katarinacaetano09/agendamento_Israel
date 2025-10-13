// Plugin para inicializar o user store no lado do cliente
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const userStore = useUserStore()
    userStore.fetchProfile()
  }
})
