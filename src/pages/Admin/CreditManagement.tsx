import React, { useState, useEffect } from 'react';
import { creditService } from '../../services/api/credit';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import './Admin.css';

const CreditManagement: React.FC = () => {
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // États pour la modale
  const [selectedCreditDetails, setSelectedCreditDetails] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await creditService.getAllCreditRequests();
      setCredits(data);
    } catch (error: any) {
      console.error('Error loading credits:', error);
      setError('Erreur lors du chargement des crédits : ' + (error.response?.data?.error || error.message || 'Vérifiez vos permissions'));
    } finally {
      setLoading(false);
    }
  };

  const filteredCredits = filterStatus === 'ALL'
      ? credits
      : credits.filter(credit => credit.status === filterStatus);

  const calculateStats = () => {
    const total = credits.length;
    const pending = credits.filter(c => c.status === 'PENDING').length;
    const approved = credits.filter(c => c.status === 'APPROVED').length;
    const rejected = credits.filter(c => c.status === 'REJECTED').length;

    const totalAmount = credits.reduce((sum, c) => sum + (c.amount || 0), 0);
    const pendingAmount = credits.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + (c.amount || 0), 0);
    const approvedAmount = credits.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + (c.amount || 0), 0);

    return { total, pending, approved, rejected, totalAmount, pendingAmount, approvedAmount };
  };

  const stats = calculateStats();

  // Fonctions pour la modale
  const handleViewDetails = (credit: any) => {
    setSelectedCreditDetails(credit);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedCreditDetails(null);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Rejetée';
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
      <div className="admin-layout">
        <AdminNavbar />
        <div className="admin-container">
          <h1 className="admin-page-title">
            💳 Gestion des Crédits
          </h1>

          {error && (
              <div className="admin-error">
                {error}
              </div>
          )}

          <div className="admin-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Filtrer par statut</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="PENDING">En attente</option>
                  <option value="APPROVED">Approuvés</option>
                  <option value="REJECTED">Rejetés</option>
                </select>
              </div>
              <button onClick={loadCredits} className="btn-primary">
                🔄 Actualiser
              </button>
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-card primary">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>Total Crédits</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
            </div>
            <div className="admin-card warning">
              <div className="card-icon">⏳</div>
              <div className="card-content">
                <h3>En Attente</h3>
                <p className="stat-number">{stats.pending}</p>
              </div>
            </div>
            <div className="admin-card success">
              <div className="card-icon">✅</div>
              <div className="card-content">
                <h3>Approuvés</h3>
                <p className="stat-number">{stats.approved}</p>
              </div>
            </div>
            <div className="admin-card danger">
              <div className="card-icon">❌</div>
              <div className="card-content">
                <h3>Rejetés</h3>
                <p className="stat-number">{stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-card info">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>Montant Total</h3>
                <p className="stat-number">{stats.totalAmount.toLocaleString()} DH</p>
              </div>
            </div>
            <div className="admin-card warning">
              <div className="card-icon">⏳</div>
              <div className="card-content">
                <h3>Montant en Attente</h3>
                <p className="stat-number">{stats.pendingAmount.toLocaleString()} DH</p>
              </div>
            </div>
            <div className="admin-card success">
              <div className="card-icon">✅</div>
              <div className="card-content">
                <h3>Montant Approuvé</h3>
                <p className="stat-number">{stats.approvedAmount.toLocaleString()} DH</p>
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-header">
              <h3>Liste des Demandes de Crédit ({filteredCredits.length})</h3>
            </div>

            {loading ? (
                <div className="admin-loading">Chargement des crédits...</div>
            ) : filteredCredits.length === 0 ? (
                <p>Aucun crédit trouvé.</p>
            ) : (
                <table className="credits-table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Durée</th>
                    <th>Taux</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredCredits.map((credit) => (
                      <tr key={credit.id}>
                        <td>{credit.id}</td>
                        <td>{credit.user?.username || 'Inconnu'}</td>
                        <td>{credit.amount?.toLocaleString()} DH</td>
                        <td>{credit.duration} mois</td>
                        <td>{credit.interestRate || '-'} %</td>
                        <td>
                          <span className={`status-badge status-${credit.status?.toLowerCase()}`}>
                            {getStatusText(credit.status)}
                          </span>
                        </td>
                        <td>{new Date(credit.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>{credit.score || '-'}</td>
                        <td>
                          <button
                              className="btn-details"
                              onClick={() => handleViewDetails(credit)}
                          >
                            Voir détails
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>

          {/* MODALE DES DÉTAILS DU CRÉDIT */}
          {showDetailsModal && selectedCreditDetails && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Détails de la Demande #{selectedCreditDetails.id}</h2>
                    <button className="close-btn" onClick={closeModal}>×</button>
                  </div>

                  <div className="modal-body">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <strong>Client :</strong> {selectedCreditDetails.user?.username || 'Inconnu'}
                      </div>
                      <div className="detail-item">
                        <strong>Montant :</strong> {selectedCreditDetails.amount?.toLocaleString()} DH
                      </div>
                      <div className="detail-item">
                        <strong>Durée :</strong> {selectedCreditDetails.duration} mois
                      </div>
                      <div className="detail-item">
                        <strong>Taux :</strong> {selectedCreditDetails.interestRate || '-'} %
                      </div>
                      <div className="detail-item">
                        <strong>Objet :</strong> {selectedCreditDetails.purpose}
                      </div>
                      <div className="detail-item">
                        <strong>Date :</strong> {new Date(selectedCreditDetails.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="detail-item">
                        <strong>Statut :</strong>
                        <span className={`status-badge ${getStatusClass(selectedCreditDetails.status)}`}>
                        {getStatusText(selectedCreditDetails.status)}
                      </span>
                      </div>
                    </div>

                    {/* Scoring ML */}
                    {selectedCreditDetails.score && (
                        <div className="scoring-section">
                          <h3>Analyse IA (Scoring)</h3>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <strong>Score :</strong> {selectedCreditDetails.score}/850
                            </div>
                            <div className="detail-item">
                              <strong>Risque :</strong> {selectedCreditDetails.riskLevel}
                            </div>
                            <div className="detail-item">
                              <strong>Recommandation IA :</strong> {selectedCreditDetails.recommendation}
                            </div>
                            {selectedCreditDetails.probabilityDefault && (
                                <div className="detail-item">
                                  <strong>Probabilité de défaut :</strong> {(selectedCreditDetails.probabilityDefault * 100).toFixed(1)}%
                                </div>
                            )}
                          </div>
                        </div>
                    )}

                    {/* Commentaire agent */}
                    {selectedCreditDetails.agentNotes && (
                        <div className="agent-comment-section">
                          <h3>Commentaire de l'agent</h3>
                          <p>{selectedCreditDetails.agentNotes}</p>
                        </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button className="btn-close" onClick={closeModal}>Fermer</button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default CreditManagement;