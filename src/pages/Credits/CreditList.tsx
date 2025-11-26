import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CreditList.css';

const CreditList: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="credit-list-container">
            <div className="header">
                <div className="header-content">
                    <h1>MicroCredit Platform</h1>
                    <div className="user-menu">
                        <span>Bonjour, <strong>{user?.username}</strong></span>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    </div>
                </div>
            </div>

            <nav className="nav">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/credit-request" className="nav-link">Demande de Crédit</Link>
                <Link to="/my-credits" className="nav-link active">Mes Crédits</Link>
            </nav>

            <div className="container">
                <h2>Mes Demandes de Crédit</h2>

                <div className="credits-list">
                    <div className="empty-state">
                        <h3>Aucune demande de crédit</h3>
                        <p>Vous n'avez pas encore soumis de demande de crédit.</p>
                        <Link to="/credit-request" className="action-btn primary">
                            Faire une demande de crédit
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditList;