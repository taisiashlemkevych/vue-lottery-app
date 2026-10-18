<script setup lang="ts">
import { computed } from 'vue'
import AppButton from '@/shared/ui/AppButton.vue'
import type { Participant } from './types'

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

  return false
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
  <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex-1 w-full">
        <h2 class="text-lg font-bold text-slate-800 mb-3">Переможці</h2>

        <span v-if="winners.length === 0" class="text-sm text-slate-400">
          Поки жодного переможця
        </span>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="winner in winners"
            :key="winner.id"
            class="flex items-center gap-3 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm border border-blue-100"
          >
            <div>
              <span class="font-semibold block leading-tight">{{ winner.name }}</span>
              <span class="text-xs text-blue-400">{{ winner.email }}</span>
            </div>

            <button
              type="button"
              class="text-blue-400 hover:text-red-500 font-bold px-1"
              aria-label="Видалити переможця"
              @click="emit('remove-winner', winner.id)"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <AppButton :disabled="isButtonDisabled" @click="pickRandomWinner">
        Обрати переможця
      </AppButton>
    </div>
  </div>
</template>