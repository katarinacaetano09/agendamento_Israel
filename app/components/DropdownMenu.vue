<template>
  <div class="relative">
    <!-- Botão que abre o dropdown -->
    <button 
      @click="toggleDropdown"
      class="group flex items-center w-full p-3 rounded-lg hover:bg-neutral-700 transition-all duration-200 relative"
      :class="[
        { 'bg-neutral-700': isOpen },
        props.isCollapsed ? 'justify-center' : ''
      ]"
    >
      <Cog6ToothIcon class="w-6 h-6 flex-shrink-0" />
      <span v-if="!props.isCollapsed" class="ml-3 transition-all duration-300">Configurações</span>
      <ChevronUpIcon v-if="isOpen && !props.isCollapsed" class="w-4 h-4 ml-auto transition-transform" />
      <ChevronDownIcon v-else-if="!props.isCollapsed" class="w-4 h-4 ml-auto transition-transform" />
      
      <!-- Tooltip para modo colapsado -->
      <div v-if="props.isCollapsed" 
           class="absolute left-full ml-3 px-2 py-1 bg-neutral-900 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        Configurações
      </div>
    </button>

    <!-- Menu Dropdown -->
    <div 
      v-if="isOpen"
      class="absolute bottom-full mb-2 bg-neutral-700 rounded-lg shadow-lg border border-neutral-600 overflow-hidden min-w-max"
      :class="props.isCollapsed ? 'left-full ml-2' : 'left-0 right-0'"
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

// Props
interface Props {
  isCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false
});

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