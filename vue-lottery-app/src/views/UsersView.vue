<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ServiceProvider } from '@/services/service-provider'
import type { User } from '@/types/user'
import type { Participant } from '@/types/participant.ts'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import WinnersBlock from '../components/WinnersBlock.vue'

defineOptions({
  name: 'UsersLotteryPage'
})

const route = useRoute()
const router = useRouter()

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const totalUsers = ref(0)
const limit = 10

const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref((route.query.q as string) || '')
let searchTimeout: ReturnType<typeof setTimeout>

const winnerIds = ref<number[]>([])
const STORAGE_KEY_WINNERS = 'lottery_winners'

onMounted(() => {
  const savedWinners = localStorage.getItem(STORAGE_KEY_WINNERS)
  if (savedWinners) {
    try {
      winnerIds.value = JSON.parse(savedWinners)
    } catch (e) {
      console.error(e)
    }
  }
  fetchUsers()
})

watch(winnerIds, (newVal) => {
  localStorage.setItem(STORAGE_KEY_WINNERS, JSON.stringify(newVal))
}, { deep: true })

const participantsForWinners = computed<Participant[]>(() => {
  return users.value.map(user => ({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    dob: '',
    phone: user.phone
  }))
})

const currentWinners = computed<Participant[]>(() => {
  return winnerIds.value
    .map(id => {
      const user = users.value.find(u => u.id === id)
      if (!user) return undefined
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        dob: '',
        phone: user.phone
      }
    })
    .filter((p): p is Participant => p !== undefined)
})

const handleAddWinner = (winner: Participant) => {
  if (!winnerIds.value.includes(winner.id)) {
    winnerIds.value.push(winner.id)
  }
}

const handleRemoveWinner = (winnerId: number) => {
  winnerIds.value = winnerIds.value.filter(id => id !== winnerId)
}

const fetchUsers = async () => {
  isLoading.value = true
  error.value = null

  try {
    const skip = (currentPage.value - 1) * limit
    const response = await ServiceProvider.users.getAll({
      limit,
      skip,
      q: searchQuery.value
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    if (Array.isArray(response)) {
      users.value = response
      totalUsers.value = response.length
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      users.value = (response as any).users || (response as any).items || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalUsers.value = (response as any).total || users.value.length
    }
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    isLoading.value = false
  }
}

const handleUserSaved = (savedUser: User, isNew: boolean) => {
  if (isNew) {
    users.value.unshift(savedUser)
    totalUsers.value++
  } else {
    const index = users.value.findIndex(u => u.id === savedUser.id)
    if (index !== -1) {
      users.value[index] = savedUser
    }
  }
}

const deleteUser = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) return

  try {
    await ServiceProvider.users.delete(id)
    users.value = users.value.filter(u => u.id !== id)
    totalUsers.value--
    winnerIds.value = winnerIds.value.filter(winnerId => winnerId !== id)
  } catch {
    alert('Помилка видалення')
  }
}

const updateUrl = () => {
  router.push({
    path: route.path,
    query: {
      page: currentPage.value > 1 ? currentPage.value : undefined,
      q: searchQuery.value || undefined
    }
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
  clearTimeout(searchTimeout)
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
      fetchUsers()
    }
  }
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
      <RouterView @user-saved="handleUserSaved" />
    </div>
  </main>
</template>
