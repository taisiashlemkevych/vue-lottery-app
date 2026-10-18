<script setup lang="ts">
import AppLayout from "@/app/layouts/AppLayout.vue"; 
import { onMounted } from 'vue'
import { useAuthStore } from "@/entities/session/model/auth.store";

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <AppLayout />
</template>
