import { useState } from 'react';
import { ocrApi, ScanResponse } from '../services/api/ocr';

export const useUniversalOcr = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScanResponse | null>(null);
    const [error, setError] = useState<string>('');

    const scanIdCard = async (file: File): Promise<ScanResponse> => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Convertir image en base64
            const base64 = await fileToBase64(file);

            // Appeler le service OCR
            const response = await ocrApi.scanIdCard(base64);

            setResult(response);

            if (!response.success) {
                setError(response.errorMessage || 'Erreur lors de la lecture de la carte');
            }

            return response;

        } catch (err: any) {
            const errorMsg = 'Erreur de connexion au service OCR local';
            setError(errorMsg);
            console.error('OCR Local Error:', err);

            // ✅ Retourner un objet ScanResponse CORRECT
            const errorResponse: ScanResponse = {
                success: false,
                errorMessage: errorMsg
            };

            return errorResponse;
        } finally {
            setLoading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const reset = () => {
        setLoading(false);
        setResult(null);
        setError('');
    };

    return {
        scanIdCard,
        loading,
        result,
        error,
        reset
    };
};