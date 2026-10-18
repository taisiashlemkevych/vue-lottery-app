<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative m-4">
        
        <button 
          @click="emit('close')" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h3 v-if="title" class="text-xl font-bold mb-4 text-gray-800">
          {{ title }}
        </h3>
        
        <div class="mb-6">
          <slot />
        </div>
        
        <div class="flex justify-end gap-3">
          <slot name="footer" />
        </div>

      </div>
    </div>
  </Teleport>
</template>
