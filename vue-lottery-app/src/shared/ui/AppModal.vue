<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  isOpen: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = computed({
  get: () => props.isOpen,
  set: (value: boolean) => {
    if (!value) {
      emit('close')
    }
  },
})
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="title"
    modal
    :closable="true"
    :draggable="false"
    :style="{ width: 'min(28rem, calc(100vw - 2rem))' }"
  >
    <div class="mb-6">
      <slot />
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <slot name="footer" />
      </div>
    </template>
  </Dialog>
</template>
