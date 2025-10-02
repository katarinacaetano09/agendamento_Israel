<template>
  <div class="login-form-container">
    <h2 class="text-2xl font-bold mb-6 text-neutral-800">Acesso ao Sistema</h2>
    
    <p class="text-neutral-600 mb-8">
      Entre com suas credenciais para acessar o sistema de agendamento.
    </p>
    
    <form @submit.prevent class="space-y-6">
      <BaseInput
        label="Email"
        type="email"
        placeholder="Digite seu email"
        required
      >
        <template #prefix>
          <EnvelopeIcon class="w-5 h-5" />
        </template>
      </BaseInput>
      
      <BaseInput
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        required
      >
        <template #prefix>
          <LockClosedIcon class="w-5 h-5" />
        </template>
      </BaseInput>
      
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          <input 
            id="remember-me" 
            type="checkbox" 
            class="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
          />
          <label for="remember-me" class="ml-2 block text-sm text-neutral-600">
            Lembrar-me
          </label>
        </div>
        
        <div class="text-sm">
          <a href="#" class="font-medium text-primary hover:text-primary-600">
            Esqueceu a senha?
          </a>
        </div>
      </div>
      
      <div class="pt-2">
        <BaseButton 
          label="Entrar"
          type="submit"
          variant="primary"
          fullWidth
        />
      </div>
      
      <div class="text-center text-sm text-neutral-600 mt-6">
        Ainda não tem uma conta?
        <a href="#" class="font-medium text-primary hover:text-primary-600">
          Cadastre-se
        </a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
</script>