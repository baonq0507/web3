import { apiClient } from './client';

const usersApi = {
  // Get user profile
  getProfile: () => {
    return apiClient.get('/users/profile');
  },

  // Update user profile
  updateProfile: (data: any) => {
    return apiClient.put('/users/profile', data);
  },

  // Change password
  changePassword: (data: any) => {
    return apiClient.post('/users/change-password', data);
  },

  // Get user statistics
  getStats: () => {
    return apiClient.get('/users/stats');
  },
};

export default usersApi;
