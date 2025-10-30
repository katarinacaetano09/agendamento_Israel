<template>
  <section class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Admin</h1>
    <p class="text-neutral-700 mb-6">Área administrativa — painéis, relatórios e configurações.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded shadow">Placeholder para controles de administração</div>
      <div class="bg-white p-4 rounded shadow">Outra seção administrativa</div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Usa o layout padrão (app.vue já envolve as páginas com `default-layout`)
// Definir middleware para checar permissão de admin
declare function definePageMeta(meta: any): void
definePageMeta({ middleware: 'admin' })
</script>
