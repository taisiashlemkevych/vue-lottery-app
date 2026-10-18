<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/entities/session'
import { useSettingsStore } from '@/shared/model'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
</script>

<template>
  <nav class="flex flex-wrap items-center gap-4 sm:gap-6">
    <RouterLink
      to="/"
      class="text-slate-500 transition-colors hover:text-sky-600 font-medium"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Головна
    </RouterLink>

    <RouterLink
      to="/about"
      class="text-slate-500 transition-colors hover:text-sky-600 font-medium"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Про автора
    </RouterLink>

    <RouterLink
      v-if="authStore.isAuthenticated"
      to="/users"
      class="text-slate-500 transition-colors hover:text-sky-600 font-medium"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Користувачі
    </RouterLink>

    <button
      type="button"
      class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      :aria-label="settingsStore.theme === 'light'
        ? 'Увімкнути темну тему'
        : 'Увімкнути світлу тему'"
      @click="settingsStore.toggleTheme()"
    >
      {{ settingsStore.theme === 'light' ? ' Темна тема' : ' Світла тема' }}
    </button>

    <button
      v-if="authStore.isAuthenticated"
      type="button"
      class="font-medium text-slate-500 transition-colors hover:text-rose-500"
      @click="authStore.logout()"
    >
      Вийти
    </button>

    <RouterLink
      v-else
      to="/login"
      class="font-medium text-slate-500 transition-colors hover:text-sky-600"
      active-class="text-sky-700 font-bold border-b-2 border-sky-400 pb-1"
    >
      Увійти
    </RouterLink>
  </nav>
</template>


