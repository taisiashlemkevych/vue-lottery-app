<script setup lang="ts">
import { computed } from 'vue'
import AppButton from './ui/AppButton.vue'
import type { Participant } from '../types/participant.ts'

const props = defineProps<{
  participants: Participant[]
  winners: Participant[]
}>()

const emit = defineEmits<{
  (e: 'add-winner', participant: Participant): void
  (e: 'remove-winner', winnerId: number): void
}>()

const isButtonDisabled = computed(() => {
  if (props.winners.length >= 3) return true
  if (props.participants.length === 0) return true
  if (props.participants.length === props.winners.length) return true

  return false;
})

const pickRandomWinner = () => {
  if (isButtonDisabled.value) return

  const availableParticipants = props.participants.filter(
    p => !props.winners.some(w => w.id === p.id)
  )

  if (availableParticipants.length === 0) return

  const randomIndex = Math.floor(Math.random() * availableParticipants.length)
  const randomWinner = availableParticipants[randomIndex]

  if (randomWinner) {
    emit('add-winner', randomWinner)
  }
}
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div class="flex-1 w-full">
        <h2 class="text-xl font-bold text-slate-800 mb-3"> Winners </h2>
        <div class="flex flex-wrap gap-2"> <span v-if="winners.length === 0" class="text-sm text-slate-400"> No winners
            yet </span>
          <div v-for="winner in winners" :key="winner.id"
            class="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm"> <span>{{ winner.name
              }}</span> <button type="button" class="text-blue-500 hover:text-red-500"
              @click="emit('remove-winner', winner.id)"> ✕ </button> </div>
        </div>
      </div>
      <AppButton :disabled="isButtonDisabled" @click="pickRandomWinner"> New winner </AppButton>
    </div>
  </div>
</template>
