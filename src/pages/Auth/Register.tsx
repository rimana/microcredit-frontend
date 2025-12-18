import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../../types/auth';
import './Auth.css';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        phone: '',
        cin: '',
        address: '',
        employed: false,
        password: '',
        confirmPassword: '',
        role: UserRole.CLIENT,
        secretCode: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value as UserRole;
        setFormData({
            ...formData,
            role,
            secretCode: ''
        });
    };

    const getSecretCodeLabel = () => {
        switch (formData.role) {
            case UserRole.ADMIN:
                return "Code Secret Administrateur *";
            case UserRole.AGENT:
                return "Code Secret Agent *";
            default:
                return "";
        }
    };

    const getSecretCodePlaceholder = () => {
        switch (formData.role) {
            case UserRole.ADMIN:
                return "Entrez ADMIN_SECRET_2024";
            case UserRole.AGENT:
                return "Entrez AGENT_SECRET_2024";
            default:
                return "";
        }
    };

    const getRoleDescription = () => {
        switch (formData.role) {
            case UserRole.CLIENT:
                return "Pour faire des demandes de crédit - Aucun code requis";
            case UserRole.AGENT:
                return "Pour gérer les demandes de crédit - Code secret requis";
            case UserRole.ADMIN:
                return "Pour administrer la plateforme - Code secret requis";
            default:
                return "";
        }
    };

    const needsSecretCode = () => {
        return formData.role === UserRole.ADMIN || formData.role === UserRole.AGENT;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation de base
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        // Validation pour ADMIN et AGENT - CORRECTION ICI
        if (needsSecretCode() && !formData.secretCode) {
            setError(`Le code secret est requis pour créer un compte ${formData.role.toLowerCase()}`);
            setLoading(false);
            return;
        }

        try {
            // Préparer les données
            const userData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                cin: formData.cin || "DEFAULT_CIN",
                address: formData.address || "DEFAULT_ADDRESS",
                employed: formData.employed,
                role: formData.role,
                adminSecret: formData.secretCode || undefined
            };

            console.log('📝 Données d\'inscription:', userData);

            await register(userData);
            navigate('/login');

        } catch (err: any) {
            setError(err.response?.data || err.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour déterminer si le champ secretCode doit être requis
    const isSecretCodeRequired = () => {
        return formData.role === UserRole.ADMIN || formData.role === UserRole.AGENT;
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Logo sophistiqué */}
                <div className="auth-logo">
                    <div className="logo-circle">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z" 
                                  stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M20 12V20L26 26" 
                                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                <h1>Créer un Compte</h1>
                <p className="auth-subtitle">Rejoignez notre plateforme de microcrédit</p>

                {error && <div className="error-message">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">
                            <span className="label-icon">👤</span>
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choisissez un nom d'utilisateur"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullname">
                            <span className="label-icon">✍️</span>
                            Nom Complet
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Votre nom complet"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <span className="label-icon">📧</span>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="votre.email@exemple.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            <span className="label-icon">📱</span>
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+212 6XX XXX XXX"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cin">
                            <span className="label-icon">🪪</span>
                            CIN
                        </label>
                        <input
                            type="text"
                            id="cin"
                            name="cin"
                            value={formData.cin}
                            onChange={handleChange}
                            placeholder="Numéro de CIN"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">
                            <span className="label-icon">📍</span>
                            Adresse
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Votre adresse complète"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="employed"
                                checked={formData.employed}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <span>Je suis employé(e)</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            <span className="label-icon">🎭</span>
                            Type de Compte
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleRoleChange}
                            required
                            disabled={loading}
                            className="role-select"
                        >
                            <option value={UserRole.CLIENT}>👤 Client</option>
                            <option value={UserRole.AGENT}>👔 Agent de Crédit</option>
                            <option value={UserRole.ADMIN}>👑 Administrateur</option>
                        </select>
                        <small className="form-text role-description">
                            {getRoleDescription()}
                        </small>
                    </div>

                    {/* Champ code secret pour ADMIN et AGENT */}
                    {needsSecretCode() && (
                        <div className={`secret-code-group ${formData.role.toLowerCase()}-secret`}>
                            <label htmlFor="secretCode">
                                <span className="label-icon">🔐</span>
                                {getSecretCodeLabel()}
                            </label>
                            <input
                                type="password"
                                id="secretCode"
                                name="secretCode"
                                value={formData.secretCode}
                                onChange={handleChange}
                                required={isSecretCodeRequired()}
                                disabled={loading}
                                placeholder={getSecretCodePlaceholder()}
                            />
                            <small className="form-text">
                                {formData.role === UserRole.ADMIN
                                    ? "🔒 Code secret requis pour créer un compte administrateur"
                                    : "🔒 Code secret requis pour créer un compte agent"}
                            </small>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">
                            <span className="label-icon">🔒</span>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 caractères"
                            required
                            disabled={loading}
                            minLength={6}
                        />
                        <small className="form-text">💡 Minimum 6 caractères</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <span className="label-icon">🔐</span>
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmez votre mot de passe"
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`auth-button ${formData.role.toLowerCase()}-button`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Inscription en cours...
                            </>
                        ) : (
                            `Créer mon compte ${formData.role.toLowerCase()}`
                        )}
                    </button>
                </form>

                <div className="auth-link">
                    <p>Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;

