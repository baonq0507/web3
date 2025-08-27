import { apiClient } from './client';

const depositsApi = {
  // Get deposit history
  getDeposits: (params?: any) => {
    return apiClient.get('/deposits', { params });
  },

  // Create new deposit
  createDeposit: (data: any) => {
    return apiClient.post('/deposits', data);
  },

  // Get deposit address
  getDepositAddress: (asset: string) => {
    return apiClient.get(`/deposits/address/${asset}`);
  },

  // Get deposit status
  getDepositStatus: (depositId: string) => {
    return apiClient.get(`/deposits/${depositId}/status`);
  },
};

export default depositsApi;
