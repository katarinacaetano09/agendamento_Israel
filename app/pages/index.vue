<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-4 text-center">
        Teste do Tailwind CSS
      </h1>
      
      <p class="text-gray-600 mb-6 text-center">
        Esta é uma página de teste para verificar se o Tailwind CSS está funcionando corretamente no projeto Nuxt 4.
      </p>
      
      <div class="space-y-4">
        <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          Botão Primário
        </button>
        
        <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          Botão Secundário
        </button>
      </div>
      
      <div class="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Classes Tailwind testadas:</h3>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>✅ Cores e gradientes</li>
          <li>✅ Espaçamentos e layout</li>
          <li>✅ Tipografia</li>
          <li>✅ Sombras e bordas</li>
          <li>✅ Transições e hover</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuração da página
useHead({
  title: 'Teste Tailwind - Nuxt 4',
  meta: [
    { name: 'description', content: 'Página de teste para verificar funcionamento do Tailwind CSS' }
  ]
})
</script>