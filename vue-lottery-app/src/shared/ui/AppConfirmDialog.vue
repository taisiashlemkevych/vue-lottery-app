<script setup lang="ts">
import AppModal from './AppModal.vue'
import AppButton from './AppButton.vue'

withDefaults(defineProps<{
  isOpen: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}>(), {
  title: 'Підтвердження дії',
  message: 'Ви впевнені, що хочете продовжити?',
  confirmLabel: 'Підтвердити',
  cancelLabel: 'Скасувати',
  loading: false,
})

defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <AppModal
    :is-open="isOpen"
    :title="title"
    @close="$emit('close')"
  >
    <p class="text-slate-600">{{ message }}</p>

    <template #footer>
      <AppButton
        variant="secondary"
        :disabled="loading"
        @click="$emit('close')"
      >
        {{ cancelLabel }}
      </AppButton>

      <AppButton
        variant="danger"
        :disabled="loading"
        @click="$emit('confirm')"
      >
        {{ loading ? 'Зачекайте…' : confirmLabel }}
      </AppButton>
    </template>
  </AppModal>
</template>
