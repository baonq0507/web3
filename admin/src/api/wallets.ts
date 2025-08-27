import { apiClient } from './client';

export interface CreateWalletDto {
  address: string;
  currency: string;
  balance?: number;
  type?: 'hot' | 'cold';
  label?: string;
  description?: string;
}

export interface UpdateWalletDto {
  address?: string;
  currency?: string;
  balance?: number;
  type?: 'hot' | 'cold';
  label?: string;
  description?: string;
  isActive?: boolean;
}

export interface Wallet {
  _id: string;
  userId: {
    _id: string;
    email: string;
    username: string;
  };
  address: string;
  currency: string;
  balance: number;
  lockedBalance: number;
  isActive: boolean;
  type: string;
  label?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const walletsApi = {
  // Get all wallets
  getAll: (userId?: string) => 
    apiClient.get<Wallet[]>('/wallets', { params: { userId } }),

  // Get wallet by ID
  getById: (id: string) => 
    apiClient.get<Wallet>(`/wallets/${id}`),

  // Create new wallet
  create: (data: CreateWalletDto) => 
    apiClient.post<Wallet>('/wallets', data),

  // Update wallet
  update: (id: string, data: UpdateWalletDto) => 
    apiClient.patch<Wallet>(`/wallets/${id}`, data),

  // Delete wallet
  delete: (id: string) => 
    apiClient.delete(`/wallets/${id}`),

  // Update wallet balance
  updateBalance: (id: string, amount: number, isLocked: boolean = false) => 
    apiClient.patch<Wallet>(`/wallets/${id}/balance`, { amount, isLocked }),
};

export default walletsApi;
