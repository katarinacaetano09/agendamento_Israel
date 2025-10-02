<template>
  <div class="min-h-screen bg-white flex">
    <!-- Coluna da esquerda - Formulário de login -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="max-w-md w-full">
        <!-- O componente de formulário de login será incorporado aqui -->
        <LoginForm />
      </div>
    </div>
    
    <!-- Coluna da direita -->
    <div class="hidden lg:flex lg:w-1/2 bg-primary-50 justify-center items-center p-12">
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
</template>

<script setup lang="ts">
import { CalendarIcon } from '@heroicons/vue/24/outline';
import LoginForm from '../components/LoginForm.vue';

// Configuração da página
useHead({
  title: 'Login - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Faça login no sistema de agendamento para gerenciar seus compromissos' }
  ]
})
</script>