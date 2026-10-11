<script setup lang="ts">
import { ref, watch } from 'vue'
import AppInput from './ui/AppInput.vue'

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void
}>()

const searchQuery = ref('')
let timeoutId: ReturnType<typeof setTimeout>

watch(searchQuery, (newValue) => {
  clearTimeout(timeoutId)
  
  timeoutId = setTimeout(() => {
    emit('filter-by-name', newValue)
  }, 300)
})
</script>

<template>
  <div class="mb-4">
    <AppInput 
      v-model="searchQuery" 
      placeholder="Search by name..." 
    />
  </div>
</template>
