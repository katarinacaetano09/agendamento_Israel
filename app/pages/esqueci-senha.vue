<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-semibold mb-4">Esqueci minha senha</h1>

      <form class="space-y-4" novalidate>
        <BaseInput
          label="Email"
          placeholder="Digite seu email cadastrado"
        />

        <div class="pt-2">
          <BaseButton class="w-full">Enviar link de recuperação</BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
// Apenas UI por enquanto — sem lógica ou actions
</script>
