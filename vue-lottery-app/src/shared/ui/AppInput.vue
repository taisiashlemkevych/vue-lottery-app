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
    modelValue.value =
      props.type === 'number' && value !== ''
        ? Number(value)
        : value
  },
})
</script>

<template>
  <div class="flex w-full flex-col gap-1">
    <label
      v-if="label"
      class="text-sm font-semibold text-slate-700"
    >
      {{ label }}
    </label>

    <InputText
      v-model="inputValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :invalid="!!error"
      class="app-input"
    />

    <span v-if="error" class="text-xs text-red-500">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.app-input {
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  padding: 0.65rem 0.875rem;

  color: #334155;
  background-color: #ffffff;

  border: 1px solid #dbe3ef;
  border-radius: 0.625rem;

  outline: none;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.app-input::placeholder {
  color: #94a3b8;
  opacity: 1;
}

.app-input:hover {
  border-color: #bfcee0;
}

.app-input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgb(56 189 248 / 15%);
}

.app-input.p-invalid {
  border-color: #ef4444;
}

.app-input.p-invalid:focus {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 12%);
}
</style>