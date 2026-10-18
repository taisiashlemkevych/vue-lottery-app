const BASE_URL = import.meta.env.VITE_API_URL

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (response.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken, expiresInMins: 30 })
        })
        
        if (!refreshRes.ok) throw new Error('Refresh failed')
        
        const refreshData = await refreshRes.json()
        localStorage.setItem('access_token', refreshData.accessToken)
        localStorage.setItem('refresh_token', refreshData.refreshToken)
        
        headers = { ...headers, Authorization: `Bearer ${refreshData.accessToken}` }
        response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
        
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Session expired')
      }
    } else {
      window.location.href = '/login'
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
