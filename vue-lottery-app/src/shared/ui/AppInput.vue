<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { computed } from 'vue'

const props = defineProps<{
  label?: string
  type?: string
  placeholder?: string
  error?: string
}>()

const modelValue = defineModel<string | number>()

const inputValue = computed({
  get: () => String(modelValue.value ?? ''),
  set: (value: string) => {
    modelValue.value = props.type === 'number' && value !== ''
      ? Number(value)
      : value
  },
})
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" class="text-sm font-semibold text-gray-700">
      {{ label }}
    </label>

    <InputText v-model="inputValue" :type="type || 'text'" :placeholder="placeholder" :invalid="!!error"
      class="app-input" />

    <span v-if="error" class="text-xs text-red-500">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.app-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.app-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #dbeafe;
}

.app-input.p-invalid {
  border-color: #ef4444;
}
</style>
