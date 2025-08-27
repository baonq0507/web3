import { apiClient } from './client'

export interface LoginRequest {
  email: string
  password: string
  twoFactorCode?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    role: string
    status: string
    kycStatus: string
    twoFactorEnabled: boolean
    lastLoginAt?: string
    createdAt: string
  }
  requiresTwoFactor: boolean
  message: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  message: string
}

export interface TwoFactorRequest {
  code: string
}

const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', data)
    return response.data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data;
  },

  async verifyTwoFactor(code: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/2fa/verify', { code })
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getProfile(): Promise<any> {
    const response = await apiClient.get('/auth/profile')
    return response.data;
  },

  async enableTwoFactor(userId: string): Promise<void> {
    await apiClient.post('/auth/2fa/enable', { userId })
  },

  async disableTwoFactor(userId: string): Promise<void> {
    await apiClient.post('/auth/2fa/disable', { userId })
  },
}

export default authApi;
