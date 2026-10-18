import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '@/shared/api/service-provider'
import { AuthService } from '@/entities/session/api/auth.service'
import type {
  AuthResponse,
  LoginCredentials,
} from '@/entities/session/model/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<Partial<AuthResponse> | null>(null)
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)
    const authService = ServiceProvider.get<AuthService>('auth')

    async function login(credentials: LoginCredentials) {
      const data = await authService.login(credentials)

      user.value = data
      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken
    }

    function logout() {
      user.value = null
      accessToken.value = null
      refreshToken.value = null
    }

    async function fetchCurrentUser() {
      const currentUser = await authService.me()

      user.value = {
        ...user.value,
        ...currentUser,
      }

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
  },
  {
    persist: {
      key: 'auth',
      pick: ['user', 'accessToken', 'refreshToken'],
    },
  },
)