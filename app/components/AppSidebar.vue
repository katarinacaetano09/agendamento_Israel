<template>
  <div class="sidebar flex flex-col bg-neutral-800 text-white w-64 shadow-lg h-screen overflow-y-auto">
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
          <button 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700 transition-colors w-full text-left"
          >
            <UserGroupIcon class="w-5 h-5" />
            <span>Especialidades</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Rodapé da Sidebar -->
    <div class="sidebar-footer p-4 border-t border-neutral-700">
      <DropdownMenu />
    </div>
  </div>
</template>

<script setup lang="ts">

import { 
  HomeIcon, 
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';
import DropdownMenu from './DropdownMenu.vue';

// Usar composable de autenticação (mantido para futuras funcionalidades)
const { user, logout } = useAuth();
</script>