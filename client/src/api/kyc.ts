import { apiClient } from './client';

const kycApi = {
  // Submit KYC application
  submitKYC: (data: any) => {
    return apiClient.post('/kyc/submit', data);
  },

  // Get KYC status
  getKYCStatus: () => {
    return apiClient.get('/kyc/status');
  },

  // Get KYC requirements
  getKYCRequirements: () => {
    return apiClient.get('/kyc/requirements');
  },

  // Upload KYC documents
  uploadDocuments: (formData: FormData) => {
    return apiClient.post('/kyc/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default kycApi;
