<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import type { Participant } from './types'
import { useUsersStore } from '@/entities/user'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import AppTable from '@/shared/ui/AppTable.vue'
import AppConfirmDialog from '@/shared/ui/AppConfirmDialog.vue'
import WinnersBlock from './WinnersBlock.vue'

defineOptions({
  name: 'UsersLotteryPage',
})

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const toast = useToast()

const { users, total: totalUsers, loading: isLoading, error } =
  storeToRefs(usersStore)

const { fetchUsers: fetchUsersFromStore, removeUser } = usersStore

const limit = 10
const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')
let searchTimeout: ReturnType<typeof setTimeout> | undefined

const winnerIds = ref<number[]>([])
const STORAGE_KEY_WINNERS = 'lottery_winners'

const showDeleteDialog = ref(false)
const selectedUserId = ref<number | null>(null)
const isDeleting = ref(false)

const tableColumns = [
  { field: 'id', header: 'ID' },
  { field: 'fullName', header: "Ім'я" },
  { field: 'email', header: 'Email' },
  { field: 'phone', header: 'Телефон' },
]

const tableUsers = computed(() =>
  users.value.map((user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  })),
)

const participantsForWinners = computed<Participant[]>(() =>
  users.value.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    dob: '',
    phone: user.phone,
  })),
)

const currentWinners = computed<Participant[]>(() =>
  winnerIds.value
    .map((id) => {
      const user = users.value.find((item) => item.id === id)

      if (!user) return undefined

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        dob: '',
        phone: user.phone,
      }
    })
    .filter(
      (participant): participant is Participant =>
        participant !== undefined,
    ),
)

const handleAddWinner = (winner: Participant) => {
  if (!winnerIds.value.includes(winner.id)) {
    winnerIds.value.push(winner.id)
  }
}

const handleRemoveWinner = (winnerId: number) => {
  winnerIds.value = winnerIds.value.filter((id) => id !== winnerId)
}

const loadUsers = async () => {
  const skip = (currentPage.value - 1) * limit

  try {
    await fetchUsersFromStore({
      limit,
      skip,
      q: searchQuery.value,
    })
  } catch {
  }
}

const requestDeleteUser = (id: number) => {
  selectedUserId.value = id
  showDeleteDialog.value = true
}

const confirmDeleteUser = async () => {
  const id = selectedUserId.value

  if (id === null) return

  isDeleting.value = true

  try {
    await removeUser(id)

    winnerIds.value = winnerIds.value.filter(
      (winnerId) => winnerId !== id,
    )

    showDeleteDialog.value = false
    selectedUserId.value = null

    toast.add({
      severity: 'success',
      summary: 'Успішно',
      detail: 'Користувача видалено',
      life: 3000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Помилка',
      detail: 'Не вдалося видалити користувача',
      life: 4000,
    })
  } finally {
    isDeleting.value = false
  }
}

const updateUrl = () => {
  router.push({
    path: route.path,
    query: {
      page: currentPage.value > 1 ? currentPage.value : undefined,
      q: searchQuery.value || undefined,
    },
  })
}

const nextPage = () => {
  if (currentPage.value * limit < totalUsers.value) {
    currentPage.value++
    updateUrl()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    updateUrl()
  }
}

const handleSearch = (newValue: string | number | undefined) => {
  const value = String(newValue || '')

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    searchQuery.value = value
    currentPage.value = 1
    updateUrl()
  }, 500)
}

onMounted(() => {
  const savedWinners = localStorage.getItem(STORAGE_KEY_WINNERS)

  if (savedWinners) {
    try {
      winnerIds.value = JSON.parse(savedWinners)
    } catch (error) {
      console.error(error)
    }
  }

  loadUsers()
})

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

watch(
  winnerIds,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(newVal))
  },
  { deep: true },
)

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    if (
      newQuery.page !== oldQuery?.page ||
      newQuery.q !== oldQuery?.q
    ) {
      currentPage.value = Number(newQuery.page) || 1
      searchQuery.value = (newQuery.q as string) || ''
      loadUsers()
    }
  },
)
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-7xl space-y-8">
      <div
        class="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h1 class="text-center text-3xl font-bold text-blue-700">
          Vue Lottery App
        </h1>

        <RouterLink to="/users/create">
          <AppButton>+ Додати користувача</AppButton>
        </RouterLink>
      </div>

      <WinnersBlock
        :participants="participantsForWinners"
        :winners="currentWinners"
        @add-winner="handleAddWinner"
        @remove-winner="handleRemoveWinner"
      />

      <div
        class="rounded-2xl border border-[#e1ebf8] bg-[#f5f9ff] p-6 md:p-8"
      >
        <div class="mb-6 w-full max-w-md">
          <AppInput
            :model-value="searchQuery"
            placeholder="Знайти користувача..."
            @update:model-value="handleSearch"
          />
        </div>

        <div
          v-if="isLoading"
          class="rounded-xl bg-white py-12 text-center text-slate-500"
        >
          Завантаження...
        </div>

        <div
          v-else-if="error"
          class="rounded-xl bg-white py-8 text-center text-red-500"
        >
          {{ error }}
        </div>

        <AppTable
          v-else
          :value="tableUsers"
          :columns="tableColumns"
          :loading="isLoading"
          empty-message="Користувачів не знайдено"
        >
          <template #cell-id="{ data }">
            <span class="text-slate-400">
              #{{ data.id }}
            </span>
          </template>

          <template #cell-fullName="{ data }">
            <span class="font-medium text-slate-700">
              {{ data.fullName }}
            </span>
          </template>

          <template #actions="{ data }">
            <div
              class="flex items-center justify-end gap-3 whitespace-nowrap"
            >
              <RouterLink
                :to="`/users/${data.id}`"
                class="text-sky-600 hover:text-sky-800 hover:underline"
              >
                Деталі
              </RouterLink>

              <RouterLink
                :to="`/users/${data.id}/edit`"
                class="text-indigo-500 hover:text-indigo-700 hover:underline"
              >
                Редагувати
              </RouterLink>

              <AppButton
                variant="danger"
                @click="requestDeleteUser(Number(data.id))"
              >
                Видалити
              </AppButton>
            </div>
          </template>
        </AppTable>

        <div
          class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm text-slate-500">
            Усього користувачів:
            <span class="font-semibold text-slate-700">
              {{ totalUsers }}
            </span>
          </p>

          <div class="flex items-center gap-2">
            <AppButton
              variant="secondary"
              :disabled="currentPage === 1 || isLoading"
              @click="prevPage"
            >
              ← Назад
            </AppButton>

            <div
              class="min-w-10 rounded-lg bg-[#e3efff] px-4 py-2 text-center text-sm font-semibold text-sky-700"
            >
              {{ currentPage }}
            </div>

            <AppButton
              variant="secondary"
              :disabled="currentPage * limit >= totalUsers || isLoading"
              @click="nextPage"
            >
              Далі →
            </AppButton>
          </div>
        </div>
      </div>

      <AppConfirmDialog
        :is-open="showDeleteDialog"
        title="Підтвердження видалення"
        message="Ви впевнені, що хочете видалити цього користувача?"
        confirm-label="Видалити"
        :loading="isDeleting"
        @close="showDeleteDialog = false"
        @confirm="confirmDeleteUser"
      />

      <RouterView />
    </div>
  </main>
</template>
