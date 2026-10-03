<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Participant } from './types/Participant'
import WinnersBlock from './components/WinnersBlock.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'

const STORAGE_KEY = 'vue-lottery-participants'

const participants = ref<Participant[]>([])
const winners = ref<Participant[]>([])

onMounted(() => {
  const storedParticipants =
    localStorage.getItem(STORAGE_KEY)

  if (storedParticipants) {
    try {
      participants.value =
        JSON.parse(storedParticipants)
    } catch {
      participants.value = []
    }
  }
})

watch(
  participants,
  value => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(value)
    )
  },
  {
    deep: true,
  }
)

function addParticipant(
  participant: Participant
) {
  const emailExists = participants.value.some(
    existing =>
      existing.email.toLowerCase() ===
      participant.email.toLowerCase()
  )

  if (emailExists) {
    return
  }

  participants.value.push(participant)
}

function updateParticipant(
  updatedParticipant: Participant
) {
  const index = participants.value.findIndex(
    participant =>
      participant.id === updatedParticipant.id
  )

  if (index === -1) {
    return
  }

  participants.value[index] = updatedParticipant

  const winnerIndex = winners.value.findIndex(
    winner =>
      winner.id === updatedParticipant.id
  )

  if (winnerIndex !== -1) {
    winners.value[winnerIndex] =
      updatedParticipant
  }
}

function deleteParticipant(id: number) {
  participants.value =
    participants.value.filter(
      participant => participant.id !== id
    )

  winners.value = winners.value.filter(
    winner => winner.id !== id
  )
}

function addWinner() {
  const availableParticipants =
    participants.value.filter(
      participant =>
        !winners.value.some(
          winner => winner.id === participant.id
        )
    )

  if (
    availableParticipants.length === 0 ||
    winners.value.length >= 3
  ) {
    return
  }

  const randomIndex = Math.floor(
    Math.random() *
      availableParticipants.length
  )

  winners.value.push(
    availableParticipants[randomIndex]
  )
}

function removeWinner(id: number) {
  winners.value = winners.value.filter(
    winner => winner.id !== id
  )
}
</script>

<template>
  <main class="lottery-page">
    <div class="container py-4 py-lg-5">
      <header class="lottery-header text-center mb-4">
        <h1 class="display-5 fw-bold">
          Vue Lottery
        </h1>

        <p class="text-secondary">
          Register participants and choose random winners
        </p>
      </header>

      <div class="lottery-layout">
        <WinnersBlock
          :participants="participants"
          :winners="winners"
          @new-winner="addWinner"
          @remove-winner="removeWinner"
        />

        <div class="lottery-main-grid">
          <RegistrationForm
             :participants="participants"
             @save="addParticipant"
          />

          <ParticipantsTable
            :participants="participants"
            @update="updateParticipant"
            @delete="deleteParticipant"
          />
        </div>
      </div>
    </div>
  </main>
</template>
