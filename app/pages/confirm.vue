<template>
  <div class="flex items-center justify-center min-h-screen bg-neutral-50">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-neutral-800 mb-2">
          Verificando sua autenticação
        </h1>
        
        <p v-if="loading" class="text-neutral-600 mb-6">
          Aguarde enquanto processamos seu login...
        </p>
        
        <p v-else-if="error" class="text-state-error mb-6">
          {{ error }}
        </p>
        
        <p v-else-if="user" class="text-state-success mb-6">
          Autenticação realizada com sucesso!
        </p>
        
        <div v-if="loading" class="flex justify-center mb-6">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
        
        <div v-if="user" class="mt-4">
          <p class="text-neutral-600 mb-4">
            Você será redirecionado para a página inicial em instantes...
          </p>
          
          <BaseButton
            label="Ir para a página inicial"
            variant="primary"
            @click="navigateTo('/')"
          />
        </div>
        
        <div v-if="error" class="mt-4">
          <BaseButton
            label="Voltar para o login"
            variant="secondary"
            @click="navigateTo('/login')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'nuxt/app';

// Definir layout para esta página - remover o layout padrão na página de confirmação
definePageMeta({
  layout: false
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const loading = ref(true);
const error = ref<string | null>(null);
const redirectInfo = useSupabaseCookieRedirect();

// Monitora o estado do usuário para redirecionar quando autenticado
watch(user, () => {
  if (user.value) {
    loading.value = false;
    
    // Verifica se há um caminho de redirecionamento salvo no cookie
    const path = redirectInfo.pluck() || '/';
    
    // Redireciona após um pequeno delay para mostrar a mensagem de sucesso
    setTimeout(() => {
      router.push(path);
    }, 1500);
  }
}, { immediate: true });

// Quando a página carrega, verifica se a autenticação está em andamento
onMounted(async () => {
  try {
    // Processa qualquer hash na URL que contenha o token de autenticação
    const { data, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      error.value = 'Erro ao verificar sua sessão. Por favor, tente novamente.';
    }
    
    // Se não houver usuário após algum tempo, mostra erro
    setTimeout(() => {
      if (!user.value && !error.value) {
        error.value = 'Link de autenticação expirado ou inválido. Por favor, solicite um novo link.';
        loading.value = false;
      }
    }, 5000);
    
  } catch (err: any) {
    error.value = err.message || 'Ocorreu um erro durante a autenticação';
    loading.value = false;
  }
});
</script>