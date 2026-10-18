<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}>()
</script>

<template>
  <Button
    :type="type || 'button'"
    :disabled="disabled"
    :severity="
      variant === 'secondary'
        ? 'secondary'
        : variant === 'danger'
          ? 'danger'
          : 'primary'
    "
    class="app-button"
  >
    <slot />
  </Button>
</template>

<style scoped>
.app-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}
</style>
