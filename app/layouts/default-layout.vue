<template>
  <div class="flex min-h-screen bg-neutral-100">
    <!-- Sidebar -->
    <AppSidebar v-if="isAuthenticated" />
    
    <!-- Conteúdo principal -->
    <div class="flex flex-col flex-grow">
      
      <!-- Conteúdo principal -->
      <main class="flex-grow p-6">
        <!-- Renderizar o conteúdo da página atual -->
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import AppSidebar from '../components/AppSidebar.vue';

// Usar composable de autenticação
const { isAuthenticated } = useAuth();
</script>