<template>
  <div>
    <div v-if="!isAuthenticated" class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
        Bem-vindo ao Sistema
      </h1>
      
      <p class="text-gray-600 mb-6 text-center">
        Faça login para acessar o sistema de agendamento.
      </p>
      
      <div class="space-y-4">
        <BaseButton
          label="Fazer Login"
          variant="primary"
          fullWidth
          @click="navigateTo('/login')"
        />
      </div>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Card de Estatísticas - Agendamentos Hoje -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center">
            <h3 class="text-neutral-600 font-medium">Agendamentos Hoje</h3>
            <div class="bg-blue-100 p-2 rounded">
              <CalendarDaysIcon class="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p class="text-3xl font-bold mt-2">8</p>
          <p class="text-xs text-neutral-500 mt-1">+2 em relação a ontem</p>
        </div>

        <!-- Card de Estatísticas - Total Clientes -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center">
            <h3 class="text-neutral-600 font-medium">Total de Clientes</h3>
            <div class="bg-green-100 p-2 rounded">
              <UserGroupIcon class="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p class="text-3xl font-bold mt-2">42</p>
          <p class="text-xs text-neutral-500 mt-1">+5 este mês</p>
        </div>

        <!-- Card de Estatísticas - Completados -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center">
            <h3 class="text-neutral-600 font-medium">Completados</h3>
            <div class="bg-purple-100 p-2 rounded">
              <CheckCircleIcon class="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p class="text-3xl font-bold mt-2">152</p>
          <p class="text-xs text-neutral-500 mt-1">90% de taxa de sucesso</p>
        </div>

        <!-- Card de Estatísticas - Faturamento -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center">
            <h3 class="text-neutral-600 font-medium">Faturamento</h3>
            <div class="bg-amber-100 p-2 rounded">
              <CurrencyDollarIcon class="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p class="text-3xl font-bold mt-2">R$ 4.250</p>
          <p class="text-xs text-neutral-500 mt-1">+12% este mês</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Próximos Agendamentos</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Maria Silva</td>
                <td class="px-6 py-4 whitespace-nowrap">Consulta</td>
                <td class="px-6 py-4 whitespace-nowrap">Hoje, 14:00</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmado</span>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">João Santos</td>
                <td class="px-6 py-4 whitespace-nowrap">Avaliação</td>
                <td class="px-6 py-4 whitespace-nowrap">Hoje, 15:30</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendente</span>
                </td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">Ana Pereira</td>
                <td class="px-6 py-4 whitespace-nowrap">Retorno</td>
                <td class="px-6 py-4 whitespace-nowrap">Amanhã, 09:00</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  CurrencyDollarIcon 
} from '@heroicons/vue/24/outline';
import BaseButton from '../components/BaseButton.vue';
import { useAuth } from '../composables/useAuth';

// Usar o composable de autenticação
const { isAuthenticated } = useAuth();

// Configuração da página
useHead({
  title: 'Dashboard - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Dashboard do sistema de agendamento' }
  ]
});
</script>