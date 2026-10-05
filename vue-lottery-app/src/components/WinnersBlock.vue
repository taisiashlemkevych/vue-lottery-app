<script setup lang="ts">
import { computed } from "vue";
import type { Participant } from "../types/Participant";
import Winner from "./Winner.vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps<{
  participants: Participant[];
  winners: Participant[];
}>();

const emit = defineEmits<{
  "new-winner": [];
  "remove-winner": [id: number];
}>();

const availableParticipants = computed(() => {
  return props.participants.filter(
    (participant) =>
      !props.winners.some((winner) => winner.id === participant.id),
  );
});

const canChooseWinner = computed(() => {
  return props.winners.length < 3 && availableParticipants.value.length > 0;
});
</script>

<template>
  <section class="card lottery-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Winners</h2>

        <BaseButton
          label="New winner"
          :disabled="!canChooseWinner"
          @click="emit('new-winner')"
        />
      </div>

      <div v-if="winners.length === 0" class="text-secondary">
      </div>

      <div v-else class="d-flex flex-column gap-2">
        <Winner
          v-for="winner in winners"
          :key="winner.id"
          :participant="winner"
          @remove="emit('remove-winner', $event)"
        />
      </div>
    </div>
  </section>
</template>
