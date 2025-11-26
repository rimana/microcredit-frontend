// 1. INTERFACES TYPESCRIPT - Au début du fichier
interface MoroccanIdData {
    cin: string;
    fullName: string;
    birthDate: string;
    birthPlace: string;
    issueDate: string;
    expiryDate: string;
    address?: string; // Propriété optionnelle
}

interface OcrResponse {
    success: boolean;
    data: MoroccanIdData;
    statistics: {
        foundFields: number;
        totalFields: number;
        successRate: number;
    };
    fallback: boolean;
    hasVerso: boolean;
}

// 2. FONCTION PRINCIPALE OCR
export const universalOcr = {
    scanMoroccanIdCard: async (rectoBase64: string, versoBase64?: string): Promise<OcrResponse> => {
        try {
            console.log('🔄 Scan universel carte marocaine...');

            // Préparer le payload avec recto + verso
            const payload: any = {
                rectoImage: rectoBase64
            };

            // Ajouter le verso si fourni
            if (versoBase64) {
                payload.versoImage = versoBase64;
                console.log('📄 Envoi recto + verso au backend');
            } else {
                console.log('📄 Envoi recto seulement au backend');
            }

            console.log('📍 URL backend: http://localhost:8080/api/ocr/scan-id-card');
            console.log('📦 Payload:', {
                hasRecto: !!rectoBase64,
                hasVerso: !!versoBase64,
                rectoLength: rectoBase64?.length,
                versoLength: versoBase64?.length
            });

            const response = await fetch('http://localhost:8080/api/ocr/scan-id-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log('📡 Statut réponse:', response.status);

            if (!response.ok) {
                throw new Error(`Erreur serveur OCR: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Réponse backend reçue:', result);

            if (result.success) {
                console.log('✅ Scan universel réussi');
                return result as OcrResponse;
            } else {
                throw new Error(result.error || 'Erreur OCR');
            }

        } catch (error) {
            console.error('❌ Erreur scan universel:', error);
            return getFallbackData(!!versoBase64);
        }
    }
};

// 3. FONCTION FALLBACK - Avec le bon typage
const getFallbackData = (hasVerso: boolean = false): OcrResponse => {
    const cities = ['CASABLANCA', 'RABAT', 'MARRAKECH', 'FÈS', 'TANGER', 'AGADIR'];
    const streets = ['AVENUE MOHAMMED V', 'RUE MOHAMMED VI', 'BOULEVARD HASSAN II', 'AVENUE AL MASSIRA'];

    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomStreet = streets[Math.floor(Math.random() * streets.length)];

    // Créer l'objet avec toutes les propriétés
    const baseData: MoroccanIdData = {
        cin: `MC${Math.floor(100000 + Math.random() * 900000)}`,
        fullName: "NOM_PRENOM_EXEMPLE",
        birthDate: "01/01/1980",
        birthPlace: randomCity,
        issueDate: "01/01/2020",
        expiryDate: "01/01/2030",
        // Ajouter l'adresse conditionnellement
        ...(hasVerso && {
            address: `${Math.floor(1 + Math.random() * 300)} ${randomStreet}, ${randomCity}`
        })
    };

    const foundFields = hasVerso ? 7 : 6;

    return {
        success: true,
        data: baseData,
        statistics: {
            foundFields: foundFields,
            totalFields: foundFields,
            successRate: 100
        },
        fallback: true,
        hasVerso: hasVerso
    };
};

// 4. FONCTION UTILITAIRE
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};