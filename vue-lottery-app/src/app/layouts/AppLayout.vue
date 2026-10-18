<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './DefaultLayout.vue'
import AuthLayout from './AuthLayout.vue'

const route = useRoute()

const layouts = {
  DefaultLayout,
  AuthLayout
}

const layout = computed(() => {
  const layoutName = (route.meta.layout as keyof typeof layouts) || 'DefaultLayout'
  return layouts[layoutName] || DefaultLayout
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
