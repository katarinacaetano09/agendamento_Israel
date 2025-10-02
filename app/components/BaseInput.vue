<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="id" 
      class="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-200"
    >
      {{ label }}
      <span v-if="required" class="text-state-error">*</span>
    </label>
    
    <div class="relative">
      <!-- Prefixo/ícone à esquerda -->
      <div 
        v-if="$slots['prefix']" 
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500"
      >
        <slot name="prefix"></slot>
      </div>
      
      <input
        :id="id"
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="[
          'block w-full rounded-md border-neutral-300 shadow-sm transition-colors',
          'focus:border-primary-500 focus:ring-primary-500 focus:outline-none',
          { 'pl-10': $slots['prefix'] },
          { 'pr-10': $slots['suffix'] || clearable && modelValue || type === 'password' },
          { 'bg-neutral-100 text-neutral-500 cursor-not-allowed': disabled || readonly },
          { 'border-state-error focus:ring-state-error focus:border-state-error': error },
          sizeClass,
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      
      <!-- Botão para mostrar/esconder senha -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-700"
        @click="showPassword = !showPassword"
        :aria-label="showPassword ? 'Esconder senha' : 'Mostrar senha'"
      >
        <EyeIcon v-if="showPassword" class="w-5 h-5" />
        <EyeSlashIcon v-else class="w-5 h-5" />
      </button>
      
      <!-- Botão para limpar -->
      <button
        v-else-if="clearable && modelValue"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-state-error"
        @click="$emit('update:modelValue', '')"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
      
      <!-- Sufixo/ícone à direita -->
      <div 
        v-else-if="$slots['suffix']" 
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500"
      >
        <slot name="suffix"></slot>
      </div>
    </div>
    
    <!-- Mensagem de erro -->
    <p v-if="error" class="mt-1 text-xs text-state-error">{{ error }}</p>
    
    <!-- Descrição/Hint -->
    <p v-else-if="hint" class="mt-1 text-xs text-neutral-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

const showPassword = ref(false);

const props = defineProps({
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 11)}`
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md'
  }
});

defineEmits(['update:modelValue']);

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1.5 text-xs';
    case 'lg': return 'px-4 py-3 text-base';
    default: return 'px-4 py-2 text-sm';
  }
});
</script>