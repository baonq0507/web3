import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/admin/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const authStore = useAuthStore()
      
      try {
        const refreshed = await authStore.refreshAccessToken()
        if (refreshed) {
          // Retry the original request with new token
          const retryResponse = await apiClient(originalRequest)
          return retryResponse
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authStore.logout()
        return Promise.reject(refreshError)
      }
    }
    
    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Access forbidden')
    } else if (error.response?.status === 500) {
      console.error('Internal server error')
    }
    
    return Promise.reject(error)
  }
)

export { apiClient }
