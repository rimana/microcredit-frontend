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
                <h1>Connexion</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="auth-link">
                    <p>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;