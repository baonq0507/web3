import { apiClient } from './client';

export interface AuditLog {
  _id: string;
  userId?: {
    _id: string;
    email: string;
    username: string;
  };
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'approve' | 'reject' | 'transfer' | 'withdraw' | 'deposit';
  resource: 'user' | 'wallet' | 'kyc' | 'deposit' | 'withdrawal' | 'trade' | 'system';
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: any;
  newValues?: any;
  success: boolean;
  errorMessage?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const auditApi = {
  // Get all audit logs with filters
  getAll: (params?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => 
    apiClient.get<{
      logs: AuditLog[];
      total: number;
      page: number;
      totalPages: number;
    }>('/audit', { params }),

  // Get audit stats
  getStats: () => 
    apiClient.get('/audit/stats'),

  // Get my audit logs
  getMy: (limit?: number) => 
    apiClient.get<AuditLog[]>('/audit/my', { params: { limit } }),

  // Get audit log by ID
  getById: (id: string) => 
    apiClient.get<AuditLog>(`/audit/${id}`),
};

export default auditApi;
