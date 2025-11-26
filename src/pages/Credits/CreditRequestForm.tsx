import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useUniversalOcr } from '../../hooks/useUniversalOcr';
import './CreditForm.css';

const CreditRequestForm: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { scanIdCard, loading: ocrLoading, result: ocrResult, error: ocrError } = useUniversalOcr();

    const [formData, setFormData] = useState({
        fullname: user?.fullname || '',
        address: '',
        birthdate: '',
        employmentType: '',
        amount: '',
        duration: '12',
        purpose: ''
    });

    const [files, setFiles] = useState({
        photoIdentity: null as File | null,
        idCardRecto: null as File | null,
        idCardVerso: null as File | null,
        workCertificate: null as File | null,
        salaryCertificate: null as File | null,
        guarantorWorkCert: null as File | null,
        guarantorSalaryCert: null as File | null
    });

    const [submitLoading, setSubmitLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ✅ Gestion des fichiers CORRIGÉE
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFiles({
                ...files,
                [field]: file
            });

            if (field === 'idCardRecto') {
                try {
                    const result = await scanIdCard(file);

                    console.log('🔍 RESULTAT OCR:', result);

                    if (result.success) {
                        // ✅ ACCÈS DIRECT sans .data
                        setFormData(prev => ({
                            ...prev,
                            fullname: result.fullName || prev.fullname,
                            address: result.address || prev.address,
                            birthdate: result.birthDate ? convertToDateInput(result.birthDate) : prev.birthdate
                        }));

                        console.log('✅ Champs remplis automatiquement');
                    }
                } catch (error) {
                    console.error('Erreur OCR:', error);
                }
            }
        }
    };

    const convertToDateInput = (dateStr: string): string => {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        // Validation des fichiers requis
        if (!files.photoIdentity || !files.idCardRecto || !files.idCardVerso) {
            alert('Veuillez uploader tous les documents d\'identité requis');
            setSubmitLoading(false);
            return;
        }

        const isFunctionnaire = formData.employmentType === 'functionnaire';

        if (isFunctionnaire) {
            if (!files.workCertificate || !files.salaryCertificate) {
                alert('Veuillez uploader les documents professionnels requis');
                setSubmitLoading(false);
                return;
            }
        } else {
            if (!files.guarantorWorkCert || !files.guarantorSalaryCert) {
                alert('Veuillez uploader les documents du garant');
                setSubmitLoading(false);
                return;
            }
        }

        try {
            console.log('Données du formulaire:', formData);
            console.log('Fichiers:', files);

            alert('Votre demande de crédit a été soumise avec succès !\nElle sera traitée dans les plus brefs délais.');
            navigate('/dashboard');
        } catch (error) {
            alert('Une erreur est survenue lors de la soumission');
        } finally {
            setSubmitLoading(false);
        }
    };

    // ✅ FONCTION D'AFFICHAGE SÉCURISÉE
    const renderOcrResults = () => {
        if (!ocrResult) return null;

        // ✅ Vérifications SÉCURISÉES sans .data
        const hasValidData = ocrResult.fullName || ocrResult.address || ocrResult.cin;

        if (!hasValidData) return null;

        return (
            <div className="ocr-results">
                <h4>✅ Carte d'identité analysée avec succès !</h4>

                <div className="results-grid">
                    {ocrResult.cin && (
                        <div className="result-item">
                            <strong>🔑 CIN:</strong> {ocrResult.cin}
                        </div>
                    )}
                    {ocrResult.fullName && (
                        <div className="result-item">
                            <strong>👤 Nom:</strong> {ocrResult.fullName}
                        </div>
                    )}
                    {ocrResult.birthDate && (
                        <div className="result-item">
                            <strong>🎂 Date naissance:</strong> {ocrResult.birthDate}
                        </div>
                    )}
                    {ocrResult.address && (
                        <div className="result-item full-width">
                            <strong>🏠 Adresse:</strong> {ocrResult.address}
                        </div>
                    )}
                    {ocrResult.birthPlace && (
                        <div className="result-item">
                            <strong>📍 Lieu de naissance:</strong> {ocrResult.birthPlace}
                        </div>
                    )}
                </div>

                {ocrResult.errorMessage && (
                    <div className="ocr-error">
                        ⚠️ {ocrResult.errorMessage}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="credit-form-container">
            <div className="header">
                <div className="header-content">
                    <h1>MicroCredit Platform</h1>
                    <div className="user-menu">
                        <span>Bonjour, <strong>{user?.fullname}</strong></span>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    </div>
                </div>
            </div>

            <nav className="nav">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/credit-request" className="nav-link active">Demande de Crédit</Link>
                <Link to="/my-credits" className="nav-link">Mes Crédits</Link>
            </nav>

            <div className="form-wrapper">
                <h2>Nouvelle Demande de Crédit</h2>

                <form onSubmit={handleSubmit} className="credit-form">
                    {/* Section Informations Personnelles */}
                    <div className="form-section">
                        <h3 className="section-title">Informations Personnelles</h3>

                        <div className="file-upload-group">
                            {/* PHOTO D'IDENTITÉ */}
                            <div className="form-group">
                                <label>Photo d'Identité *</label>
                                <div className="file-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'photoIdentity')}
                                        required
                                    />
                                    <div className="file-upload-label">
                                        {files.photoIdentity ? '✓ Photo sélectionnée' : 'Photo d\'identité récente (face avant)'}
                                    </div>
                                </div>
                            </div>

                            {/* CARTE D'IDENTITÉ - Recto avec OCR */}
                            <div className="form-group">
                                <label>Carte d'Identité (Recto) *</label>
                                <div className="file-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'idCardRecto')}
                                        required
                                    />
                                    <div className="file-upload-label">
                                        {files.idCardRecto ? '✓ Recto sélectionné' : 'Recto de la carte d\'identité'}
                                    </div>
                                </div>
                                <div className="ocr-hint">
                                    🔍 Le scan automatique se déclenchera
                                </div>
                            </div>

                            {/* CARTE D'IDENTITÉ - Verso */}
                            <div className="form-group">
                                <label>Carte d'Identité (Verso) *</label>
                                <div className="file-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'idCardVerso')}
                                        required
                                    />
                                    <div className="file-upload-label">
                                        {files.idCardVerso ? '✓ Verso sélectionné' : 'Verso de la carte d\'identité'}
                                    </div>
                                </div>
                            </div>

                            {/* Section résultats OCR - ✅ CORRIGÉE */}
                            <div className="form-group full-width">
                                <div className="ocr-section">
                                    <h4>🔍 Scanner Automatique</h4>
                                    <div className="ocr-description">
                                        Le système analysera automatiquement votre carte d'identité quand le recto sera uploadé
                                    </div>

                                    {ocrLoading && (
                                        <div className="ocr-loading">
                                            🔍 Analyse OCR en cours...
                                        </div>
                                    )}

                                    {ocrError && (
                                        <div className="ocr-error">
                                            ❌ {ocrError}
                                        </div>
                                    )}

                                    {renderOcrResults()}

                                    {!files.idCardRecto && (
                                        <div className="upload-status waiting">
                                            ⏳ En attente du recto pour l'analyse...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nom Complet *</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date de Naissance *</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Adresse Complète *</label>
                            <textarea
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Section Profession */}
                    <div className="form-section">
                        <h3 className="section-title">Situation Professionnelle</h3>

                        <div className="form-group">
                            <label>Vous êtes : *</label>
                            <select
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Sélectionnez...</option>
                                <option value="functionnaire">Fonctionnaire</option>
                                <option value="salarie">Salarié privé</option>
                                <option value="independant">Indépendant</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>

                        {formData.employmentType === 'functionnaire' ? (
                            <div className="file-upload-group">
                                <div className="form-group">
                                    <label>Attestation de Travail (Fonctionnaire) *</label>
                                    <div className="file-upload">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.png"
                                            onChange={(e) => handleFileChange(e, 'workCertificate')}
                                        />
                                        <div className="file-upload-label">
                                            {files.workCertificate ? '✓ Fichier sélectionné' : 'Attestation de travail'}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Attestation de Salaire *</label>
                                    <div className="file-upload">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.png"
                                            onChange={(e) => handleFileChange(e, 'salaryCertificate')}
                                        />
                                        <div className="file-upload-label">
                                            {files.salaryCertificate ? '✓ Fichier sélectionné' : 'Dernière attestation de salaire'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : formData.employmentType && (
                            <div className="guarantor-section">
                                <h4>Informations du Garant *</h4>

                                <div className="file-upload-group">
                                    <div className="form-group">
                                        <label>Attestation de Travail du Garant *</label>
                                        <div className="file-upload">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.png"
                                                onChange={(e) => handleFileChange(e, 'guarantorWorkCert')}
                                            />
                                            <div className="file-upload-label">
                                                {files.guarantorWorkCert ? '✓ Fichier sélectionné' : 'Attestation de travail du garant'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Attestation de Salaire du Garant *</label>
                                        <div className="file-upload">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.png"
                                                onChange={(e) => handleFileChange(e, 'guarantorSalaryCert')}
                                            />
                                            <div className="file-upload-label">
                                                {files.guarantorSalaryCert ? '✓ Fichier sélectionné' : 'Attestation de salaire du garant'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section Crédit */}
                    <div className="form-section">
                        <h3 className="section-title">Détails du Crédit</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Montant Demandé (DH) *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    min="1000"
                                    max="50000"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Durée (Mois) *</label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="6">6 mois</option>
                                    <option value="12">12 mois</option>
                                    <option value="24">24 mois</option>
                                    <option value="36">36 mois</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Objectif du Crédit *</label>
                            <textarea
                                name="purpose"
                                rows={3}
                                value={formData.purpose}
                                onChange={handleInputChange}
                                placeholder="Décrivez l'utilisation prévue du crédit..."
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={submitLoading}>
                        {submitLoading ? 'Soumission en cours...' : 'Soumettre la Demande'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreditRequestForm;