import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useUniversalOcr } from '../../hooks/useUniversalOcr';
import { creditService } from '../../services/api/credit';
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
        <div className="credit-form-page">
            <div className="credit-form-container">
                {/* Header avec gradient */}
                <div className="form-header">
                    <h1>MicroCredit Platform</h1>
                    <p>Bonjour, <strong>{user?.fullname}</strong></p>
                </div>

                {/* Navigation tabs */}
                <nav className="nav-tabs">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/credit-request" className="active">Demande de Crédit</Link>
                    <Link to="/my-credits">Mes Crédits</Link>
                </nav>

                {/* Contenu du formulaire */}
                <div className="form-content-wrapper">
                    <h1>Nouvelle Demande de Crédit</h1>
                    <p className="form-description">
                        Tous les champs marqués d'un * sont obligatoires.
                        Notre système d'IA analysera automatiquement votre demande.
                    </p>

                    <form onSubmit={handleSubmit} className="form-card">
                    {/* Section 1: Informations Personnelles */}
                        <div className="form-section">
                            <h2 className="form-section-title">
                                <span className="section-icon">📝</span>
                                Informations Personnelles
                            </h2>

                            {/* Upload Documents */}
                            <div className="form-grid form-grid-full">
                                <div className="form-group">
                                    <label className="file-upload-label">
                                        PHOTO D'IDENTITÉ <span className="required">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'photoIdentity')}
                                        required
                                    />
                                    <span className="file-hint">
                                        {files.photoIdentity ? `✓ ${files.photoIdentity.name}` : 'Photo d\'identité récente'}
                                    </span>
                                </div>

                                <div className="form-group">
                                    <label className="file-upload-label">
                                        CIN RECTO <span className="required">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'idCardRecto')}
                                        required
                                    />
                                    <span className="file-hint">
                                        {files.idCardRecto ? `✓ ${files.idCardRecto.name}` : 'Recto de la CIN'}
                                    </span>
                                    <a href="#" className="scan-link">Le scan automatique se déclenchera</a>
                                </div>

                                <div className="form-group">
                                    <label className="file-upload-label">
                                        CIN VERSO <span className="required">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'idCardVerso')}
                                        required
                                    />
                                    <span className="file-hint">
                                        {files.idCardVerso ? `✓ ${files.idCardVerso.name}` : 'Verso de la CIN'}
                                    </span>
                                </div>
                            </div>

                            {/* Section OCR */}
                            {(ocrLoading || ocrError || ocrResult) && (
                                <div className="scanner-section">
                                    <h2 className="scanner-title">🔍 Scanner Automatique</h2>
                                    {ocrLoading && <div className="loading">Analyse OCR en cours...</div>}
                                    {ocrError && <div className="error-alert">❌ {ocrError}</div>}
                                    {renderOcrResults()}
                                </div>
                            )}

                            {/* Informations basiques */}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>NOM COMPLET <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        placeholder="Nom complet"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CIN <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="cin"
                                        value={formData.cin}
                                        onChange={handleInputChange}
                                        placeholder="Numéro CIN"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>DATE DE NAISSANCE <span className="required">*</span></label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {formData.birthdate && (
                                        <span className="file-hint">
                                            Âge: {calculateAge(formData.birthdate)} ans
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>TÉLÉPHONE <span className="required">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+212 6XX XXX XXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group form-grid-full">
                                <label>ADRESSE COMPLÈTE <span className="required">*</span></label>
                                <textarea
                                    name="address"
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Adresse complète"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section 2: Situation Professionnelle & Revenus (CRITIQUE pour ML) */}
                        <div className="form-section">
                            <h2 className="form-section-title">
                                <span className="section-icon">💼</span>
                                Situation Professionnelle & Revenus
                            </h2>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>PROFESSION <span className="required">*</span></label>
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
                                    <label>REVENU MENSUEL NET (DHS) <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        name="monthlyIncome"
                                        value={formData.monthlyIncome}
                                        onChange={handleInputChange}
                                        min="1000"
                                        step="500"
                                        placeholder="Ex: 5000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid form-grid-2col">
                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="isFunctionnaire"
                                        name="isFunctionnaire"
                                        checked={formData.isFunctionnaire}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="isFunctionnaire">Je suis fonctionnaire</label>
                                </div>

                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="hasGuarantor"
                                        name="hasGuarantor"
                                        checked={formData.hasGuarantor}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="hasGuarantor">J'ai un garant</label>
                                </div>
                            </div>

                            {/* Documents professionnels conditionnels */}
                            {formData.isFunctionnaire && (
                                <div className="form-grid form-grid-2col">
                                    <div className="form-group">
                                        <label className="file-upload-label">ATTESTATION DE TRAVAIL <span className="required">*</span></label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.png"
                                            onChange={(e) => handleFileChange(e, 'workCertificate')}
                                        />
                                        <span className="file-hint">
                                            {files.workCertificate ? `✓ ${files.workCertificate.name}` : 'Attestation de travail'}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <label className="file-upload-label">BULLETIN DE SALAIRE <span className="required">*</span></label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.png"
                                            onChange={(e) => handleFileChange(e, 'salaryCertificate')}
                                        />
                                        <span className="file-hint">
                                            {files.salaryCertificate ? `✓ ${files.salaryCertificate.name}` : '3 derniers bulletins'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {formData.hasGuarantor && (
                                <div className="form-grid form-grid-2col">
                                    <div className="form-group">
                                        <label className="file-upload-label">ATTESTATION DE TRAVAIL DU GARANT</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.png"
                                            onChange={(e) => handleFileChange(e, 'guarantorWorkCert')}
                                        />
                                        <span className="file-hint">
                                            {files.guarantorWorkCert ? `✓ ${files.guarantorWorkCert.name}` : 'Attestation travail garant'}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <label className="file-upload-label">BULLETIN DE SALAIRE DU GARANT</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.png"
                                            onChange={(e) => handleFileChange(e, 'guarantorSalaryCert')}
                                        />
                                        <span className="file-hint">
                                            {files.guarantorSalaryCert ? `✓ ${files.guarantorSalaryCert.name}` : 'Bulletins salaire garant'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 3: Détails du Crédit */}
                        <div className="form-section">
                            <h2 className="form-section-title">
                                <span className="section-icon">💰</span>
                                Détails du Crédit
                            </h2>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>MONTANT DEMANDÉ (MAD) <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        min="5000"
                                        max="100000"
                                        step="1000"
                                        placeholder="Ex: 50000"
                                        required
                                    />
                                    <span className="file-hint">Entre 5,000 et 100,000 DHS</span>
                                </div>

                                <div className="form-group">
                                    <label>DURÉE (MOIS) <span className="required">*</span></label>
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

                            <div className="form-group form-grid-full">
                                <label>OBJECTIF DU CRÉDIT <span className="required">*</span></label>
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
                                <label>TAUX D'INTÉRÊT SOUHAITÉ (%)</label>
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
                        <div className="scanner-section">
                            <p style={{margin: 0}}>ℹ️ Vous recevrez une notification dès que l'agent aura traité votre demande.</p>
                        </div>

                        <div className="form-actions">
                            <Link to="/dashboard" className="btn btn-secondary">
                                Annuler
                            </Link>
                            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                                {submitLoading ? '⏳ Soumission en cours...' : '✅ Soumettre la Demande'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreditRequestForm;