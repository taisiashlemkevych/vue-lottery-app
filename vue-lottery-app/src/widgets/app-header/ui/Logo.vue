<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'AppLogo'
})
</script>

<template>
  <RouterLink
    to="/"
    class="text-2xl font-black text-sky-700 tracking-wider hover:text-sky-500 transition-colors"
  >
    VueLottery
  </RouterLink>
</template>
