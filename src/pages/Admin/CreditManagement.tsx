import React, { useState, useEffect } from 'react';
import { creditService } from '../../services/api/credit';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import './Admin.css';

const CreditManagement: React.FC = () => {
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await creditService.getAllCreditRequests(); // ← Utilise la bonne méthode
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
                        {credit.status}
                      </span>
                        </td>
                        <td>{new Date(credit.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>{credit.score || '-'}</td>
                        <td>
                          <button onClick={() => alert(`Détails du crédit #${credit.id}`)}>
                            Voir détails
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
  );
};

export default CreditManagement;