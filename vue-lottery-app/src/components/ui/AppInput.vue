<script setup lang="ts">
defineProps<{
  label?: string
  type?: string
  placeholder?: string
  error?: string
}>()

const modelValue = defineModel<string | number>()
</script>

<template>
  <div class="flex flex-col gap-1 w-full"> <label v-if="label" class="text-sm font-semibold text-gray-700"> {{ label }}
    </label> <input v-model="modelValue" :type="type || 'text'" :placeholder="placeholder"
      class="border rounded-md px-3 py-2 outline-none transition-colors"
      :class="[error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100']" />
    <span v-if="error" class="text-xs text-red-500"> {{ error }} </span>
  </div>
</template>
