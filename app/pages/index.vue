<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
      <div class="flex justify-end mb-2">
        <BaseButton 
          v-if="isAuthenticated" 
          label="Logout" 
          variant="outline"
          size="sm"
          @click="handleLogout"
          :loading="loading"
        />
      </div>

      <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
        {{ isAuthenticated ? `Olá, ${user?.email || 'Usuário'}!` : 'Bem-vindo ao Sistema' }}
      </h1>
      
      <p class="text-gray-600 mb-6 text-center">
        {{ isAuthenticated ? 'Você está logado no sistema de agendamento.' : 'Faça login para acessar o sistema de agendamento.' }}
      </p>
      
      <div class="space-y-4">
        <BaseButton
          v-if="!isAuthenticated" 
          label="Fazer Login"
          variant="primary"
          fullWidth
          @click="navigateTo('/login')"
        />
        
        <BaseButton 
          v-if="isAuthenticated"
          label="Ver minha agenda"
          variant="primary"
          fullWidth
          @click="() => {}"
        />
        
        <BaseButton 
          v-if="isAuthenticated"
          label="Novo agendamento"
          variant="secondary"
          fullWidth
          @click="() => {}"
        />
      </div>
      
      <div class="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Status do Sistema:</h3>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>✅ Sistema de autenticação</li>
          <li>✅ Páginas de login e confirmação</li>
          <li>{{ isAuthenticated ? '✅ Usuário autenticado' : '❌ Usuário não autenticado' }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import BaseButton from '../components/BaseButton.vue';

// Usar o composable de autenticação
const { user, isAuthenticated, logout, loading } = useAuth();

// Função para fazer logout
const handleLogout = async () => {
  await logout();
};

// Configuração da página
useHead({
  title: 'Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Página inicial do sistema de agendamento' }
  ]
})
</script>