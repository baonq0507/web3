import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  role: string;
  status: string;
}

export interface UpdateUserRequest {
  email?: string;
  username?: string;
  role?: string;
  status?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

const usersApi = {
  // Lấy danh sách users
  getUsers: async (params?: UserQueryParams): Promise<UsersResponse> => {
    console.log('params', params);
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  // Lấy thông tin user theo ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Tạo user mới
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Xóa user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Thay đổi trạng thái user
  changeUserStatus: async (id: string, status: string): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  async resetPassword(userId: string, newPassword: string, reason?: string): Promise<{ newPassword: string; user: any }> {
    const response = await apiClient.post(`/users/${userId}/reset-password`, {
      newPassword,
      reason
    });
    return response.data;
  }
};

export default usersApi;
