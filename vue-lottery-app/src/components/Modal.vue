<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

function handleEsc(event: KeyboardEvent) {
  if (event.key === "Escape") {
    emit("close");
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc);
});
</script>

<template>
  <div
    class="modal d-block modal-backdrop-custom"
    tabindex="-1"
    @click.self="emit('close')"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }}
          </h5>

          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="emit('close')"
          />
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
