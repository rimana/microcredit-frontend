import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useUniversalOcr } from '../../hooks/useUniversalOcr';
import { creditService } from '../../services/api/credit'; // AJOUT: Import du service crédit
import './CreditForm.css';

const CreditRequestForm: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { scanIdCard, loading: ocrLoading, result: ocrResult, error: ocrError } = useUniversalOcr();

    // AJOUT: Formulaire complet avec tous les champs ML
    const [formData, setFormData] = useState({
        // Informations personnelles (du client)
        fullname: user?.fullname || '',
        address: '',
        birthdate: '',
        cin: '',
        phone: '',
        email: user?.email || '',

        // Champs requis pour le ML
        monthlyIncome: '',
        age: '',
        profession: '',
        isFunctionnaire: false,
        employed: true,
        hasGuarantor: false,

        // Détails du crédit
        amount: '',
        duration: '12',
        purpose: '',
        interestRate: '5.0'
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
        const { name, value, type } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value
        });
    };

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
                        // Remplir automatiquement les champs
                        setFormData(prev => ({
                            ...prev,
                            fullname: result.fullName || prev.fullname,
                            address: result.address || prev.address,
                            cin: result.cin || prev.cin,
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

    // AJOUT: Calculer l'âge à partir de la date de naissance
    const calculateAge = (birthdate: string): number => {
        if (!birthdate) return 0;
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        // Validation
        if (!files.photoIdentity || !files.idCardRecto || !files.idCardVerso) {
            alert('Veuillez uploader tous les documents d\'identité requis');
            setSubmitLoading(false);
            return;
        }

        // Calculer l'âge
        const age = calculateAge(formData.birthdate);
        if (age < 18 || age > 70) {
            alert('L\'âge doit être compris entre 18 et 70 ans');
            setSubmitLoading(false);
            return;
        }

        try {
            // Préparer les données pour l'API
            const creditRequestDTO = {
                amount: parseFloat(formData.amount),
                duration: parseInt(formData.duration),
                purpose: formData.purpose,
                monthlyIncome: parseFloat(formData.monthlyIncome),
                isFunctionnaire: formData.isFunctionnaire,
                employed: formData.employed,
                age: age,
                profession: formData.profession,
                hasGuarantor: formData.hasGuarantor,
                interestRate: parseFloat(formData.interestRate)
            };

            console.log('📤 Envoi des données:', creditRequestDTO);

            // AJOUT: Envoyer la demande au backend
            const createdCredit = await creditService.createCreditRequest(creditRequestDTO);

            console.log('✅ Crédit créé:', createdCredit);

            // AJOUT: Gérer l'upload des fichiers (à implémenter séparément)
            // await uploadFiles(createdCredit.id, files);

            alert('✅ Votre demande de crédit a été soumise avec succès !\nElle sera analysée automatiquement par notre système d\'IA.');
            navigate('/dashboard');

        } catch (error: any) {
            console.error('❌ Erreur:', error);
            alert(`Erreur: ${error.response?.data?.message || error.message || 'Une erreur est survenue'}`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const renderOcrResults = () => {
        if (!ocrResult) return null;

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
                </div>
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
                <p className="form-description">
                    Tous les champs marqués d'un * sont obligatoires.
                    Notre système d'IA analysera automatiquement votre demande.
                </p>

                <form onSubmit={handleSubmit} className="credit-form">
                    {/* Section 1: Informations Personnelles */}
                    <div className="form-section">
                        <h3 className="section-title">📝 Informations Personnelles</h3>

                        {/* Upload Documents */}
                        <div className="file-upload-group">
                            <div className="form-group">
                                <label>Photo d'Identité *</label>
                                <div className="file-upload">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photoIdentity')} required />
                                    <div className="file-upload-label">
                                        {files.photoIdentity ? '✓ Photo sélectionnée' : 'Photo d\'identité récente'}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>CIN Recto * </label>
                                <div className="file-upload">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idCardRecto')} required />
                                    <div className="file-upload-label">
                                        {files.idCardRecto ? '✓ Recto sélectionné' : 'Recto de la CIN'}
                                    </div>
                                </div>
                                <div className="ocr-hint">🔍 Le scan automatique se déclenchera</div>
                            </div>

                            <div className="form-group">
                                <label>CIN Verso *</label>
                                <div className="file-upload">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idCardVerso')} required />
                                    <div className="file-upload-label">
                                        {files.idCardVerso ? '✓ Verso sélectionné' : 'Verso de la CIN'}
                                    </div>
                                </div>
                            </div>

                            {/* Section OCR */}
                            <div className="form-group full-width">
                                <div className="ocr-section">
                                    <h4>🔍 Scanner Automatique</h4>
                                    {ocrLoading && <div className="ocr-loading">Analyse OCR en cours...</div>}
                                    {ocrError && <div className="ocr-error">❌ {ocrError}</div>}
                                    {renderOcrResults()}
                                </div>
                            </div>
                        </div>

                        {/* Informations basiques */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nom Complet *</label>
                                <input type="text" name="fullname" value={formData.fullname} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>CIN *</label>
                                <input type="text" name="cin" value={formData.cin} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Date de Naissance *</label>
                                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleInputChange} required />
                                {formData.birthdate && (
                                    <div className="age-display">
                                        Âge: {calculateAge(formData.birthdate)} ans
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Téléphone *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Adresse Complète *</label>
                            <textarea name="address" rows={2} value={formData.address} onChange={handleInputChange} required />
                        </div>
                    </div>

                    {/* Section 2: Situation Professionnelle & Revenus (CRITIQUE pour ML) */}
                    <div className="form-section">
                        <h3 className="section-title">💼 Situation Professionnelle & Revenus</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Profession *</label>
                                <select name="profession" value={formData.profession} onChange={handleInputChange} required>
                                    <option value="">Sélectionnez...</option>
                                    <option value="Ingénieur">Ingénieur</option>
                                    <option value="Médecin">Médecin</option>
                                    <option value="Enseignant">Enseignant</option>
                                    <option value="Fonctionnaire">Fonctionnaire</option>
                                    <option value="Commerçant">Commerçant</option>
                                    <option value="Cadre">Cadre</option>
                                    <option value="Employé">Employé</option>
                                    <option value="Artisan">Artisan</option>
                                    <option value="Étudiant">Étudiant</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Revenu Mensuel Net (DHS) *</label>
                                <input
                                    type="number"
                                    name="monthlyIncome"
                                    value={formData.monthlyIncome}
                                    onChange={handleInputChange}
                                    min="1000"
                                    step="500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <label className="checkbox-label">
                                <input type="checkbox" name="isFunctionnaire" checked={formData.isFunctionnaire} onChange={handleInputChange} />
                                Je suis fonctionnaire
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" name="hasGuarantor" checked={formData.hasGuarantor} onChange={handleInputChange} />
                                J'ai un garant
                            </label>
                        </div>

                        {/* Documents professionnels conditionnels */}
                        {formData.isFunctionnaire ? (
                            <div className="file-upload-group">
                                <div className="form-group">
                                    <label>Attestation de Travail *</label>
                                    <div className="file-upload">
                                        <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, 'workCertificate')} />
                                        <div className="file-upload-label">
                                            {files.workCertificate ? '✓ Fichier sélectionné' : 'Attestation de travail'}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Bulletin de Salaire *</label>
                                    <div className="file-upload">
                                        <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, 'salaryCertificate')} />
                                        <div className="file-upload-label">
                                            {files.salaryCertificate ? '✓ Fichier sélectionné' : '3 derniers bulletins'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : formData.hasGuarantor && (
                            <div className="guarantor-section">
                                <h4>Documents du Garant</h4>
                                <div className="file-upload-group">
                                    <div className="form-group">
                                        <label>Attestation de Travail du Garant</label>
                                        <div className="file-upload">
                                            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, 'guarantorWorkCert')} />
                                            <div className="file-upload-label">
                                                {files.guarantorWorkCert ? '✓ Fichier sélectionné' : 'Attestation travail garant'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Bulletin de Salaire du Garant</label>
                                        <div className="file-upload">
                                            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, 'guarantorSalaryCert')} />
                                            <div className="file-upload-label">
                                                {files.guarantorSalaryCert ? '✓ Fichier sélectionné' : 'Bulletins salaire garant'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Détails du Crédit */}
                    <div className="form-section">
                        <h3 className="section-title">💰 Détails du Crédit</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Montant Demandé (MAD) *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    min="5000"
                                    max="100000"
                                    step="1000"
                                    required
                                />
                                <div className="amount-range">Entre 5,000 et 100,000 DHS</div>
                            </div>

                            <div className="form-group">
                                <label>Durée (Mois) *</label>
                                <select name="duration" value={formData.duration} onChange={handleInputChange} required>
                                    <option value="6">6 mois</option>
                                    <option value="12">12 mois</option>
                                    <option value="24">24 mois</option>
                                    <option value="36">36 mois</option>
                                    <option value="48">48 mois</option>
                                    <option value="60">60 mois</option>
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
                                placeholder="Ex: Achat voiture, Rénovation maison, Frais médicaux, Investissement..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Taux d'intérêt souhaité (%)</label>
                            <select name="interestRate" value={formData.interestRate} onChange={handleInputChange}>
                                <option value="4.5">4.5% (Préférentiel)</option>
                                <option value="5.0">5.0% (Standard)</option>
                                <option value="5.5">5.5%</option>
                                <option value="6.0">6.0%</option>
                                <option value="6.5">6.5%</option>
                            </select>
                        </div>
                    </div>

                    {/* Section informations système */}
                    <div className="system-info">
                        <h4>ℹ️ Information Système</h4>
                        <p>Vous recevrez une notification dès que l'agent aura traité votre demande.</p>
                    </div>

                    <button type="submit" className="submit-btn" disabled={submitLoading}>
                        {submitLoading ? '⏳ Soumission en cours...' : '✅ Soumettre la Demande'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreditRequestForm;