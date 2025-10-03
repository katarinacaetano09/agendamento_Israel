<template>
  <div class="sidebar flex flex-col bg-neutral-800 text-white shadow-lg h-screen transition-all duration-300 ease-in-out"
       :class="isCollapsed ? 'w-20' : 'w-64'">
    <!-- Cabeçalho da Sidebar -->
    <div class="sidebar-header p-4 border-b border-neutral-700">
      <!-- Logo -->
      <div v-if="!isCollapsed" class="flex items-center justify-center mb-4">
        <div class="rounded-full bg-primary-500 p-2">
          <CalendarDaysIcon class="w-6 h-6" />
        </div>
        <h2 class="ml-3 text-xl font-bold transition-opacity duration-300">
          Agenda<span class="text-primary-400">App</span>
        </h2>
      </div>
      
      <!-- Botão Toggle -->
      <div class="flex justify-center">
        <button 
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <ChevronLeftIcon v-if="!isCollapsed" class="w-5 h-5" />
          <ChevronRightIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Conteúdo/Navegação da Sidebar -->
    <nav class="sidebar-content flex-grow p-4">
      <ul class="space-y-3">
        <li>
          <NuxtLink 
            to="/" 
            class="group flex items-center p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 relative"
            :class="[
              { 'bg-neutral-700': $route.path === '/' },
              isCollapsed ? 'justify-center' : ''
            ]"
          >
            <HomeIcon class="w-6 h-6 flex-shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 transition-all duration-300">Dashboard</span>
            
            <!-- Tooltip para modo colapsado -->
            <div v-if="isCollapsed" 
                 class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Dashboard
            </div>
          </NuxtLink>
        </li>
        <li>
          <button 
            class="group flex items-center p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 w-full text-left relative"
            :class="isCollapsed ? 'justify-center' : ''"
          >
            <UserGroupIcon class="w-6 h-6 flex-shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 transition-all duration-300">Especialidades</span>
            
            <!-- Tooltip para modo colapsado -->
            <div v-if="isCollapsed" 
                 class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Especialidades
            </div>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Rodapé da Sidebar -->
    <div class="sidebar-footer p-4 border-t border-neutral-700">
      <DropdownMenu :is-collapsed="isCollapsed" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { 
  HomeIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';
import DropdownMenu from './DropdownMenu.vue';

// Estado de colapso da sidebar
const isCollapsed = ref(false);

// Função para alternar o estado da sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Usar composable de autenticação (mantido para futuras funcionalidades)
const { user, logout } = useAuth();
</script>