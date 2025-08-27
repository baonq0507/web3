import { apiClient } from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    _id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const authApi = {
  // Login
  login: (data: LoginData) => 
    apiClient.post<LoginResponse>('/auth/login', data),

  // Register
  register: (data: RegisterData) => 
    apiClient.post<LoginResponse>('/auth/register', data),

  // Get profile
  getProfile: () => 
    apiClient.get<User>('/auth/profile'),

  // Update profile
  updateProfile: (data: Partial<User>) => 
    apiClient.patch<User>('/auth/profile', data),

  // Refresh token
  refreshToken: () => 
    apiClient.post<{ access_token: string }>('/auth/refresh'),

  // Logout
  logout: () => 
    apiClient.post('/auth/logout'),
};

export default authApi;
