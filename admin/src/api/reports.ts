import { apiClient } from './client';

export interface DashboardStats {
  users: {
    total: number;
  };
  wallets: {
    total: number;
  };
  kyc: {
    total: number;
    pending: number;
  };
  transactions: {
    deposits: {
      total: number;
      pending: number;
    };
    withdrawals: {
      total: number;
      pending: number;
    };
  };
}

export interface UserStats {
  total: number;
  newThisWeek: number;
  byRole: Record<string, number>;
}

export interface TransactionStats {
  deposits: {
    total: number;
    byStatus: Record<string, { count: number; amount: number }>;
  };
  withdrawals: {
    total: number;
    byStatus: Record<string, { count: number; amount: number }>;
  };
}

export interface KycStats {
  total: number;
  pending: number;
  byStatus: Record<string, number>;
}

const reportsApi = {
  // Get dashboard statistics
  getDashboardStats: () => 
    apiClient.get<DashboardStats>('/reports/dashboard'),

  // Get user statistics
  getUserStats: (startDate?: string, endDate?: string) => 
    apiClient.get<UserStats>('/reports/users', { params: { startDate, endDate } }),

  // Get transaction statistics
  getTransactionStats: (startDate?: string, endDate?: string) => 
    apiClient.get<TransactionStats>('/reports/transactions', { params: { startDate, endDate } }),

  // Get KYC statistics
  getKycStats: (startDate?: string, endDate?: string) => 
    apiClient.get<KycStats>('/reports/kyc', { params: { startDate, endDate } }),

  // Generate custom report
  generateReport: (type: string, startDate?: string, endDate?: string) => 
    apiClient.get(`/reports/${type}`, { params: { startDate, endDate } }),
};

export default reportsApi;
