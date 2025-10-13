<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout name="default-layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
onMounted(() => {
  userStore.fetchProfile()
})
</script>
