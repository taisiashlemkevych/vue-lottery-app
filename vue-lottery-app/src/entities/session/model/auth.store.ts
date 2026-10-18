import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from "@/shared/api/service-provider";
import type { AuthResponse, LoginCredentials } from '@/entities/session/model/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Partial<AuthResponse> | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(credentials: LoginCredentials) {
    const data = await ServiceProvider.auth.login(credentials)

    user.value = data
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken

    localStorage.setItem('user', JSON.stringify(data))
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  async function fetchCurrentUser() {
    const currentUser = await ServiceProvider.auth.me()

    user.value = {
      ...user.value,
      ...currentUser,
    }

    localStorage.setItem('user', JSON.stringify(user.value))

    return currentUser
  }

  async function initAuth() {
    if (!accessToken.value) {
      return
    }

    try {
      await fetchCurrentUser()
    } catch (error) {
      console.error('Failed to restore session:', error)
      logout()
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    fetchCurrentUser,
    initAuth,
  }
})
