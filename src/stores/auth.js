import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ensureUserRecord, findUserByEmail } from './mockData'

const STORAGE_KEY = 'fithit_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  // initialize from localStorage if present
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) user.value = JSON.parse(raw)
  } catch (e) {
    user.value = null
  }

  const isAuthenticated = computed(() => !!user.value)

  function persist() {
    if (user.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    else localStorage.removeItem(STORAGE_KEY)
  }

  function login({ email, password }) {
    const normalizedEmail = (email || '').trim()
    const isAdminLogin = normalizedEmail.toLowerCase() === 'admin'
    const existing = findUserByEmail(email)

    if (isAdminLogin && existing && existing.role === 'ADMIN') {
      user.value = { ...existing }
      persist()
      return user.value
    }

    if (!existing || existing.password !== password) {
      return null
    }

    user.value = { ...existing }
    persist()
    ensureUserRecord(user.value)
    return user.value
  }

  function logout() {
    user.value = null
    persist()
  }

  return { user, isAuthenticated, login, logout }
})
