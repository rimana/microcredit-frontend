import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { creditService } from '../../services/api/credit';
import './CreditList.css';

const CreditList: React.FC = () => {
    const { user } = useAuth();
    const [credits, setCredits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMyCredits();
    }, []);

    const loadMyCredits = async () => {
        try {
            setLoading(true);
            setError(null);
            const myCredits = await creditService.getUserCreditRequests();
            setCredits(myCredits);
        } catch (err: any) {
            console.error('Erreur chargement mes crédits:', err);
            setError('Impossible de charger vos demandes. Réessayez plus tard.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'En attente';
            case 'APPROVED': return 'Approuvée';
            case 'REJECTED': return 'Rejetée';
            case 'IN_REVIEW': return 'En cours d\'analyse';
            default: return status || 'Inconnu';
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'APPROVED': return 'status-approved';
            case 'REJECTED': return 'status-rejected';
            default: return 'status-default';
        }
    };

    return (
        <div className="credit-list-container">
            <div className="header">
                <div className="header-content">
                    <h1>MicroCredit Platform</h1>
                    <div className="user-menu">
                        <span>Bonjour, <strong>{user?.username || user?.fullname || 'Client'}</strong></span>
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

                {error && <div className="error-alert">{error}</div>}

                {loading ? (
                    <div className="loading">Chargement de vos demandes...</div>
                ) : credits.length === 0 ? (
                    <div className="empty-state">
                        <h3>Aucune demande de crédit</h3>
                        <p>Vous n'avez pas encore soumis de demande de crédit.</p>
                        <Link to="/credit-request" className="action-btn primary">
                            Faire une demande de crédit
                        </Link>
                    </div>
                ) : (
                    <div className="credits-grid">
                        {credits.map((credit) => (
                            <div key={credit.id} className="credit-card">
                                <div className="credit-header">
                                    <h3>Demande #{credit.id}</h3>
                                    <span className={`status-badge ${getStatusClass(credit.status)}`}>
                                        {getStatusText(credit.status)}
                                    </span>
                                </div>

                                <div className="credit-info">
                                    <p><strong>Montant :</strong> {credit.amount?.toLocaleString()} DH</p>
                                    <p><strong>Durée :</strong> {credit.duration} mois</p>
                                    <p><strong>Objet :</strong> {credit.purpose}</p>
                                    <p><strong>Date :</strong> {new Date(credit.createdAt).toLocaleDateString('fr-FR')}</p>
                                </div>

                                {/* === LE SCORING EST CACHÉ POUR LE CLIENT === */}
                                {/* On ne montre PAS : score, riskLevel, recommendation */}

                                {/* On garde le commentaire de l'agent (utile si rejet) */}
                                {credit.agentNotes && (
                                    <div className="agent-notes">
                                        <strong>Commentaire de l'agent :</strong>
                                        <p>{credit.agentNotes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditList;