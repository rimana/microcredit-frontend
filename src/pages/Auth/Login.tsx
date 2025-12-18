// src/pages/Auth/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('🔄 Login submission for:', formData.username);

        try {
            // Appeler login et récupérer l'utilisateur
            const user = await login(formData.username, formData.password);

            console.log('✅ Login successful, user role:', user.role);
            console.log('📍 Redirecting based on role...');

            // Rediriger selon le rôle
            switch (user.role) {
                case 'ADMIN':
                    console.log('🚀 Redirecting to ADMIN dashboard');
                    navigate('/admin/dashboard');
                    break;
                case 'AGENT':
                    console.log('🚀 Redirecting to AGENT dashboard');
                    navigate('/agent/dashboard');
                    break;
                case 'CLIENT':
                default:
                    console.log('🚀 Redirecting to CLIENT dashboard');
                    navigate('/dashboard');
                    break;
            }

        } catch (err: any) {
            console.error('❌ Login failed:', err.message || err);
            setError('Nom d\'utilisateur ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
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

                <h1>Connexion</h1>
                <p className="auth-subtitle">Connectez-vous pour accéder à votre espace</p>

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
                            placeholder="Votre nom d'utilisateur"
                            required
                            disabled={loading}
                        />
                    </div>

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
                            placeholder="Votre mot de passe"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Connexion en cours...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div className="auth-link">
                    <p>Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;