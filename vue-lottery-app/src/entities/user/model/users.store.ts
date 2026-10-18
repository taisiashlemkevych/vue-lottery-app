import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ServiceProvider } from '@/shared/api/service-provider'
import { UserService } from '@/entities/user/api/user.service'
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
} from '@/entities/user/model/types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const userService = ServiceProvider.get<UserService>('users')

  async function fetchUsers(params?: {
    limit?: number
    skip?: number
    q?: string
  }) {
    loading.value = true
    error.value = null

    try {
      const result = await userService.getAll(params)
      users.value = result.items
      total.value = result.total
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не вдалося завантажити користувачів'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(id: number) {
    loading.value = true
    error.value = null

    try {
      currentUser.value = await userService.getById(id)
      return currentUser.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не вдалося завантажити користувача'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createUser(data: CreateUserDto) {
    const createdUser = await userService.create(data)
    users.value.push(createdUser)
    total.value += 1
    return createdUser
  }

  async function updateUser(id: number, data: UpdateUserDto) {
    const updatedUser = await userService.update(id, data)
    const index = users.value.findIndex(user => user.id === id)

    if (index !== -1) {
      users.value[index] = updatedUser
    }

    if (currentUser.value?.id === id) {
      currentUser.value = updatedUser
    }

    return updatedUser
  }

  async function removeUser(id: number) {
    await userService.delete(id)
    users.value = users.value.filter(user => user.id !== id)
    total.value = Math.max(0, total.value - 1)

    if (currentUser.value?.id === id) {
      currentUser.value = null
    }
  }

  return {
    users,
    currentUser,
    total,
    loading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    removeUser,
  }
})
