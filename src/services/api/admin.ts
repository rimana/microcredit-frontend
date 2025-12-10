import { api } from './axiosConfig';
import { AdminStats, UserManagement, CreditDetails, SystemSettings, MonthlyStats } from '../../ types/admin';

// Service API pour les fonctionnalités admin
export const adminAPI = {
  // Statistiques
  getOverviewStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats/overview');
    return response.data;
  },

  getMonthlyStats: async (months: number = 12): Promise<MonthlyStats[]> => {
    const response = await api.get(`/admin/stats/monthly?months=${months}`);
    return response.data;
  },

  // Gestion des utilisateurs
  getAllUsers: async (): Promise<UserManagement[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUsersPaginated: async (page: number = 0, size: number = 10) => {
    const response = await api.get(`/admin/users/paginated?page=${page}&size=${size}`);
    return response.data;
  },

  getUsersByRole: async (role: 'CLIENT' | 'AGENT' | 'ADMIN'): Promise<UserManagement[]> => {
    const response = await api.get(`/admin/users/by-role/${role}`);
    return response.data;
  },

  updateUserRole: async (userId: number, role: string) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Gestion des crédits
  getAllCredits: async (): Promise<CreditDetails[]> => {
    const response = await api.get('/admin/credits/all');
    return response.data;
  },

  getCreditsPaginated: async (page: number = 0, size: number = 10) => {
    const response = await api.get(`/admin/credits/paginated?page=${page}&size=${size}`);
    return response.data;
  },

  getCreditsByStatus: async (status: string) => {
    const response = await api.get(`/admin/credits/by-status/${status}`);
    return response.data;
  },

  getPendingCredits: async () => {
    const response = await api.get('/admin/credits/pending');
    return response.data;
  },

  approveCredit: async (creditId: number) => {
    const response = await api.put(`/admin/credits/${creditId}/approve`);
    return response.data;
  },

  rejectCredit: async (creditId: number, reason?: string) => {
    const response = await api.put(`/admin/credits/${creditId}/reject`, { reason });
    return response.data;
  },

  // Paramètres système
  getSystemSettings: async (): Promise<SystemSettings> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings: Partial<SystemSettings>) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  updateInterestRate: async (interestRate: number) => {
    const response = await api.put('/admin/settings/interest-rate', { interestRate });
    return response.data;
  },

  updateMaxAmount: async (maxAmount: number) => {
    const response = await api.put('/admin/settings/max-amount', { maxAmount });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/admin/health');
    return response.data;
  }
};

export default adminAPI;