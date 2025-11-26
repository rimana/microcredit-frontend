import React, { useState } from 'react';
import { useUniversalOcr } from '../../hooks/useUniversalOcr';
import './OcrScanner.css';

interface OcrScannerProps {
    onDataExtracted?: (data: any) => void;
}

const OcrScanner: React.FC<OcrScannerProps> = ({ onDataExtracted }) => {
    const { scanIdCard, loading, result, error } = useUniversalOcr();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        // Appeler le scan automatique
        const response = await scanIdCard(file);

        if (response.success && onDataExtracted) {
            // ✅ CORRIGÉ: Passer les données directement sans .data
            onDataExtracted({
                fullName: response.fullName,
                address: response.address,
                cin: response.cin,
                birthDate: response.birthDate,
                birthPlace: response.birthPlace
            });
        }
    };

    return (
        <div className="ocr-scanner">
            <h4>📇 Scanner Carte Nationale (OCR Local)</h4>

            <div className="upload-section">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                />

                <p className="upload-hint">
                    📸 Prenez une photo claire du recto de votre carte nationale
                </p>

                {selectedFile && (
                    <div className="file-info">
                        <strong>Fichier sélectionné:</strong> {selectedFile.name}
                    </div>
                )}
            </div>

            {loading && (
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>🔍 Lecture de la carte en cours...</p>
                </div>
            )}

            {error && (
                <div className="error-section">
                    <p>❌ {error}</p>
                </div>
            )}

            {result && result.success && (
                <div className="result-section">
                    <div className="success-header">
                        <h5>✅ Carte nationale lue avec succès !</h5>
                    </div>

                    <div className="extracted-data">
                        {/* ✅ CORRIGÉ: Accès direct sans .data */}
                        {result.cin && (
                            <div className="data-item">
                                <span className="label">CIN:</span>
                                <span className="value">{result.cin}</span>
                            </div>
                        )}

                        {result.fullName && (
                            <div className="data-item">
                                <span className="label">Nom Complet:</span>
                                <span className="value">{result.fullName}</span>
                            </div>
                        )}

                        {result.birthDate && (
                            <div className="data-item">
                                <span className="label">Date Naissance:</span>
                                <span className="value">{result.birthDate}</span>
                            </div>
                        )}

                        {result.birthPlace && (
                            <div className="data-item">
                                <span className="label">Lieu Naissance:</span>
                                <span className="value">{result.birthPlace}</span>
                            </div>
                        )}

                        {result.address && (
                            <div className="data-item">
                                <span className="label">Adresse:</span>
                                <span className="value">{result.address}</span>
                            </div>
                        )}
                    </div>

                    {/* ✅ SUPPRIMÉ: Les statistiques n'existent plus dans l'interface */}

                    {/* ✅ SUPPRIMÉ: Le mode simulation n'existe plus */}
                </div>
            )}

            {result && !result.success && result.errorMessage && (
                <div className="error-section">
                    <p>⚠️ {result.errorMessage}</p>
                </div>
            )}
        </div>
    );
};

export default OcrScanner;