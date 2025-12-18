import React, { useState, useEffect } from 'react';
import { CreditDetails } from '../../ types/admin';
import { adminAPI } from '../../services/api/admin';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import CreditTable from '../../components/Admin/CreditTable';
import './Admin.css';

const CreditManagement: React.FC = () => {
  const [credits, setCredits] = useState<CreditDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllCredits();
      setCredits(data);
    } catch (error) {
      setError('Erreur lors du chargement des crédits');
      console.error('Error loading credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCredit = async (creditId: number) => {
    try {
      await adminAPI.approveCredit(creditId);
      await loadCredits(); // Recharger la liste
    } catch (error) {
      setError('Erreur lors de l\'approbation');
      console.error('Error approving credit:', error);
    }
  };

  const handleRejectCredit = async (creditId: number, reason?: string) => {
    const rejectionReason = reason || prompt('Motif du rejet (optionnel):') || undefined;
    
    try {
      await adminAPI.rejectCredit(creditId, rejectionReason);
      await loadCredits(); // Recharger la liste
    } catch (error) {
      setError('Erreur lors du rejet');
      console.error('Error rejecting credit:', error);
    }
  };

  const filteredCredits = credits.filter(credit => 
    filterStatus === 'ALL' || credit.status === filterStatus
  );

  const calculateStats = () => {
    const totalAmount = credits.reduce((sum, credit) => sum + credit.amount, 0);
    const pendingAmount = credits
      .filter(c => c.status === 'PENDING')
      .reduce((sum, credit) => sum + credit.amount, 0);
    const approvedAmount = credits
      .filter(c => c.status === 'APPROVED')
      .reduce((sum, credit) => sum + credit.amount, 0);

    return { totalAmount, pendingAmount, approvedAmount };
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

        {/* Filtres */}
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
                <option value="PAID">Payés</option>
              </select>
            </div>
            <div className="filter-group">
              <button onClick={loadCredits} className="btn-primary">
                🔄 Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="admin-stats-grid stats-four-cols">
          <div className="admin-card primary">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Total Crédits</h3>
              <p className="stat-number">{credits.length}</p>
            </div>
          </div>
          <div className="admin-card warning">
            <div className="card-icon">⏳</div>
            <div className="card-content">
              <h3>En Attente</h3>
              <p className="stat-number">
                {credits.filter(c => c.status === 'PENDING').length}
              </p>
            </div>
          </div>
          <div className="admin-card success">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h3>Approuvés</h3>
              <p className="stat-number">
                {credits.filter(c => c.status === 'APPROVED').length}
              </p>
            </div>
          </div>
          <div className="admin-card danger">
            <div className="card-icon">❌</div>
            <div className="card-content">
              <h3>Rejetés</h3>
              <p className="stat-number">
                {credits.filter(c => c.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques montants */}
        <div className="admin-stats-grid stats-three-cols">
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

        {/* Table des crédits */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h3>Liste des Demandes de Crédit ({filteredCredits.length})</h3>
          </div>
          
          {loading ? (
            <div className="admin-loading">
              Chargement des crédits...
            </div>
          ) : (
            <CreditTable
              credits={filteredCredits}
              onApprove={handleApproveCredit}
              onReject={handleRejectCredit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditManagement;