<template>
  <div class="relative">
    <!-- Botão que abre o dropdown -->
    <button 
      @click="toggleDropdown"
      class="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-neutral-700 transition-colors"
      :class="{ 'bg-neutral-700': isOpen }"
    >
      <Cog6ToothIcon class="w-5 h-5" />
      <span>Configurações</span>
      <ChevronUpIcon v-if="isOpen" class="w-4 h-4 ml-auto transition-transform" />
      <ChevronDownIcon v-else class="w-4 h-4 ml-auto transition-transform" />
    </button>

    <!-- Menu Dropdown -->
    <div 
      v-if="isOpen"
      class="absolute bottom-full left-0 right-0 mb-2 bg-neutral-700 rounded-lg shadow-lg border border-neutral-600 overflow-hidden"
    >
      <ul class="py-2">
        <li>
          <button 
            class="flex items-center space-x-3 w-full px-4 py-2 hover:bg-neutral-600 transition-colors text-left"
          >
            <UserCircleIcon class="w-4 h-4" />
            <span class="text-sm">Perfil</span>
          </button>
        </li>
        <li>
          <button 
            @click="handleLogout"
            class="flex items-center space-x-3 w-full px-4 py-2 hover:bg-neutral-600 transition-colors text-red-400 hover:text-red-300 text-left"
          >
            <ArrowLeftOnRectangleIcon class="w-4 h-4" />
            <span class="text-sm">Sair</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Cog6ToothIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';

// Estado do dropdown
const isOpen = ref(false);

// Composable de autenticação
const { logout } = useAuth();

// Função para alternar o dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Função para fazer logout
const handleLogout = async () => {
  isOpen.value = false; // Fechar o dropdown
  await logout();
};

// Fechar dropdown quando clicar fora (opcional - pode ser implementado depois)
// onMounted(() => {
//   document.addEventListener('click', (event) => {
//     if (!event.target?.closest('.relative')) {
//       isOpen.value = false;
//     }
//   });
// });
</script>