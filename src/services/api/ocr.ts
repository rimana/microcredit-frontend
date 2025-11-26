import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// ✅ INTERFACE UNIFIÉE pour toute l'application
export interface ScanResponse {
    success: boolean;
    fullName?: string;
    address?: string;
    cin?: string;
    birthDate?: string;
    birthPlace?: string;
    errorMessage?: string;
    // ❌ SUPPRIMER: message, data, statistics, simulation
}

export const ocrApi = {
    scanIdCard: async (base64Image: string): Promise<ScanResponse> => {
        try {
            const response = await axios.post<ScanResponse>(
                `${API_BASE_URL}/api/ocr/scan-cnie`,
                {
                    imageBase64: base64Image,
                    cardType: "CNIE"
                },
                {
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // ✅ Retourner directement la réponse (pas de transformation)
            return response.data;

        } catch (error: any) {
            console.error('❌ Erreur API OCR:', error);

            return {
                success: false,
                errorMessage: error.response?.data?.errorMessage ||
                    error.message ||
                    'Erreur de connexion au service OCR'
            };
        }
    }
};