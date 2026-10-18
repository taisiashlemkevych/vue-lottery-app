<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/app/layouts/AppLayout.vue'
import { useAuthStore } from '@/entities/session'
import Toast from 'primevue/toast'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <Toast position="top-right" />
  <AppLayout />
</template>

