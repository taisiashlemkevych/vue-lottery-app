import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'app-theme'

function getSavedTheme(): ThemeMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark'
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<ThemeMode>(getSavedTheme())

  function applyTheme(value: ThemeMode) {
    theme.value = value

    document.documentElement.classList.toggle(
      'app-dark',
      value === 'dark',
    )

    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  applyTheme(theme.value)

  watch(theme, (value) => {
    document.documentElement.classList.toggle(
      'app-dark',
      value === 'dark',
    )
  })

  return {
    theme,
    toggleTheme,
    applyTheme,
  }
})
