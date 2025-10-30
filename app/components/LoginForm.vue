<template>
  <div class="login-form-container">
    <h2 class="text-2xl font-bold mb-6 text-neutral-800">Acesso ao Sistema</h2>
    
    <p class="text-neutral-600 mb-8">
      Entre com suas credenciais para acessar o sistema de agendamento.
    </p>
    
    <form @submit.prevent="handleLogin" class="space-y-6">
      <BaseInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="Digite seu email"
        required
        :error="validationErrors.email"
      >
        <template #prefix>
          <EnvelopeIcon class="w-5 h-5" />
        </template>
      </BaseInput>
      
      <BaseInput
        v-if="!useOtpLogin"
        v-model="password"
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        required
        :error="validationErrors.password"
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
            v-if="!useOtpLogin"
          />
          <label v-if="!useOtpLogin" for="remember-me" class="ml-2 block text-sm text-neutral-600">
            Lembrar-me
          </label>
        </div>
        
        <div class="text-sm">
          <NuxtLink to="/recuperar-senha" class="font-medium text-primary hover:text-primary-600">Esqueci a senha</NuxtLink>
        </div>
      </div>
      
      <div class="pt-2">
        <BaseButton 
          :label="useOtpLogin ? 'Enviar link de acesso' : 'Entrar'"
          type="submit"
          variant="primary"
          fullWidth
          :loading="loading"
          :disabled="loading"
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
import { ref, reactive } from 'vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import { useAuth } from '../composables/useAuth';

// Estado do formulário
const email = ref('');
const password = ref('');
const validationErrors = reactive({
  email: '',
  password: ''
});
const useOtpLogin = ref(false);

// Autenticação
const { login, loginWithOtp, loading, error } = useAuth();

// Validar campos
const validateForm = () => {
  let isValid = true;
  validationErrors.email = '';
  validationErrors.password = '';
  
  if (!email.value) {
    validationErrors.email = 'Email é obrigatório';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    validationErrors.email = 'Email inválido';
    isValid = false;
  }
  
  if (!password.value) {
    validationErrors.password = 'Senha é obrigatória';
    isValid = false;
  } else if (password.value.length < 6) {
    validationErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    isValid = false;
  }
  
  return isValid;
};

// Handler do submit
const handleLogin = async () => {
  if (!validateEmail()) return;
  
  if (useOtpLogin.value) {
    await loginWithOtp(email.value);
  } else {
    if (validatePassword()) {
      await login(email.value, password.value);
    }
  }
};

// Validar apenas email
const validateEmail = () => {
  validationErrors.email = '';
  
  if (!email.value) {
    validationErrors.email = 'Email é obrigatório';
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    validationErrors.email = 'Email inválido';
    return false;
  }
  
  return true;
};

// Validar apenas senha
const validatePassword = () => {
  validationErrors.password = '';
  
  if (!password.value) {
    validationErrors.password = 'Senha é obrigatória';
    return false;
  } else if (password.value.length < 6) {
    validationErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    return false;
  }
  
  return true;
};
</script>