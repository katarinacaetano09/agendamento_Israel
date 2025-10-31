<template>
  <section class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Admin</h1>
    <p class="text-neutral-700 mb-6">Área administrativa — painéis, relatórios e configurações.</p>

    <div class="mt-6">
      <TabelaAdmin />
    </div>
  </section>
</template>

<script setup lang="ts">
  import TabelaAdmin from '~/components/TabelaAdmin.vue'
// Usa o layout padrão (app.vue já envolve as páginas com `default-layout`)
// Definir middleware para checar permissão de admin
declare function definePageMeta(meta: any): void
definePageMeta({ middleware: 'admin' })
</script>
