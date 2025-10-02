<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow rounded-lg overflow-hidden max-w-4xl w-full">
      <div class="flex flex-col md:flex-row">
        <!-- Coluna da esquerda - Formulário de login -->
        <div class="w-full md:w-1/2 flex items-center justify-center p-8">
          <div class="max-w-md w-full">
            <!-- O componente de formulário de login será incorporado aqui -->
            <LoginForm />
          </div>
        </div>
        
        <!-- Coluna da direita -->
        <div class="hidden md:flex md:w-1/2 bg-primary-50 justify-center items-center p-12">
          <div class="max-w-md text-center">
            <h1 class="text-4xl font-bold text-primary mb-4">Agendamento Fácil</h1>
            <p class="text-xl text-neutral-600">
              A maneira mais simples de organizar sua agenda e gerenciar seus compromissos.
            </p>
            
            <!-- Logo ou ilustração poderia ser adicionada aqui -->
            <div class="mt-8 flex justify-center">
              <div class="h-40 w-40 rounded-full bg-primary-100 flex items-center justify-center">
                <CalendarIcon class="h-24 w-24 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon } from '@heroicons/vue/24/outline';
import LoginForm from '../components/LoginForm.vue';

// Definir layout para esta página - remover o layout padrão na página de login
definePageMeta({
  layout: false
});

// Configuração da página
useHead({
  title: 'Login - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Faça login no sistema de agendamento para gerenciar seus compromissos' }
  ]
})
</script>