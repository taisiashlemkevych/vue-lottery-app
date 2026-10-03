<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <div class="mb-3">
    <label class="form-label">
      {{ label }}
    </label>

    <input
      :type="type ?? 'text'"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :value="modelValue"
      :placeholder="placeholder"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />

    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>
