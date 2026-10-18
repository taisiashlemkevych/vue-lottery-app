<script setup lang="ts">
import AppHeader from "@/widgets/app-header/ui/AppHeader.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-5xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>
