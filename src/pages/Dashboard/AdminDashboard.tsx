import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import StatCard from '../../components/Admin/StatCard';
import { AdminStats } from '../../ types/admin';
import { adminAPI } from '../../services/api/admin';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getOverviewStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminNavbar />
        <div className="admin-content">
          <div className="loading">Chargement du dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        <div className="dashboard">
          <h1>Dashboard Administrateur</h1>
          
          {stats && (
            <div className="stats-grid">
              <StatCard
                title="Total Utilisateurs"
                value={stats.totalUsers}
                icon="fa-users"
                color="primary"
              />
              <StatCard
                title="Clients Actifs"
                value={stats.activeClients}
                icon="fa-user-check"
                color="success"
              />
              <StatCard
                title="Crédits en Attente"
                value={stats.pendingCredits}
                icon="fa-clock"
                color="warning"
              />
              <StatCard
                title="Montant Total"
                value={`${stats.totalAmount.toLocaleString()} DH`}
                icon="fa-euro-sign"
                color="success"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;