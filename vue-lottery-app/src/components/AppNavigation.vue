<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <nav class="flex items-center gap-6">
    <RouterLink
      to="/"
      class="text-slate-500 hover:text-sky-600 transition-colors font-medium"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Головна
    </RouterLink>

    <RouterLink
      to="/about"
      class="text-slate-500 hover:text-sky-600 transition-colors font-medium"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Про автора
    </RouterLink>

    <RouterLink
      v-if="authStore.isAuthenticated"
      to="/users"
      class="text-slate-500 hover:text-sky-600 transition-colors font-medium"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Користувачі
    </RouterLink>

    <button
      v-if="authStore.isAuthenticated"
      class="text-slate-500 hover:text-rose-400 transition-colors font-medium"
      @click="authStore.logout()"
    >
      Вийти
    </button>

    <RouterLink
      v-else
      to="/login"
      class="text-slate-500 hover:text-sky-600 transition-colors font-medium"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Увійти
    </RouterLink>
  </nav>
</template>
