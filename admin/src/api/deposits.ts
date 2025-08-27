import { apiClient } from './client';

export interface CreateDepositDto {
  amount: number;
  currency: string;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  fee?: number;
  blockNumber?: number;
  confirmations?: number;
}

export interface ReviewDepositDto {
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  rejectionReason?: string;
  notes?: string;
}

export interface Deposit {
  _id: string;
  userId: {
    _id: string;
    email: string;
    username: string;
  };
  amount: number;
  currency: string;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  blockNumber?: number;
  confirmations?: number;
  rejectionReason?: string;
  reviewedBy?: {
    _id: string;
    email: string;
    username: string;
  };
  reviewedAt?: string;
  notes?: string;
  fee: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
}

const depositsApi = {
  // Get all deposits
  getAll: (status?: string, userId?: string) => 
    apiClient.get<Deposit[]>('/deposits', { params: { status, userId } }),

  // Get deposit stats
  getStats: () => 
    apiClient.get('/deposits/stats'),

  // Get deposit by ID
  getById: (id: string) => 
    apiClient.get<Deposit>(`/deposits/${id}`),

  // Get my deposits
  getMy: () => 
    apiClient.get<Deposit[]>('/deposits/my'),

  // Create new deposit
  create: (data: CreateDepositDto) => 
    apiClient.post<Deposit>('/deposits', data),

  // Review deposit
  review: (id: string, data: ReviewDepositDto) => 
    apiClient.patch<Deposit>(`/deposits/${id}/review`, data),

  // Delete deposit
  delete: (id: string) => 
    apiClient.delete(`/deposits/${id}`),
};

export default depositsApi;
