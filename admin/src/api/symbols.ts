import { apiClient } from './client';

export interface Symbol {
  _id: string;
  name: string;
  image: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSymbolDto {
  name: string;
  image: string;
  code: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSymbolDto extends Partial<CreateSymbolDto> {}

export interface SymbolsResponse {
  data: Symbol[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const symbolsApi = {
  // Lấy danh sách symbols với phân trang và tìm kiếm
  getSymbols: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<SymbolsResponse> => {
    const response = await apiClient.get('/symbols', { params });
    return response.data;
  },

  // Lấy danh sách symbols đang hoạt động
  getActiveSymbols: (): Promise<Symbol[]> => {
    return apiClient.get('/symbols/active');
  },

  // Lấy symbol theo ID
  getSymbol: (id: string): Promise<Symbol> => {
    return apiClient.get(`/symbols/${id}`);
  },

  // Tạo symbol mới
  createSymbol: (data: CreateSymbolDto): Promise<Symbol> => {
    return apiClient.post('/symbols', data);
  },

  // Cập nhật symbol
  updateSymbol: (id: string, data: UpdateSymbolDto): Promise<Symbol> => {
    return apiClient.patch(`/symbols/${id}`, data);
  },

  // Xóa symbol
  deleteSymbol: (id: string): Promise<void> => {
    return apiClient.delete(`/symbols/${id}`);
  },
};
