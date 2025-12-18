import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const UserDashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="header">
                <div className="header-content">
                    <h1>MicroCredit Platform</h1>
                    <div className="user-menu">
                        <span>Bonjour, <strong>{user?.fullname}</strong></span>
                        <button onClick={logout} className="logout-btn">Déconnexion</button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="nav">
                <Link to="/dashboard" className="nav-link active">📊 Dashboard</Link>
                <Link to="/credit-request" className="nav-link">💳 Demande de Crédit</Link>
                <Link to="/my-credits" className="nav-link">📋 Mes Crédits</Link>
                <Link to="/profile" className="nav-link">👤 Mon Profil</Link>
            </nav>

            {/* Main Content */}
            <div className="container">
                <h2>Tableau de Bord</h2>

                {/* Statistics Cards */}
                <div className="stats-cards">
                    <div className="card">
                        <h3>💰 Solde Disponible</h3>
                        <p className="amount">0 MAD</p>
                    </div>
                    <div className="card">
                        <h3>📈 Prêts Actifs</h3>
                        <p className="amount">0</p>
                    </div>
                    <div className="card">
                        <h3>⏳ Demandes en Cours</h3>
                        <p className="amount">0</p>
                    </div>
                    <div className="card">
                        <h3>⭐ Score de Crédit</h3>
                        <p className="amount">--</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h3>⚡ Actions Rapides</h3>
                    <div className="quick-actions">
                        <Link to="/credit-request" className="action-btn primary">
                            <span>➕</span>
                            <span>Nouvelle Demande de Crédit</span>
                        </Link>
                        <Link to="/profile" className="action-btn secondary">
                            <span>👤</span>
                            <span>Compléter mon Profil</span>
                        </Link>
                        <Link to="/my-credits" className="action-btn secondary">
                            <span>📋</span>
                            <span>Voir mes Demandes</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                    <h3>📊 Activité Récente</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <p>💡 Aucune activité récente pour le moment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;