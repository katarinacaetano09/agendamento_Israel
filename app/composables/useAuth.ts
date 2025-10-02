import { ref } from 'vue';
import { useRouter } from 'nuxt/app';
import { useToast } from 'vue-toastification';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const router = useRouter();
  const toast = useToast();
  
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Login com e-mail e senha
   */
  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) {
        error.value = loginError.message;
        toast.error('Falha ao fazer login. Verifique suas credenciais.');
        return false;
      }

      if (data?.user) {
        toast.success('Login realizado com sucesso!');
        // Redireciona para página raiz
        router.push('/');
        return true;
      }
      
      return false;
    } catch (err: any) {
      error.value = err.message || 'Ocorreu um erro durante o login';
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Logout do usuário
   */
  const logout = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        error.value = logoutError.message;
        toast.error('Falha ao sair do sistema.');
        return false;
      }

      toast.success('Logout realizado com sucesso!');
      router.push('/login');
      return true;
    } catch (err: any) {
      error.value = err.message || 'Ocorreu um erro durante o logout';
      toast.error('Ocorreu um erro ao sair do sistema.');
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };
};