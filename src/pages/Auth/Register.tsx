// src/pages/Auth/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '', // ✅ AJOUTEZ: Le backend attend un username
        fullname: '',
        email: '',
        phone: '',
        cin: '', // ✅ AJOUTEZ: requis par le backend
        address: '', // ✅ AJOUTEZ: requis par le backend
        employed: false, // ✅ AJOUTEZ: requis par le backend
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            // ✅ FORMAT COMPATIBLE AVEC LE BACKEND
            await register({
                username: formData.username, // ✅ OBLIGATOIRE pour le backend
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                cin: formData.cin || "DEFAULT_CIN", // ✅ OBLIGATOIRE
                address: formData.address || "DEFAULT_ADDRESS", // ✅ OBLIGATOIRE
                employed: formData.employed, // ✅ OBLIGATOIRE
                // monthlyIncome et profession sont optionnels
            });
            navigate('/login'); // ✅ Redirige vers login après inscription
        } catch (err: any) {
            setError(err.response?.data || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Créer un Compte</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* ✅ NOUVEAU CHAMP USERNAME */}
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullname">Nom Complet</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Téléphone *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ✅ NOUVEAUX CHAMPS POUR LE BACKEND */}
                    <div className="form-group">
                        <label htmlFor="cin">CIN *</label>
                        <input
                            type="text"
                            id="cin"
                            name="cin"
                            value={formData.cin}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Adresse *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="employed"
                                checked={formData.employed}
                                onChange={handleChange}
                            />
                            Employé
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>

                <div className="auth-link">
                    <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;