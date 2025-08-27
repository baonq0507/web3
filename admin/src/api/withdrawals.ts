import { apiClient } from './client';

export interface CreateWithdrawalDto {
  amount: number;
  currency: string;
  toAddress: string;
  fee?: number;
  notes?: string;
}

export interface ReviewWithdrawalDto {
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
  rejectionReason?: string;
  notes?: string;
  txHash?: string;
}

export interface Withdrawal {
  _id: string;
  userId: {
    _id: string;
    email: string;
    username: string;
  };
  amount: number;
  currency: string;
  toAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
  txHash?: string;
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
  processedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const withdrawalsApi = {
  // Get all withdrawals
  getAll: (status?: string, userId?: string) => 
    apiClient.get<Withdrawal[]>('/withdrawals', { params: { status, userId } }),

  // Get withdrawal stats
  getStats: () => 
    apiClient.get('/withdrawals/stats'),

  // Get withdrawal by ID
  getById: (id: string) => 
    apiClient.get<Withdrawal>(`/withdrawals/${id}`),

  // Get my withdrawals
  getMy: () => 
    apiClient.get<Withdrawal[]>('/withdrawals/my'),

  // Create new withdrawal
  create: (data: CreateWithdrawalDto) => 
    apiClient.post<Withdrawal>('/withdrawals', data),

  // Review withdrawal
  review: (id: string, data: ReviewWithdrawalDto) => 
    apiClient.patch<Withdrawal>(`/withdrawals/${id}/review`, data),

  // Delete withdrawal
  delete: (id: string) => 
    apiClient.delete(`/withdrawals/${id}`),
};

export default withdrawalsApi;
