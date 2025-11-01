import { ref, computed } from 'vue';
import { useRouter } from 'nuxt/app';
import pkgToast from 'vue-toastification';
// vue-toastification is distributed as CommonJS on some setups (Vercel).
// Use the default import and call `useToast()` from the package to avoid
// named-export issues during SSR/build.
const useToast = () => (pkgToast as any).useToast();
import { useUserStore } from '~/stores/user';

// Some Nuxt/Supabase composables are auto-imported at runtime but
// TypeScript may not know their types in this environment. Declare
// the `useSupabaseUser` composable to avoid the TS2304 error during
// type-checking. This is a small local workaround; no behavioral
// change at runtime.
declare function useSupabaseUser(): any

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const router = useRouter();
  const toast = useToast();
  
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Login com link mágico (OTP)
   */
  const loginWithOtp = async (email: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/confirm',
        }
      });

      if (otpError) {
        error.value = otpError.message;
        toast.error('Falha ao enviar o link de login. Verifique seu email.');
        return false;
      }

      toast.success('Link de acesso enviado para seu email!');
      return true;
    } catch (err: any) {
      error.value = err.message || 'Ocorreu um erro ao enviar o link de acesso';
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
      return false;
    } finally {
      loading.value = false;
    }
  };

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
        // Buscar perfil correto do usuário autenticado (pegamos a store aqui, com Pinia já inicializado)
        const userStore = useUserStore();
        await userStore.fetchProfile(data.user.id);
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
   * Atualiza a senha do usuário autenticado via Supabase
   */
  const updatePassword = async (newPassword: string) => {
    try {
      loading.value = true
      error.value = null
      const { data, error: pwdError } = await supabase.auth.updateUser({ password: newPassword })
      if (pwdError) {
        error.value = pwdError.message
        toast.error('Falha ao alterar a senha. Tente novamente.')
        return false
      }
      toast.success('Senha alterada com sucesso!')
      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao alterar a senha'
      toast.error('Erro ao alterar a senha. Tente novamente.')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Atualiza o nome do usuário usando uma RPC criada no backend
   * RPC: ag_update_infos_user(new_name text)
   * Retorna boolean e mensagem via toast
   */
  const updateName = async (newName: string) => {
    try {
      loading.value = true
      error.value = null
      const { data, error: rpcError } = await supabase.rpc('ag_update_infos_user', { new_name: newName })
      if (rpcError) {
        error.value = rpcError.message
        toast.error('Falha ao atualizar nome: ' + (rpcError.message || ''))
        return false
      }

      // expected return { success: boolean, message: string }
      if (data && (data as any).success) {
        toast.success((data as any).message || 'Nome atualizado com sucesso')
        // refresh profile in user store
        try {
          const userStore = useUserStore()
          await userStore.fetchProfile()
        } catch (e) {
          // non-blocking
        }
        return true
      }

      toast.error(((data as any)?.message) || 'Falha ao atualizar nome')
      return false
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar nome'
      toast.error('Erro ao atualizar nome. Tente novamente.')
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Verifica via RPC se o usuário atual é admin
   * RPC: ag_isadmin() -> { isadmin: boolean }
   */
  const checkIsAdmin = async () => {
    try {
      loading.value = true
      error.value = null
      const { data, error: rpcError } = await supabase.rpc('ag_isadmin')
      if (rpcError) {
        console.error('ag_isadmin rpc error', rpcError)
        return false
      }
      // data may be an object or array depending on RPC; normalize
      const isadmin = (data && (data as any).isadmin) || (Array.isArray(data) && data[0] && data[0].isadmin)
      return !!isadmin
    } catch (err: any) {
      console.error('checkIsAdmin error', err)
      return false
    } finally {
      loading.value = false
    }
  }

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

  const userStore = useUserStore();
  userStore.resetProfile();
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
    loginWithOtp,
    logout,
    updatePassword,
    updateName,
    checkIsAdmin,
    isAuthenticated
  };
};