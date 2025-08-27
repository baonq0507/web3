import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { User } from '../types/user'
import authApi from '../api/auth'
import { AuthStorage } from '../utils/authStorage'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const requiresTwoFactor = ref(false)
  const isInitialized = ref(false)
  const rememberMe = ref(false)
  const tokenExpiryTime = ref<number | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userRole = computed(() => user.value?.role)
  const canAccess = computed(() => (roles: string[]) => {
    if (!user.value) return false
    return roles.includes(user.value.role)
  })

  // Auto-refresh token before expiry
  let refreshTimer: number | null = null

  const scheduleTokenRefresh = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
    }

    if (tokenExpiryTime.value && accessToken.value) {
      const timeUntilExpiry = tokenExpiryTime.value - Date.now()
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0) // Refresh 5 minutes before expiry
      
      refreshTimer = setTimeout(async () => {
        try {
          await refreshAccessToken()
        } catch (error) {
          console.error('Auto-refresh failed:', error)
          logout()
        }
      }, refreshTime)
    }
  }

  const clearRefreshTimer = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }

  // Watch for token changes to schedule refresh
  watch([accessToken, tokenExpiryTime], () => {
    if (accessToken.value && tokenExpiryTime.value) {
      scheduleTokenRefresh()
    } else {
      clearRefreshTimer()
    }
  })

  // Actions
  const login = async (email: string, password: string, twoFactorCode?: string, remember?: boolean) => {
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
      rememberMe.value = remember || false

      // Calculate token expiry time (assuming expiresIn is in seconds)
      tokenExpiryTime.value = Date.now() + (response.expiresIn * 1000)

      // Store data using AuthStorage utility
      AuthStorage.saveAuthData({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userData: response.user,
        tokenExpiry: tokenExpiryTime.value,
        rememberMe: remember || false,
      })

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

      // Calculate token expiry time
      tokenExpiryTime.value = Date.now() + (response.expiresIn * 1000)

      // Store using AuthStorage utility
      AuthStorage.saveAuthData({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userData: response.user,
        tokenExpiry: tokenExpiryTime.value,
        rememberMe: rememberMe.value,
      })

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
      tokenExpiryTime.value = Date.now() + (response.expiresIn * 1000)

      // Update storage using AuthStorage utility
      AuthStorage.updateTokens(response.accessToken, response.refreshToken, response.expiresIn)

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
      isInitialized.value = false
      rememberMe.value = false
      tokenExpiryTime.value = null

      // Clear timers
      clearRefreshTimer()

      // Clear storage using AuthStorage utility
      AuthStorage.clearAuthData()
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
    try {
      // Get stored auth data using AuthStorage utility
      const storedData = AuthStorage.getAuthData()

      if (storedData) {
        // Check if token is expired
        const isExpired = Date.now() >= storedData.tokenExpiry

        if (isExpired) {
          // Token expired, try to refresh
          accessToken.value = storedData.accessToken
          refreshToken.value = storedData.refreshToken
          rememberMe.value = storedData.rememberMe
          
          const refreshed = await refreshAccessToken()
          if (!refreshed) {
            logout()
            isInitialized.value = true
            return
          }
        } else {
          // Token still valid
          accessToken.value = storedData.accessToken
          refreshToken.value = storedData.refreshToken
          user.value = storedData.userData
          rememberMe.value = storedData.rememberMe
          tokenExpiryTime.value = storedData.tokenExpiry
        }

        // Verify user profile is still valid
        try {
          await getProfile()
        } catch (error) {
          // If profile fetch fails, try to refresh token
          if (!(await refreshAccessToken())) {
            logout()
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      logout()
    } finally {
      isInitialized.value = true
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
    isInitialized,
    rememberMe,
    tokenExpiryTime,
    
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
