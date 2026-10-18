<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { Participant } from '@/entities/participant/model/types'
import { useUsersStore } from '@/entities/user/model/users.store'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'
import WinnersBlock from '@/widgets/winners-block/ui/WinnersBlock.vue'

defineOptions({
  name: 'UsersLotteryPage',
})

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const { users, total: totalUsers, loading: isLoading, error } = storeToRefs(usersStore)
const { fetchUsers: fetchUsersFromStore, removeUser } = usersStore

const limit = 10
const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')
let searchTimeout: ReturnType<typeof setTimeout> | undefined

const winnerIds = ref<number[]>([])
const STORAGE_KEY_WINNERS = 'lottery_winners'

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

watch(
  winnerIds,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(newVal))
  },
  { deep: true },
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
    .filter((participant): participant is Participant => participant !== undefined),
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
    // Помилка зберігається у сховищі.
  }
}

const deleteUser = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) return

  try {
    await removeUser(id)
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  } catch {
    alert('Помилка видалення')
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

  if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    searchQuery.value = value
    currentPage.value = 1
    updateUrl()
  }, 500)
}

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    if (newQuery.page !== oldQuery?.page || newQuery.q !== oldQuery?.q) {
      currentPage.value = Number(newQuery.page) || 1
      searchQuery.value = (newQuery.q as string) || ''
      loadUsers()
    }
  },
)
</script>


<template>
  <main class="min-h-screen bg-slate-50 py-10 px-4">
    <div class="max-w-7xl mx-auto space-y-8">

      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
        <h1 class="text-3xl font-bold text-center text-blue-700">
          Vue Lottery App
        </h1>

        <RouterLink to="/users/create">
          <AppButton>+ Додати користувача</AppButton>
        </RouterLink>
      </div>

      <WinnersBlock :participants="participantsForWinners" :winners="currentWinners" @add-winner="handleAddWinner"
        @remove-winner="handleRemoveWinner" />

      <div class="bg-[#f5f9ff] p-6 md:p-8 rounded-2xl border border-[#e1ebf8]">
        <div class="mb-6 w-full max-w-md">
          <AppInput :model-value="searchQuery" @update:model-value="handleSearch" placeholder="Знайти користувача..." />
        </div>

        <div v-if="isLoading" class="text-center py-12 text-slate-500 bg-white rounded-xl">
          Завантаження...
        </div>

        <div v-else-if="error" class="text-center py-8 text-red-500 bg-white rounded-xl">
          {{ error }}
        </div>

        <div v-else class="overflow-x-auto bg-white rounded-xl border border-[#e3edf8]">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-[#eaf3ff] text-[#49698e]">
              <tr>
                <th class="px-4 py-4 font-semibold">ID</th>
                <th class="px-4 py-4 font-semibold">Ім'я</th>
                <th class="px-4 py-4 font-semibold">Email</th>
                <th class="px-4 py-4 font-semibold">Телефон</th>
                <th class="px-4 py-4 text-right font-semibold">Дії</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="users.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-slate-400">
                  Користувачів не знайдено
                </td>
              </tr>

              <tr v-for="user in users" :key="user.id"
                class="border-t border-slate-100 hover:bg-[#f7faff] transition-colors">
                <td class="px-4 py-4 text-slate-400">
                  #{{ user.id }}
                </td>

                <td class="px-4 py-4 font-medium text-slate-700">
                  {{ user.firstName }} {{ user.lastName }}
                </td>

                <td class="px-4 py-4">
                  {{ user.email }}
                </td>

                <td class="px-4 py-4">
                  {{ user.phone }}
                </td>

                <td class="px-4 py-4">
                  <div class="flex justify-end items-center gap-3 whitespace-nowrap">
                    <RouterLink :to="`/users/${user.id}`" class="text-sky-600 hover:text-sky-800 hover:underline">
                      Деталі
                    </RouterLink>

                    <RouterLink :to="`/users/${user.id}/edit`"
                      class="text-indigo-500 hover:text-indigo-700 hover:underline">
                      Редагувати
                    </RouterLink>

                    <button type="button" @click="deleteUser(user.id)"
                      class="text-rose-400 hover:text-rose-600 hover:underline">
                      Видалити
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <p class="text-sm text-slate-500">
            Усього користувачів:
            <span class="font-semibold text-slate-700">{{ totalUsers }}</span>
          </p>

          <div class="flex items-center gap-2">
            <AppButton variant="secondary" :disabled="currentPage === 1 || isLoading" @click="prevPage">
              ← Назад
            </AppButton>

            <div class="px-4 py-2 text-sm font-semibold text-sky-700 bg-[#e3efff] rounded-lg min-w-10 text-center">
              {{ currentPage }}
            </div>

            <AppButton variant="secondary" :disabled="currentPage * limit >= totalUsers || isLoading" @click="nextPage">
              Далі →
            </AppButton>
          </div>
        </div>
      </div>
      <RouterView />
    </div>
  </main>
</template>
