<script setup lang="ts">
import type { Participant } from "../types/Participant";

defineProps<{
  participant: Participant;
}>();

const emit = defineEmits<{
  remove: [id: number];
}>();
</script>

<template>
  <div class="winner-item">
    <div class="winner-item__info">
      <div class="winner-item__name">
        {{ participant.name }}
      </div>

      <div class="winner-item__email">
        {{ participant.email }}
      </div>
    </div>

    <button
      type="button"
      class="btn btn-outline-danger btn-sm"
      @click="emit('remove', participant.id)"
    >
      ×
    </button>
  </div>
</template>
