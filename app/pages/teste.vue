<template>
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
      
      <!-- Seção de Toasts -->
      <section class="mb-12 bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6 text-neutral-800 dark:text-white border-b pb-2">
          Notificações Toast
        </h2>
        
        <div class="space-y-6">
          <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Tipos de Toast</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton 
              label="Sucesso" 
              variant="secondary" 
              @click="showSuccessToast" 
            />
            <BaseButton 
              label="Erro" 
              variant="outline" 
              @click="showErrorToast"
            >
              <template #icon-left>
                <ExclamationTriangleIcon class="w-4 h-4 mr-2" />
              </template>
            </BaseButton>
            <BaseButton 
              label="Informação" 
              variant="primary" 
              @click="showInfoToast"
            />
            <BaseButton 
              label="Aviso" 
              variant="neutral" 
              @click="showWarningToast"
            />
          </div>
          
          <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2 mt-6">Opções de Toast</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton 
              label="Com duração longa" 
              variant="ghost" 
              @click="showLongToast"
            />
            <BaseButton 
              label="Com botão de ação" 
              variant="outline" 
              @click="showToastWithAction"
            />
            <BaseButton 
              label="Sem botão fechar" 
              variant="outline" 
              @click="showToastNoClose"
            />
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
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

// Importando o sistema de toast
import { useToast } from 'vue-toastification';
const toast = useToast();

// Métodos para demonstração dos toasts
const showSuccessToast = () => {
  toast.success("Operação realizada com sucesso!", {
    timeout: 3000
  });
};

const showErrorToast = () => {
  toast.error("Ocorreu um erro ao processar a solicitação!", {
    timeout: 4000
  });
};

const showInfoToast = () => {
  toast.info("Esta é uma informação importante.", {
    timeout: 3000
  });
};

const showWarningToast = () => {
  toast.warning("Atenção! Esta ação não pode ser desfeita.", {
    timeout: 4000
  });
};

const showLongToast = () => {
  toast.info("Este toast permanecerá visível por um período mais longo (8 segundos).", {
    timeout: 8000
  });
};

const showToastWithAction = () => {
  toast.info(
    "Clique para realizar uma ação",
    {
      onClick: () => alert("Você clicou no toast!")
    }
  );
};

const showToastNoClose = () => {
  toast.warning("Este toast não possui botão de fechar", {
    closeButton: false
  });
};

// Configuração da página
useHead({
  title: 'Teste de Componentes - App de Agendamento',
  meta: [
    { name: 'description', content: 'Página de teste para avaliar os componentes UI do aplicativo de agendamento' }
  ]
})
</script>