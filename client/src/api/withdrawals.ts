import { apiClient } from './client';

const withdrawalsApi = {
  // Get withdrawal history
  getWithdrawals: (params?: any) => {
    return apiClient.get('/withdrawals', { params });
  },

  // Create new withdrawal
  createWithdrawal: (data: any) => {
    return apiClient.post('/withdrawals', data);
  },

  // Cancel withdrawal
  cancelWithdrawal: (withdrawalId: string) => {
    return apiClient.post(`/withdrawals/${withdrawalId}/cancel`);
  },

  // Get withdrawal status
  getWithdrawalStatus: (withdrawalId: string) => {
    return apiClient.get(`/withdrawals/${withdrawalId}/status`);
  },

  // Get withdrawal fees
  getWithdrawalFees: (asset: string) => {
    return apiClient.get(`/withdrawals/fees/${asset}`);
  },
};

export default withdrawalsApi;
