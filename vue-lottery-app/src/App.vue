<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <AppLayout />
</template>
