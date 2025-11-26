import { api } from './axiosConfig';
import { CreditRequestDTO, CreditRequest } from '../../ types/credit';

export const creditService = {
    createCreditRequest: async (creditData: CreditRequestDTO): Promise<CreditRequest> => {
        const response = await api.post<CreditRequest>('/credit/request', creditData);
        return response.data;
    },

    getUserCreditRequests: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/my-requests');
        return response.data;
    },

    getAllCreditRequests: async (): Promise<CreditRequest[]> => {
        const response = await api.get<CreditRequest[]>('/credit/requests');
        return response.data;
    },

    updateCreditStatus: async (id: number, status: string): Promise<CreditRequest> => {
        const response = await api.put<CreditRequest>(`/credit/${id}/status?status=${status}`);
        return response.data;
    }
};