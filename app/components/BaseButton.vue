<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-all rounded-md',
      sizeClass,
      variantClass,
      { 'opacity-50 cursor-not-allowed pointer-events-none': disabled, 'cursor-pointer': !disabled },
      { 'w-full': fullWidth },
    ]"
    :disabled="disabled"
    :type="type"
    :aria-busy="loading ? 'true' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="$emit('click', $event)"
  >
    <!-- Leading icon slot -->
    <slot name="icon-left"></slot>

    <!-- Loading spinner -->
    <span v-if="loading" class="mr-2 animate-spin">
      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>

    <!-- Button text -->
    <span :class="{ 'opacity-0': loading }">
      <slot>{{ label }}</slot>
    </span>

    <!-- Trailing icon slot -->
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  label: { type: String, default: '' },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
});

defineEmits(['click']);

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1.5 text-xs';
    case 'lg': return 'px-6 py-3 text-base';
    default: return 'px-4 py-2 text-sm'; // Medium (default)
  }
});

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none shadow-sm';
    case 'secondary':
      return 'bg-secondary text-white hover:bg-secondary-500 focus:ring-2 focus:ring-secondary-200 focus:outline-none shadow-sm';
    case 'neutral':
      return 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus:ring-2 focus:ring-neutral-100 focus:outline-none';
    case 'outline':
      return 'bg-transparent border border-primary text-primary hover:bg-primary-50 focus:ring-2 focus:ring-primary-100 focus:outline-none';
    case 'ghost':
      return 'bg-transparent text-primary hover:bg-primary-50 focus:ring-2 focus:ring-primary-100 focus:outline-none';
    default:
      return 'bg-primary text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none shadow-sm';
  }
});
</script>