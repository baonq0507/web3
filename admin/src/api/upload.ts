import { apiClient } from './client';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    filename: string;
  };
}

export const uploadApi = {
  // Upload ảnh
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};
