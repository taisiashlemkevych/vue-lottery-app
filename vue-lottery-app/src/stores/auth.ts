import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthResponse, LoginCredentials } from '@/types/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Partial<AuthResponse> | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const router = useRouter()

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
    router.push('/login')
  }

  return { user, accessToken, refreshToken, isAuthenticated, login, logout }
})
