import { api } from './axiosConfig';
import { LoginRequest, LoginResponse, SignupRequest } from '../../ types/auth';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/signin', credentials);
        return response.data;
    },

    register: async (userData: SignupRequest): Promise<string> => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getProfile: () => api.get('/auth/profile'),
};