<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <div class="container mx-auto py-12 px-4">
      <h1 class="text-3xl font-bold text-neutral-800 dark:text-white mb-8">
        Componentes de UI - Teste
      </h1>
      
      <!-- Seção de Botões -->
      <section class="mb-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6 text-neutral-800 dark:text-white border-b pb-2">
          BaseButton
        </h2>
        
        <div class="space-y-6">
          <!-- Variantes -->
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200">Variantes</h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton label="Primário" variant="primary" />
              <BaseButton label="Secundário" variant="secondary" />
              <BaseButton label="Neutro" variant="neutral" />
              <BaseButton label="Outline" variant="outline" />
              <BaseButton label="Ghost" variant="ghost" />
            </div>
          </div>
          
          <!-- Tamanhos -->
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200">Tamanhos</h3>
            <div class="flex flex-wrap items-center gap-4">
              <BaseButton label="Pequeno" size="sm" />
              <BaseButton label="Médio" size="md" />
              <BaseButton label="Grande" size="lg" />
            </div>
          </div>
          
          <!-- Estados -->
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200">Estados</h3>
            <div class="flex flex-wrap gap-4">
              <BaseButton label="Normal" />
              <BaseButton label="Desabilitado" disabled />
              <BaseButton label="Carregando" loading />
            </div>
          </div>
          
          <!-- Largura Total -->
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200">Largura Total</h3>
            <BaseButton label="Botão com largura total" fullWidth />
          </div>
        </div>
      </section>
      
      <!-- Seção de Inputs -->
      <section class="mb-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6 text-neutral-800 dark:text-white border-b pb-2">
          BaseInput
        </h2>
        
        <div class="space-y-6 max-w-md">
          <!-- Input Básico -->
          <div>
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Básico</h3>
            <BaseInput label="Nome" placeholder="Digite seu nome" />
          </div>
          
          <!-- Input com Ícones -->
          <div>
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Com Ícones</h3>
            <BaseInput 
              label="E-mail" 
              placeholder="exemplo@email.com"
              type="email"
            >
              <template #prefix>
                <EnvelopeIcon class="w-5 h-5" />
              </template>
            </BaseInput>

            <div class="mt-4">
              <BaseInput 
                label="Usuário" 
                placeholder="Nome de usuário"
              >
                <template #prefix>
                  <UserIcon class="w-5 h-5" />
                </template>
              </BaseInput>
            </div>

            <div class="mt-4">
              <BaseInput 
                label="Senha" 
                type="password"
                placeholder="Digite sua senha"
              >
                <template #prefix>
                  <LockClosedIcon class="w-5 h-5" />
                </template>
              </BaseInput>
            </div>
          </div>
          
          <!-- Input com Limpeza -->
          <div>
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Limpável</h3>
            <BaseInput 
              label="Pesquisa" 
              placeholder="Digite para pesquisar"
              clearable
              modelValue="Texto exemplo"
            >
              <template #prefix>
                <MagnifyingGlassIcon class="w-5 h-5" />
              </template>
            </BaseInput>
          </div>
          
          <!-- Estados de Input -->
          <div>
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Estados</h3>
            <div class="space-y-4">
              <BaseInput label="Desabilitado" placeholder="Não é possível editar" disabled />
              <BaseInput label="Somente leitura" placeholder="Somente leitura" readonly modelValue="Informação apenas para visualização" />
              <BaseInput label="Com erro" error="Este campo contém um erro" />
              <BaseInput label="Com dica" hint="Dica: insira apenas letras" />
            </div>
          </div>
          
          <!-- Tamanhos de Input -->
          <div>
            <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Tamanhos</h3>
            <div class="space-y-4">
              <BaseInput label="Pequeno" placeholder="Input pequeno" size="sm" />
              <BaseInput label="Médio (padrão)" placeholder="Input médio" />
              <BaseInput label="Grande" placeholder="Input grande" size="lg" />
            </div>
          </div>
        </div>
      </section>
      
      <!-- Combinação de Componentes -->
      <section class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6 text-neutral-800 dark:text-white border-b pb-2">
          Exemplo de Formulário
        </h2>
        
        <form class="max-w-md space-y-4">
          <BaseInput 
            label="Nome completo" 
            placeholder="Digite seu nome completo"
            required
          >
            <template #prefix>
              <UserCircleIcon class="w-5 h-5" />
            </template>
          </BaseInput>
          
          <BaseInput 
            label="E-mail" 
            type="email"
            placeholder="Digite seu e-mail"
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
          
          <div class="pt-2">
            <BaseButton 
              type="submit"
              label="Cadastrar"
              variant="primary"
              fullWidth
            />
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importando os componentes
import BaseButton from '../components/BaseButton.vue';
import BaseInput from '../components/BaseInput.vue';

// Importando ícones do Heroicons
import { 
  EnvelopeIcon, 
  UserIcon, 
  LockClosedIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline';

// Configuração da página
useHead({
  title: 'Teste de Componentes - App de Agendamento',
  meta: [
    { name: 'description', content: 'Página de teste para avaliar os componentes UI do aplicativo de agendamento' }
  ]
})
</script>