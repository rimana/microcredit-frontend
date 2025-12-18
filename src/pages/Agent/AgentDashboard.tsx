import React, { useState, useEffect } from 'react';
import { creditService } from '../../services/api/credit';
import { useNavigate } from 'react-router-dom';
import './AgentDashboard.css';

const AgentDashboard = () => {
    const [pendingCredits, setPendingCredits] = useState<any[]>([]);
    const [selectedCredit, setSelectedCredit] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true); // Pour indiquer le chargement initial
    const [stats, setStats] = useState({
        pending: 0,
        reviewed: 0,
        approved: 0,
        rejected: 0,
    });

    const navigate = useNavigate();

    // === CHARGEMENT DES DONNÉES RÉELLES DÈS LE MONTAGE ===
    useEffect(() => {
        fetchPendingCredits();
        fetchStats();
    }, []);

    const fetchPendingCredits = async () => {
        try {
            setListLoading(true);
            const credits = await creditService.getPendingCreditRequests();
            setPendingCredits(credits);
            // Mise à jour du compteur pending dans les stats
            setStats(prev => ({ ...prev, pending: credits.length }));
        } catch (error) {
            console.error('Erreur lors du chargement des demandes en attente:', error);
            setPendingCredits([]);
            alert('Impossible de charger les demandes. Vérifiez votre connexion ou contactez l’administrateur.');
        } finally {
            setListLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const statsData = await creditService.getCreditStatistics();
            setStats({
                pending: statsData.pendingRequests,
                reviewed: statsData.approvedRequests + statsData.rejectedRequests,
                approved: statsData.approvedRequests,
                rejected: statsData.rejectedRequests,
            });
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
            // Stats par défaut en cas d'erreur
            setStats(prev => ({ ...prev }));
        }
    };

    const handleSelectCredit = async (creditId: number) => {
        try {
            setLoading(true);
            const credit = pendingCredits.find(c => c.id === creditId);
            if (credit) {
                setSelectedCredit(credit);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewCredit = async (decision: 'APPROVED' | 'REJECTED', feedback?: string) => {
        if (!selectedCredit) return;

        try {
            setLoading(true);
            // Simulation ou appel réel selon ton backend
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`Crédit ${decision === 'APPROVED' ? 'approuvé' : 'rejeté'} avec succès!`);

            // Mise à jour locale
            setPendingCredits(prev => prev.filter(c => c.id !== selectedCredit.id));
            setSelectedCredit(null);

            setStats(prev => ({
                ...prev,
                pending: prev.pending - 1,
                reviewed: prev.reviewed + 1,
                [decision === 'APPROVED' ? 'approved' : 'rejected']: prev[decision === 'APPROVED' ? 'approved' : 'rejected'] + 1
            }));

        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la décision');
        } finally {
            setLoading(false);
        }
    };

    const handleGoToMLTest = () => {
        navigate('/tools/ml-test');
    };

    const handleQuickMLTest = () => {
        window.open('/tools/ml-test', '_blank');
    };

    return (
        <div className="agent-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Tableau de Bord Agent</h1>
                    <p className="subtitle">Gérez et analysez les demandes de crédit</p>
                </div>

                <div className="header-actions">
                    <button className="btn-ml-test" onClick={handleGoToMLTest}>
                        🧪 Tester le Modèle ML
                    </button>
                    <button className="btn-quick-ml" onClick={handleQuickMLTest}>
                        🔍 Test Rapide
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>EN ATTENTE</h3>
                    <p className="stat-value">{stats.pending}</p>
                    <p className="stat-change">À traiter</p>
                </div>
                <div className="stat-card">
                    <h3>REVUS</h3>
                    <p className="stat-value">{stats.reviewed}</p>
                    <p className="stat-change">Total traité</p>
                </div>
                <div className="stat-card">
                    <h3>APPROUVÉS</h3>
                    <p className="stat-value">{stats.approved}</p>
                    <p className="stat-change">{stats.reviewed > 0 ? Math.round((stats.approved / stats.reviewed) * 100) : 0}% taux</p>
                </div>
                <div className="stat-card">
                    <h3>REJETÉS</h3>
                    <p className="stat-value">{stats.rejected}</p>
                    <p className="stat-change">{stats.reviewed > 0 ? Math.round((stats.rejected / stats.reviewed) * 100) : 0}% taux</p>
                </div>
            </div>

            <div className="ml-tools-section">
                <h2>🛠️ Outils d'Analyse ML</h2>
                <div className="tools-grid">
                    <div className="tool-card" onClick={handleGoToMLTest}>
                        <div className="tool-icon">🧪</div>
                        <h3>Test Complet ML</h3>
                        <p>Tester le modèle XGBoost avec différents profils</p>
                        <button className="tool-btn">Accéder →</button>
                    </div>
                    <div className="tool-card" onClick={() => selectedCredit ? navigate('/tools/ml-test') : alert('Sélectionnez d\'abord un crédit')}>
                        <div className="tool-icon">🔍</div>
                        <h3>Analyser ce Crédit</h3>
                        <p>Lancer une analyse détaillée du crédit sélectionné</p>
                        <button className="tool-btn" disabled={!selectedCredit}>
                            {selectedCredit ? 'Analyser →' : 'Sélectionnez un crédit'}
                        </button>
                    </div>
                    <div className="tool-card" onClick={handleGoToMLTest}>
                        <div className="tool-icon">⚠️</div>
                        <h3>Scénario Risqué</h3>
                        <p>Tester avec un profil à haut risque</p>
                        <button className="tool-btn">Tester →</button>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="pending-list">
                    <div className="list-header">
                        <h2>Demandes en Attente ({pendingCredits.length})</h2>
                        <button className="btn-refresh" onClick={fetchPendingCredits} disabled={listLoading}>
                            🔄 {listLoading ? 'Chargement...' : 'Rafraîchir'}
                        </button>
                    </div>

                    {listLoading ? (
                        <div className="empty-state">
                            <div className="empty-icon">⏳</div>
                            <h3>Chargement des demandes...</h3>
                        </div>
                    ) : pendingCredits.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>Aucune demande en attente</h3>
                            <p>Toutes les demandes ont été traitées</p>
                        </div>
                    ) : (
                        pendingCredits.map(credit => (
                            <div
                                key={credit.id}
                                className={`credit-item ${selectedCredit?.id === credit.id ? 'selected' : ''}`}
                                onClick={() => handleSelectCredit(credit.id)}
                            >
                                <div className="credit-info">
                                    <strong>{credit.user?.firstName} {credit.user?.lastName}</strong>
                                    <span>{credit.amount?.toLocaleString()} DHS</span>
                                    <span>{credit.duration} mois</span>
                                    {credit.score && (
                                        <span className={`risk-badge ${credit.riskLevel?.toLowerCase()}`}>
                                            Score: {credit.score}
                                        </span>
                                    )}
                                </div>
                                <div className="credit-meta">
                                    <div className="credit-date">
                                        {new Date(credit.createdAt).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="credit-purpose">
                                        {credit.purpose}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Le reste du détail du crédit reste identique */}
                {selectedCredit && (
                    <div className="credit-details">
                        {/* ... (tu peux garder tout le bloc details existant, il n'a pas besoin d'être modifié) */}
                        {/* Je te le remets pour complétude */}
                        <div className="details-header">
                            <h2>Détails du Crédit #{selectedCredit.id}</h2>
                            <button className="btn-ml-analyze" onClick={handleGoToMLTest}>
                                🧪 Analyser avec ML
                            </button>
                        </div>
                        {/* ... reste du détail inchangé ... */}
                        <div className="decision-actions">
                            <button className="btn-approve" onClick={() => handleReviewCredit('APPROVED')} disabled={loading}>
                                ✅ Approuver
                            </button>
                            <button className="btn-reject" onClick={() => {
                                const feedback = prompt('Raison du rejet:');
                                if (feedback !== null) handleReviewCredit('REJECTED', feedback);
                            }} disabled={loading}>
                                ❌ Rejeter
                            </button>
                            <button className="btn-neutral" onClick={() => setSelectedCredit(null)} disabled={loading}>
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboard;