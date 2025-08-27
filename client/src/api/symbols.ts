import { apiClient } from './index';

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

export const symbolsApi = {
  // Lấy danh sách symbols đang hoạt động
  getActiveSymbols: (): Promise<Symbol[]> => {
    return apiClient.get('/symbols/active');
  },

  // Lấy symbol theo ID
  getSymbol: (id: string): Promise<Symbol> => {
    return apiClient.get(`/symbols/${id}`);
  },
};
