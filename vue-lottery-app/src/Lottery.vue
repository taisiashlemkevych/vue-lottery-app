<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import WinnersBlock from './components/WinnersBlock.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import SearchBar from './components/SearchBar.vue'
import AppModal from './components/ui/AppModal.vue'
import EditParticipantForm from './components/EditParticipantForm.vue'
import AppButton from './components/ui/AppButton.vue'
import type { Participant } from './types/participant.ts'

defineOptions({
  name: 'LotteryPage'
})

const participants = ref<Participant[]>([])
const winnerIds = ref<number[]>([])

const STORAGE_KEY_USERS = 'lottery_participants'
const STORAGE_KEY_WINNERS = 'lottery_winners'

onMounted(() => {
  const savedUsers = localStorage.getItem(STORAGE_KEY_USERS)
  if (savedUsers) participants.value = JSON.parse(savedUsers)

  const savedWinners = localStorage.getItem(STORAGE_KEY_WINNERS)
  if (savedWinners) winnerIds.value = JSON.parse(savedWinners)
})

watch(participants, (newVal) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newVal))
}, { deep: true })

watch(winnerIds, (newVal) => {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(newVal))
}, { deep: true })

const currentWinners = computed(() => {
  return winnerIds.value
    .map(id => participants.value.find(p => p.id === id))
    .filter(p => p !== undefined) as Participant[]
})

const handleAddWinner = (winner: Participant) => {
  winnerIds.value.push(winner.id)
}

const handleRemoveWinner = (winnerId: number) => {
  winnerIds.value = winnerIds.value.filter(id => id !== winnerId)
}

const existingEmails = computed(() => participants.value.map(p => p.email))

const handleAddParticipant = (newParticipantData: Omit<Participant, 'id'>) => {
  participants.value.push({ ...newParticipantData, id: Date.now() })
}

const filterQuery = ref('')
const currentSortKey = ref<'name' | 'dob' | null>(null)
const currentSortOrder = ref<'asc' | 'desc'>('asc')

const handleFilter = (query: string) => { filterQuery.value = query }

const handleSort = (key: 'name' | 'dob') => {
  if (currentSortKey.value === key) {
    currentSortOrder.value = currentSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    currentSortKey.value = key
    currentSortOrder.value = 'asc'
  }
}

const processedParticipants = computed(() => {
  let result = [...participants.value]
  if (filterQuery.value) {
    const q = filterQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  if (currentSortKey.value) {
    result.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valA: any = a[currentSortKey.value!]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valB: any = b[currentSortKey.value!]
      if (currentSortKey.value === 'dob') {
        valA = new Date(valA).getTime(); valB = new Date(valB).getTime()
      } else {
        valA = valA.toLowerCase(); valB = valB.toLowerCase()
      }
      if (valA < valB) return currentSortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return currentSortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  return result
})

const isDeleteModalOpen = ref(false)
const participantToDelete = ref<Participant | null>(null)

const openDeleteModal = (participant: Participant) => {
  participantToDelete.value = participant
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (participantToDelete.value) {
    const idToDelete = participantToDelete.value.id
    participants.value = participants.value.filter(p => p.id !== idToDelete)
    winnerIds.value = winnerIds.value.filter(id => id !== idToDelete)
  }
  isDeleteModalOpen.value = false
  participantToDelete.value = null
}

const isEditModalOpen = ref(false)
const participantToEdit = ref<Participant | null>(null)

const openEditModal = (participant: Participant) => {
  participantToEdit.value = participant
  isEditModalOpen.value = true
}

const saveEdit = (updatedParticipant: Participant) => {
  const index = participants.value.findIndex(p => p.id === updatedParticipant.id)
  if (index !== -1) {
    participants.value[index] = updatedParticipant
  }
  isEditModalOpen.value = false
  participantToEdit.value = null
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 py-10 px-4">
    <div class="max-w-7xl mx-auto space-y-8">

      <h1 class="text-3xl font-bold text-center text-blue-700 mb-8">
        Vue Lottery App
      </h1>

      <WinnersBlock :participants="participants" :winners="currentWinners" @add-winner="handleAddWinner"
        @remove-winner="handleRemoveWinner" />

      <div class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.5fr] gap-6 items-start">

        <RegistrationForm :existing-emails="existingEmails" @add-participant="handleAddParticipant" />

        <div>
          <h2 class="text-xl font-bold text-slate-800 mb-4">
            Participants List
          </h2>

          <SearchBar @filter-by-name="handleFilter" />

          <ParticipantsTable :participants="processedParticipants" :sort-key="currentSortKey"
            :sort-order="currentSortOrder" @sort="handleSort" @edit="openEditModal" @delete="openDeleteModal" />
        </div>

      </div>
    </div>

    <AppModal :is-open="isDeleteModalOpen" title="Підтвердження видалення" @close="isDeleteModalOpen = false">
      <p v-if="participantToDelete" class="text-slate-600">
        Ви дійсно бажаєте видалити учасника
        <strong>{{ participantToDelete.name }}</strong>,
        {{ participantToDelete.email }}?
      </p>

      <template #footer>
        <AppButton variant="secondary" @click="isDeleteModalOpen = false">
          Ні
        </AppButton>

        <AppButton variant="danger" @click="confirmDelete">
          Так
        </AppButton>
      </template>
    </AppModal>

    <AppModal :is-open="isEditModalOpen" title="Редагувати дані" @close="isEditModalOpen = false">
      <EditParticipantForm v-if="participantToEdit" :participant="participantToEdit" :existing-emails="existingEmails"
        @save="saveEdit" />
    </AppModal>

  </main>
</template>
