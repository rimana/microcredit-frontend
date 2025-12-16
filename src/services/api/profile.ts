// services/api/profile.ts
import axios from 'axios';
import { UserProfile, UpdateProfileRequest } from '../../ types/user';
import { getToken } from '../storage/tokenService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const profileApi = {
    // Récupérer le profil utilisateur
    getProfile: async (): Promise<UserProfile> => {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Mettre à jour le profil utilisateur
    updateProfile: async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
        const token = getToken();
        const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
};