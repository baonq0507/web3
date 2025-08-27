import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api';

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

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || '');
  const isAdmin = computed(() => ['SUPERADMIN', 'ADMIN'].includes(user.value?.role || ''));

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await authApi.login({ email, password });
      token.value = response.access_token;
      user.value = response.user;
      
      // Store token in localStorage
      localStorage.setItem('token', response.access_token);
      
      return response;
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    loading.value = true;
    try {
      const response = await authApi.register(data);
      return response;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  };

  const fetchProfile = async () => {
    if (!token.value) return;
    
    loading.value = true;
    try {
      const response = await authApi.getProfile();
      user.value = response;
      return response;
    } catch (error) {
      // If token is invalid, logout
      logout();
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    loading.value = true;
    try {
      const response = await authApi.updateProfile(data);
      user.value = { ...user.value, ...response };
      return response;
    } finally {
      loading.value = false;
    }
  };

  // Initialize user profile if token exists
  const initializeAuth = async () => {
    if (token.value) {
      try {
        await fetchProfile();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        logout();
      }
    }
  };

  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    initializeAuth,
  };
});
