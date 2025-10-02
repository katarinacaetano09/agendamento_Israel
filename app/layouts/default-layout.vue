<template>
  <div class="flex min-h-screen bg-neutral-100">
    <!-- Sidebar -->
    <AppSidebar v-if="isAuthenticated" />
    
    <!-- Conteúdo principal -->
    <div class="flex flex-col flex-grow">
      <!-- Cabeçalho principal -->
      <header v-if="isAuthenticated" class="bg-white shadow-sm h-16 flex items-center px-6 z-10">
        <div class="flex items-center justify-between w-full">
          <h1 class="text-xl font-semibold text-neutral-800">{{ pageTitle }}</h1>
          
          <div class="flex items-center space-x-4">
            <button class="text-neutral-500 hover:text-neutral-700">
              <BellIcon class="w-6 h-6" />
            </button>
            <button class="text-neutral-500 hover:text-neutral-700">
              <MagnifyingGlassIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      
      <!-- Conteúdo principal -->
      <main class="flex-grow p-6">
        <!-- Renderizar o conteúdo da página atual -->
        <slot />
      </main>
      
      <!-- Rodapé principal -->
      <footer v-if="isAuthenticated" class="bg-white p-4 text-center text-neutral-500 text-sm border-t">
        <p>© {{ currentYear }} AgendaApp - Sistema de Agendamentos</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';
import AppSidebar from '../components/AppSidebar.vue';

// Usar composable de autenticação
const { isAuthenticated } = useAuth();
const route = useRoute();

// Mapeamento de títulos de página
const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/agendamentos': 'Gerenciar Agendamentos',
  '/clientes': 'Clientes',
  '/configuracoes': 'Configurações',
  '/login': 'Login',
  '/confirm': 'Confirmação de Acesso'
};

// Computar o título da página atual
const pageTitle = computed(() => {
  return pageTitles[route.path] || 'Página';
});

// Ano atual para o rodapé
const currentYear = new Date().getFullYear();
</script>