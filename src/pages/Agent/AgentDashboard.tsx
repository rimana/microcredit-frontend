import React, { useState, useEffect } from 'react';
import { creditService } from '../../services/api/credit';
import './AgentDashboard.css';

const AgentDashboard = () => {
    const [pendingCredits, setPendingCredits] = useState<any[]>([]);
    const [selectedCredit, setSelectedCredit] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        fetchPendingCredits();
    }, []);

    const fetchPendingCredits = async () => {
        try {
            setListLoading(true);
            const credits = await creditService.getPendingCreditRequests();
            setPendingCredits(credits);
        } catch (error) {
            console.error('Erreur chargement demandes:', error);
            alert('Impossible de charger les demandes en attente.');
            setPendingCredits([]);
        } finally {
            setListLoading(false);
        }
    };

    const handleSelectCredit = (creditId: number) => {
        const credit = pendingCredits.find(c => c.id === creditId);
        if (credit) {
            setSelectedCredit(credit);
        }
    };

    // Analyse ML réelle sur la demande sélectionnée
    const handleAnalyzeCredit = async () => {
        if (!selectedCredit) return;

        try {
            setLoading(true);
            const analysis = await creditService.analyzeCreditRequest(selectedCredit.id);

            // Mise à jour avec les résultats frais du modèle
            setSelectedCredit({
                ...selectedCredit,
                score: analysis.creditScore ?? selectedCredit.score,
                riskLevel: analysis.riskLevel ?? selectedCredit.riskLevel,
                probabilityDefault: analysis.probabilityDefault,
                recommendation: analysis.recommendations ?? selectedCredit.recommendation,
                redFlags: analysis.redFlags || [],
                positiveFactors: analysis.positiveFactors || [],
                maxRecommendedAmount: analysis.maxSuggestedAmount,
                suggestedDuration: analysis.suggestedDuration,
            });

            alert('Analyse ML réelle terminée avec succès !');
        } catch (error: any) {
            console.error('Erreur analyse ML:', error);
            alert('Erreur lors de l\'analyse : ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Décision réelle : Approuver ou Rejeter
    const handleReviewCredit = async (decision: 'APPROVE' | 'REJECT', feedback?: string) => {
        if (!selectedCredit) return;

        try {
            setLoading(true);

            await creditService.reviewCreditRequest(selectedCredit.id, decision, feedback);

            alert(`Crédit ${decision === 'APPROVE' ? 'approuvé' : 'rejeté'} avec succès !`);

            // Retire de la liste en attente
            setPendingCredits(prev => prev.filter(c => c.id !== selectedCredit.id));
            setSelectedCredit(null);

            // Recharge la liste pour être sûr
            fetchPendingCredits();

        } catch (error: any) {
            console.error('Erreur décision:', error);
            alert('Erreur lors de la décision : ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agent-dashboard">
            <div className="dashboard-header">
                <h1>Tableau de Bord Agent</h1>
                <p className="subtitle">Gérez et analysez les demandes de crédit</p>
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
                        <div className="empty-state">Chargement des demandes...</div>
                    ) : pendingCredits.length === 0 ? (
                        <div className="empty-state">
                            <h3>Aucune demande en attente</h3>
                            <p>Toutes les demandes ont été traitées.</p>
                        </div>
                    ) : (
                        pendingCredits.map(credit => (
                            <div
                                key={credit.id}
                                className={`credit-item ${selectedCredit?.id === credit.id ? 'selected' : ''}`}
                                onClick={() => handleSelectCredit(credit.id)}
                            >
                                <div className="credit-info">
                                    <strong>{credit.user?.username || 'Client inconnu'}</strong>
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
                                    <div className="credit-purpose">{credit.purpose}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedCredit && (
                    <div className="credit-details">
                        <div className="details-header">
                            <h2>Détails du Crédit #{selectedCredit.id}</h2>
                            <button
                                className="btn-ml-analyze"
                                onClick={handleAnalyzeCredit}
                                disabled={loading}
                            >
                                🧪 Analyser avec ML (Réel)
                            </button>
                        </div>

                        <div className="details-grid">
                            <div className="detail-section">
                                <h3>Informations Crédit</h3>
                                <p><strong>Montant :</strong> {selectedCredit.amount?.toLocaleString()} DHS</p>
                                <p><strong>Durée :</strong> {selectedCredit.duration} mois</p>
                                <p><strong>Objet :</strong> {selectedCredit.purpose}</p>
                                <p><strong>Statut actuel :</strong> {selectedCredit.status}</p>
                                <p><strong>Date :</strong> {new Date(selectedCredit.createdAt).toLocaleDateString('fr-FR')}</p>
                            </div>

                            <div className="detail-section scoring-result">
                                <h3>Résultat Scoring ML</h3>
                                {selectedCredit.score ? (
                                    <>
                                        <div className={`score-display ${selectedCredit.riskLevel?.toLowerCase()}`}>
                                            <div>Score: <strong>{selectedCredit.score}/850</strong></div>
                                            <div>Risque: <strong>{selectedCredit.riskLevel}</strong></div>
                                        </div>
                                        <p>Recommandation: <strong>{selectedCredit.recommendation}</strong></p>
                                        {selectedCredit.probabilityDefault && (
                                            <p>Probabilité de défaut: <strong>{(selectedCredit.probabilityDefault * 100).toFixed(1)}%</strong></p>
                                        )}
                                    </>
                                ) : (
                                    <p>Aucun scoring disponible</p>
                                )}
                            </div>
                        </div>

                        <div className="decision-actions">
                            <button
                                className="btn-approve"
                                onClick={() => handleReviewCredit('APPROVE')}
                                disabled={loading}
                            >
                                ✅ Approuver le crédit
                            </button>

                            <button
                                className="btn-reject"
                                onClick={() => {
                                    const feedback = prompt('Raison du rejet (obligatoire) :');
                                    if (feedback && feedback.trim()) {
                                        handleReviewCredit('REJECT', feedback.trim());
                                    } else if (feedback !== null) {
                                        alert('Vous devez saisir une raison pour rejeter.');
                                    }
                                }}
                                disabled={loading}
                            >
                                ❌ Rejeter le crédit
                            </button>

                            <button
                                className="btn-neutral"
                                onClick={() => setSelectedCredit(null)}
                                disabled={loading}
                            >
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