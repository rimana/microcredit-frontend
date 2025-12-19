import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { creditService } from '../../services/api/credit';
import { CreditRequest, CreditStatus } from '../../ types/credit';
import './CreditList.css';


const CreditList: React.FC = () => {
    const { user, logout } = useAuth();
    const [credits, setCredits] = useState<CreditRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCredits();
    }, []);

    const loadCredits = async () => {
        try {
            setLoading(true);
            const data = await creditService.getUserCreditRequests();
            setCredits(data);
        } catch (error) {
            console.error('Error loading credits:', error);
            setError('Erreur lors du chargement des crédits');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: CreditStatus) => {
        const statusMap: { [key in CreditStatus]: { text: string; className: string } } = {
            [CreditStatus.PENDING]: { text: 'EN ATTENTE', className: 'status-pending' },
            [CreditStatus.IN_REVIEW]: { text: 'EN RÉVISION', className: 'status-in-review' },
            [CreditStatus.APPROVED]: { text: 'APPROUVÉ', className: 'status-approved' },
            [CreditStatus.REJECTED]: { text: 'REJETÉ', className: 'status-rejected' },
            [CreditStatus.CANCELLED]: { text: 'ANNULÉ', className: 'status-cancelled' },
            [CreditStatus.PAID]: { text: 'PAYÉ', className: 'status-paid' }
        };
        return statusMap[status] || { text: status, className: 'status-default' };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className="credit-list-container">
            {/* Header */}
            <div className="header">
                <div className="header-content">
                    <h1>MicroCredit Platform</h1>
                    <div className="user-menu">
                        <span>Bonjour, <strong>{user?.username}</strong></span>
                        <button onClick={logout} className="logout-btn" style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="nav">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/credit-request" className="nav-link">Demande de Crédit</Link>
                <Link to="/my-credits" className="nav-link active">Mes Crédits</Link>
            </nav>

            {/* Main Content */}
            <div className="container">
                <h2>Mes Demandes de Crédit</h2>

                {loading && (
                    <div className="loading-state">
                        <p>Chargement des demandes...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && credits.length === 0 && (
                    <div className="empty-state">
                        <h3>Aucune demande de crédit</h3>
                        <p>Vous n'avez pas encore soumis de demande de crédit.</p>
                        <Link to="/credit-request" className="action-btn primary">
                            Faire une demande de crédit
                        </Link>
                    </div>
                )}

                {!loading && !error && credits.length > 0 && (
                    <div className="credits-grid">
                        {credits.map((credit) => {
                            const statusInfo = getStatusBadge(credit.status);
                            return (
                                <div key={credit.id} className="credit-card">
                                    <div className="credit-card-header">
                                        <h3>Demande #{credit.id}</h3>
                                        <span className={`credit-status ${statusInfo.className}`}>
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                    <div className="credit-card-body">
                                        <div className="credit-info">
                                            <span className="info-label">Montant :</span>
                                            <span className="info-value">{credit.amount.toLocaleString()} DH</span>
                                        </div>
                                        <div className="credit-info">
                                            <span className="info-label">Durée :</span>
                                            <span className="info-value">{credit.duration} mois</span>
                                        </div>
                                        <div className="credit-info">
                                            <span className="info-label">Objet :</span>
                                            <span className="info-value">{credit.purpose}</span>
                                        </div>
                                        <div className="credit-info">
                                            <span className="info-label">Date :</span>
                                            <span className="info-value">{formatDate(credit.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditList;

