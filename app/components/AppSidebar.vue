<template>
  <div class="sidebar h-screen flex flex-col bg-neutral-800 text-white w-64 shadow-lg">
    <!-- Cabeçalho da Sidebar -->
    <div class="sidebar-header p-4 border-b border-neutral-700">
      <div class="flex items-center space-x-3">
        <div class="rounded-full bg-primary-500 p-2">
          <CalendarDaysIcon class="w-6 h-6" />
        </div>
        <h2 class="text-xl font-bold">Agenda<span class="text-primary-400">App</span></h2>
      </div>
    </div>

    <!-- Conteúdo/Navegação da Sidebar -->
    <nav class="sidebar-content flex-grow p-4">
      <ul class="space-y-2">
        <li>
          <NuxtLink 
            to="/" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700 transition-colors"
            :class="{ 'bg-neutral-700': $route.path === '/' }"
          >
            <HomeIcon class="w-5 h-5" />
            <span>Dashboard</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/agendamentos" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700 transition-colors"
            :class="{ 'bg-neutral-700': $route.path === '/agendamentos' }"
          >
            <CalendarIcon class="w-5 h-5" />
            <span>Agendamentos</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/clientes" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700 transition-colors"
            :class="{ 'bg-neutral-700': $route.path === '/clientes' }"
          >
            <UserGroupIcon class="w-5 h-5" />
            <span>Clientes</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/configuracoes" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700 transition-colors"
            :class="{ 'bg-neutral-700': $route.path === '/configuracoes' }"
          >
            <Cog6ToothIcon class="w-5 h-5" />
            <span>Configurações</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Rodapé da Sidebar -->
    <div class="sidebar-footer p-4 border-t border-neutral-700">
      <button 
        @click="handleLogout"
        class="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-neutral-700 transition-colors text-red-400 hover:text-red-300"
      >
        <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        <span>Sair</span>
      </button>
      
      <div class="mt-4 flex items-center">
        <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
          {{ userInitials }}
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium truncate">{{ userEmail }}</p>
          <p class="text-xs text-neutral-400">Online</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  HomeIcon, 
  CalendarIcon, 
  CalendarDaysIcon,
  UserGroupIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';

// Usar composable de autenticação
const { user, logout } = useAuth();

// Computar iniciais do usuário para avatar
const userInitials = computed(() => {
  if (!user.value?.email) return '?';
  
  // Pegar primeira letra do email
  return user.value.email.substring(0, 1).toUpperCase();
});

// Email do usuário
const userEmail = computed(() => {
  return user.value?.email || 'Usuário';
});

// Função para fazer logout
const handleLogout = async () => {
  await logout();
};
</script>