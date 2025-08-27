import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import authApi from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const requiresTwoFactor = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userRole = computed(() => user.value?.role)
  const canAccess = computed(() => (roles: string[]) => {
    if (!user.value) return false
    return roles.includes(user.value.role)
  })

  // Actions
  const login = async (email: string, password: string, twoFactorCode?: string) => {
    try {
      isLoading.value = true
      
      const response = await authApi.login({
        email,
        password,
        twoFactorCode,
      })

      if (response.requiresTwoFactor && !twoFactorCode) {
        requiresTwoFactor.value = true
        return { requiresTwoFactor: true }
      }

      // Store tokens and user data
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      user.value = response.user as User
      requiresTwoFactor.value = false

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      return { success: true, user: response.user }
    } catch (error: any) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const verifyTwoFactor = async (code: string) => {
    try {
      isLoading.value = true
      
      const response = await authApi.verifyTwoFactor(code)
      
      // Store tokens and user data
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken
      user.value = response.user as User
      requiresTwoFactor.value = false

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      return { success: true, user: response.user }
    } catch (error: any) {
      console.error('2FA verification error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || '2FA verification failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const response = await authApi.refresh(refreshToken.value)
      
      accessToken.value = response.accessToken
      refreshToken.value = response.refreshToken

      // Update localStorage
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      return false
    }
  }

  const logout = async () => {
    try {
      if (accessToken.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear state
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      requiresTwoFactor.value = false

      // Clear localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const getProfile = async () => {
    try {
      const profile = await authApi.getProfile()
      user.value = profile
      return profile
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  const initializeAuth = async () => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedAccessToken && storedRefreshToken) {
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken
      
      try {
        await getProfile()
      } catch (error) {
        // If profile fetch fails, try to refresh token
        if (!(await refreshAccessToken())) {
          logout()
        }
      }
    }
  }

  const clearTwoFactorRequirement = () => {
    requiresTwoFactor.value = false
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    requiresTwoFactor,
    
    // Getters
    isAuthenticated,
    userRole,
    canAccess,
    
    // Actions
    login,
    verifyTwoFactor,
    refreshAccessToken,
    logout,
    getProfile,
    initializeAuth,
    clearTwoFactorRequirement,
  }
})
