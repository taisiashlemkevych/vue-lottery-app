
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '@/shared/api'
import { AuthService } from '../api/auth.service'
import type {
  AuthResponse,
  LoginCredentials,
} from './types'

export const useSessionStore = defineStore(
  'session',
  () => {
    const user = ref<Partial<AuthResponse> | null>(null)
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    const authService = ServiceProvider.get<AuthService>('auth')

    function setSession(token: string) {
      accessToken.value = token
      localStorage.setItem('access_token', token)
    }

    function clearSession() {
      user.value = null
      accessToken.value = null
      refreshToken.value = null

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }

    async function login(credentials: LoginCredentials) {
      const data = await authService.login(credentials)

      user.value = data
      setSession(data.accessToken)

      refreshToken.value = data.refreshToken
      localStorage.setItem('refresh_token', data.refreshToken)
    }

    function logout() {
      clearSession()
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
        clearSession()
      }
    }

    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      setSession,
      clearSession,
      login,
      logout,
      fetchCurrentUser,
      initAuth,
    }
  },
  {
    persist: {
      key: 'session',
      pick: ['user', 'accessToken', 'refreshToken'],
    },
  },
)
