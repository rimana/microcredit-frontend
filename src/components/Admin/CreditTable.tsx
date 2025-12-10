import React, { useState } from 'react';
import { CreditDetails } from '../../ types/admin';
import './CreditTable.css';

interface CreditTableProps {
  credits: CreditDetails[];
  onApprove: (creditId: number) => void;
  onReject: (creditId: number, reason?: string) => void;
  loading?: boolean;
}

const CreditTable: React.FC<CreditTableProps> = ({ credits, onApprove, onReject, loading }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CreditDetails;
    direction: 'asc' | 'desc';
  } | null>(null);

  const filteredCredits = credits.filter(credit => 
    filter === 'ALL' || credit.status === filter
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { class: 'badge--warning', icon: 'fa-clock', text: 'En attente' },
      APPROVED: { class: 'badge--success', icon: 'fa-check', text: 'Approuvé' },
      REJECTED: { class: 'badge--danger', icon: 'fa-times', text: 'Rejeté' },
      PAID: { class: 'badge--info', icon: 'fa-check-double', text: 'Payé' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon}`}></i>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <div className="credit-table__loading">Chargement des crédits...</div>;
  }

  return (
    <div className="credit-table">
      <div className="credit-table__header">
        <h3>Gestion des Crédits</h3>
        <div className="credit-table__filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="ALL">Tous les crédits</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvés</option>
            <option value="REJECTED">Rejetés</option>
          </select>
        </div>
      </div>

      <div className="credit-table__container">
        <table className="credit-table__table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Montant</th>
              <th>Durée</th>
              <th>Taux</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCredits.map(credit => (
              <tr key={credit.id}>
                <td>
                  <div className="client-info">
                    <strong>{credit.clientUsername}</strong>
                    <small>{credit.clientEmail}</small>
                  </div>
                </td>
                <td>
                  <span className="amount">
                    {credit.amount.toLocaleString()} €
                  </span>
                </td>
                <td>{credit.duration} mois</td>
                <td>{credit.interestRate}%</td>
                <td>{getStatusBadge(credit.status)}</td>
                <td>
                  {new Date(credit.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div className="credit-actions">
                    {credit.status === 'PENDING' && (
                      <>
                        <button 
                          className="btn btn--sm btn--success"
                          onClick={() => onApprove(credit.id)}
                        >
                          <i className="fas fa-check"></i>
                          Approuver
                        </button>
                        <button 
                          className="btn btn--sm btn--danger"
                          onClick={() => onReject(credit.id)}
                        >
                          <i className="fas fa-times"></i>
                          Rejeter
                        </button>
                      </>
                    )}
                    <button className="btn btn--sm btn--outline">
                      <i className="fas fa-eye"></i>
                      Détails
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditTable;