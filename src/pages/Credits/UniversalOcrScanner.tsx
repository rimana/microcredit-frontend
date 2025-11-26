import React, { useState } from 'react';
import { useUniversalOcr } from '../../hooks/useUniversalOcr';
import './UniversalOcrScanner.css';

interface UniversalOcrScannerProps {
    onDataExtracted?: (data: any) => void;
}

const UniversalOcrScanner: React.FC<UniversalOcrScannerProps> = ({ onDataExtracted }) => {
    const { scanIdCard, loading, result, error } = useUniversalOcr();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        try {
            const ocrResult = await scanIdCard(file);

            if (ocrResult.success && onDataExtracted) {
                // ✅ CORRIGÉ: Passer les données directement
                onDataExtracted({
                    fullName: ocrResult.fullName,
                    address: ocrResult.address,
                    cin: ocrResult.cin,
                    birthDate: ocrResult.birthDate,
                    birthPlace: ocrResult.birthPlace
                });
            }
        } catch (err) {
            console.error('Erreur scan:', err);
        }
    };

    // Fonction pour formater les noms de champs
    const formatFieldName = (key: string): string => {
        const fieldNames: { [key: string]: string } = {
            fullName: '👤 Nom Complet',
            cin: '🔑 CIN',
            birthDate: '🎂 Date Naissance',
            birthPlace: '📍 Lieu Naissance',
            address: '🏠 Adresse'
        };
        return fieldNames[key] || key;
    };

    return (
        <div className="universal-ocr-scanner">
            <h4>🔍 Scanner OCR Universel</h4>

            <div className="upload-section">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                />
                <p className="hint">
                    📸 Uploader le recto de la carte d'identité pour analyse automatique
                </p>
            </div>

            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <span>Analyse en cours...</span>
                </div>
            )}

            {error && (
                <div className="error-state">
                    ❌ {error}
                </div>
            )}

            {result && result.success && (
                <div className="results-section">
                    <h5>✅ Scan Réussi</h5>

                    <div className="results-grid">
                        {/* ✅ CORRIGÉ: Itération directe sur les propriétés */}
                        {result.cin && (
                            <div className="result-item">
                                <strong>{formatFieldName('cin')}:</strong>
                                <span>{result.cin}</span>
                            </div>
                        )}
                        {result.fullName && (
                            <div className="result-item">
                                <strong>{formatFieldName('fullName')}:</strong>
                                <span>{result.fullName}</span>
                            </div>
                        )}
                        {result.birthDate && (
                            <div className="result-item">
                                <strong>{formatFieldName('birthDate')}:</strong>
                                <span>{result.birthDate}</span>
                            </div>
                        )}
                        {result.birthPlace && (
                            <div className="result-item">
                                <strong>{formatFieldName('birthPlace')}:</strong>
                                <span>{result.birthPlace}</span>
                            </div>
                        )}
                        {result.address && (
                            <div className="result-item full-width">
                                <strong>{formatFieldName('address')}:</strong>
                                <span>{result.address}</span>
                            </div>
                        )}
                    </div>

                    {/* ✅ SUPPRIMÉ: Les statistiques n'existent plus */}

                    {/* ✅ SUPPRIMÉ: Le mode simulation n'existe plus */}
                </div>
            )}

            {!selectedFile && (
                <div className="empty-state">
                    ⏳ En attente d'une image à analyser...
                </div>
            )}
        </div>
    );
};

export default UniversalOcrScanner;