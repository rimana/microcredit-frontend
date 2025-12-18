// src/services/api/credit.ts
import { api } from './axiosConfig';
import {
    CreditRequestDTO,
    CreditRequest,
    ScoringResponseDTO,
    CreditReviewDTO,
    CreditStats
} from '../../ types/credit';

export const creditService = {
    // === FONCTIONS UTILISATEUR ===
    createCreditRequest: async (creditData: CreditRequestDTO): Promise<CreditRequest> => {
        const response = await api.post<CreditRequest>('/credit/request', creditData);
        return response.data;
    },

    simulateScoring: async (creditData: CreditRequestDTO): Promise<ScoringResponseDTO> => {
        const response = await api.post<ScoringResponseDTO>('/credit/simulate', creditData);
        return response.data;
    },

    getUserCreditRequests: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/my-requests');
        return response.data;
    },

    getCreditRequestById: async (id: number): Promise<CreditRequest> => {
        const response = await api.get<CreditRequest>(`/credit/${id}`);
        return response.data;
    },

    cancelCreditRequest: async (id: number): Promise<void> => {
        await api.put(`/credit/${id}/cancel`);
    },

    // === FONCTIONS AGENT ===
    getAllCreditRequests: async (filters?: {
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        minAmount?: number;
        maxAmount?: number;
        riskLevel?: string;
    }): Promise<CreditRequest[]> => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo) params.append('dateTo', filters.dateTo);
        if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString());
        if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
        if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);

        const url = `/credit/requests${params.toString() ? '?' + params.toString() : ''}`;
        const response = await api.get<CreditRequest[]>(url);
        return response.data;
    },

    getPendingCreditRequests: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/pending');
        return response.data;
    },

    getAssignedCreditRequests: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/assigned');
        return response.data;
    },

    assignCreditToMe: async (id: number): Promise<CreditRequest> => {
        const response = await api.put<CreditRequest>(`/credit/${id}/assign`);
        return response.data;
    },

    reviewCreditRequest: async (id: number, reviewData: CreditReviewDTO): Promise<CreditRequest> => {
        const response = await api.put<CreditRequest>(`/credit/${id}/review`, reviewData);
        return response.data;
    },

    updateCreditStatus: async (id: number, status: string, notes?: string): Promise<CreditRequest> => {
        const response = await api.put<CreditRequest>(`/credit/${id}/status`, {
            status,
            agentNotes: notes
        });
        return response.data;
    },

    addAgentNotes: async (id: number, notes: string): Promise<CreditRequest> => {
        const response = await api.put<CreditRequest>(`/credit/${id}/notes`, { notes });
        return response.data;
    },

    getCreditStatistics: async (): Promise<CreditStats> => {
        const response = await api.get<CreditStats>('/credit/statistics');
        return response.data;
    },

    getAgentDecisionHistory: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/agent/history');
        return response.data;
    },

    exportCreditData: async (filters?: {
        dateFrom?: string;
        dateTo?: string;
        format?: 'csv' | 'excel';
    }): Promise<Blob> => {
        const params = new URLSearchParams();
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo) params.append('dateTo', filters.dateTo);
        if (filters?.format) params.append('format', filters.format);

        const response = await api.get(`/credit/export${params.toString() ? '?' + params.toString() : ''}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // === FONCTIONS ADMIN ===
    reassignCredit: async (id: number, agentId: number): Promise<CreditRequest> => {
        const response = await api.put<CreditRequest>(`/credit/${id}/reassign`, { agentId });
        return response.data;
    },

    getCreditAuditLog: async (id: number): Promise<any[]> => {
        const response = await api.get<any[]>(`/credit/${id}/audit`);
        return response.data;
    },

    // === FONCTIONS DE TEST ML ===
    testMLModel: async (testData: CreditRequestDTO): Promise<ScoringResponseDTO> => {
        const response = await api.post<ScoringResponseDTO>('/ml/test', testData);
        return response.data;
    },

    getModelPerformance: async (): Promise<{
        accuracy: number;
        precision: number;
        recall: number;
        f1Score: number;
        lastTraining: string;
    }> => {
        const response = await api.get('/ml/performance');
        return response.data;
    },

    testBatchScoring: async (batchData: CreditRequestDTO[]): Promise<ScoringResponseDTO[]> => {
        const response = await api.post<ScoringResponseDTO[]>('/ml/test-batch', batchData);
        return response.data;
    }
};