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
          <NuxtLink 
            to="/agendamentos" 
            class="group flex items-center p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 relative"
            :class="[
              { 'bg-neutral-700': $route.path === '/agendamentos' },
              isCollapsed ? 'justify-center' : ''
            ]"
          >
            <CalendarIcon class="w-6 h-6 flex-shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 transition-all duration-300">Agendamentos</span>
            
            <!-- Tooltip para modo colapsado -->
            <div v-if="isCollapsed" 
                 class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Agendamentos
            </div>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/clientes" 
            class="group flex items-center p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 relative"
            :class="[
              { 'bg-neutral-700': $route.path === '/clientes' },
              isCollapsed ? 'justify-center' : ''
            ]"
          >
            <UsersIcon class="w-6 h-6 flex-shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 transition-all duration-300">Clientes</span>
            
            <!-- Tooltip para modo colapsado -->
            <div v-if="isCollapsed" 
                 class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Clientes
            </div>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/profissionais" 
            class="group flex items-center p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 relative"
            :class="[
              { 'bg-neutral-700': $route.path === '/profissionais' },
              isCollapsed ? 'justify-center' : ''
            ]"
          >
            <UserIcon class="w-6 h-6 flex-shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 transition-all duration-300">Profissionais</span>
            
            <!-- Tooltip para modo colapsado -->
            <div v-if="isCollapsed" 
                 class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Profissionais
            </div>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/especialidades" 
            class="group flex items-center p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 relative"
            :class="[
              { 'bg-neutral-700': $route.path === '/especialidades' },
              isCollapsed ? 'justify-center' : ''
            ]"
          >
            <UserGroupIcon class="w-6 h-6 flex-shrink-0" />
            <span v-if="!isCollapsed" class="ml-3 transition-all duration-300">Especialidades</span>
            
            <!-- Tooltip para modo colapsado -->
            <div v-if="isCollapsed" 
                 class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Especialidades
            </div>
          </NuxtLink>
        </li>
        <li v-if="isAdmin">
          <NuxtLink 
            to="/admin" 
            class="group flex items-center p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 relative"
            :class="[
              { 'bg-neutral-700': $route.path === '/admin' },
              isCollapsed ? 'justify-center' : ''
            ]"
          >
            <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 014.27 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.21 4.27A2 2 0 017.04 1.44l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V1a2 2 0 014 0v.09c.12.64.6 1.17 1.25 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06A2 2 0 0119.73 4.27l-.06.06a1.65 1.65 0 00-.33 1.82V7c.64.12 1.17.6 1.51 1.25v.01c.12.64-.12 1.35-.66 1.75z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="!isCollapsed" class="ml-3 transition-all duration-300">Admin</span>

            <div v-if="isCollapsed" 
                 class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Admin
            </div>
          </NuxtLink>
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

import { ref, computed } from 'vue';
import { 
  HomeIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  CalendarIcon,
  UsersIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';
import { useUserStore } from '~/stores/user'
import DropdownMenu from './DropdownMenu.vue';

// Estado de colapso da sidebar
const isCollapsed = ref(false);

// Função para alternar o estado da sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Usar composable de autenticação (mantido para futuras funcionalidades)
const { user, logout } = useAuth();
// store do perfil para checar a role
const userStore = useUserStore()
const isAdmin = computed(() => userStore.profile?.role === 'admin')
</script>