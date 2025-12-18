import { api } from './axiosConfig';
import {
    CreditRequestDTO,
    CreditRequest,
    ScoringResponseDTO,
    CreditStats
} from '../../ types/credit';

export const creditService = {
    // === FONCTIONS CLIENT ===
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

    // === FONCTIONS AGENT ===
    getPendingCreditRequests: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/pending');
        return response.data;
    },

    analyzeCreditRequest: async (id: number): Promise<any> => {
        const response = await api.get<any>(`/agent/analyze/${id}`);
        return response.data;
    },

    reviewCreditRequest: async (id: number, decision: 'APPROVE' | 'REJECT', agentNotes?: string): Promise<any> => {
        const decisionDTO = {
            decisionType: decision,
            comments: agentNotes || '',
            riskAssessment: 'Analyse effectuée par l\'agent',
            suggestedAmount: null,
            suggestedDuration: null,
            conditions: []
        };
        const response = await api.post<any>(`/agent/decision/${id}`, decisionDTO);
        return response.data;
    },

    // === FONCTION ADMIN : Récupère TOUS les crédits (résout l'erreur 403) ===
    getAllCreditRequests: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/requests');
        return response.data;
    },

    getCreditStatistics: async (): Promise<CreditStats> => {
        const response = await api.get<CreditStats>('/credit/dashboard/statistics');
        return response.data;
    },

    // Tests ML (optionnel)
    testMLModel: async (testData: CreditRequestDTO): Promise<ScoringResponseDTO> => {
        const response = await api.post<ScoringResponseDTO>('/credit/dashboard/test-ml', testData);
        return response.data;
    },
};