import { apiClient } from './client';

export interface CreateKycDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  documentType: string;
  documentNumber: string;
  documentFrontImage: string;
  documentBackImage: string;
  selfieImage: string;
  level?: 'level_1' | 'level_2' | 'level_3';
}

export interface UpdateKycDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  documentType?: string;
  documentNumber?: string;
  documentFrontImage?: string;
  documentBackImage?: string;
  selfieImage?: string;
  level?: 'level_1' | 'level_2' | 'level_3';
}

export interface ReviewKycDto {
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  rejectionReason?: string;
  notes?: string;
}

export interface Kyc {
  _id: string;
  userId: {
    _id: string;
    email: string;
    username: string;
  };
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  documentType: string;
  documentNumber: string;
  documentFrontImage: string;
  documentBackImage: string;
  selfieImage: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  level: 'level_1' | 'level_2' | 'level_3';
  rejectionReason?: string;
  reviewedBy?: {
    _id: string;
    email: string;
    username: string;
  };
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const kycApi = {
  // Get all KYC applications
  getAll: (status?: string, userId?: string) => 
    apiClient.get<Kyc[]>('/kyc', { params: { status, userId } }),

  // Get KYC stats
  getStats: () => 
    apiClient.get('/kyc/stats'),

  // Get KYC by ID
  getById: (id: string) => 
    apiClient.get<Kyc>(`/kyc/${id}`),

  // Get my KYC
  getMy: () => 
    apiClient.get<Kyc>('/kyc/my'),

  // Create new KYC
  create: (data: CreateKycDto) => 
    apiClient.post<Kyc>('/kyc', data),

  // Update KYC
  update: (id: string, data: UpdateKycDto) => 
    apiClient.patch<Kyc>(`/kyc/${id}`, data),

  // Review KYC
  review: (id: string, data: ReviewKycDto) => 
    apiClient.patch<Kyc>(`/kyc/${id}/review`, data),

  // Delete KYC
  delete: (id: string) => 
    apiClient.delete(`/kyc/${id}`),
};

export default kycApi;
