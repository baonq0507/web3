import { apiClient } from './client';

const walletsApi = {
  // Get user wallets
  getWallets: () => {
    return apiClient.get('/wallets');
  },

  // Create new wallet
  createWallet: (data: any) => {
    return apiClient.post('/wallets', data);
  },

  // Get wallet balance
  getBalance: (walletId: string) => {
    return apiClient.get(`/wallets/${walletId}/balance`);
  },

  // Get wallet transactions
  getTransactions: (walletId: string) => {
    return apiClient.get(`/wallets/${walletId}/transactions`);
  },
};

export default walletsApi;
