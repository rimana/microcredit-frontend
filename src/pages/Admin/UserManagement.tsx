import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api/admin';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import UserTable from '../../components/Admin/UserTable';
import './Admin.css';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (error: any) {
      console.error('Erreur chargement utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs : ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: number, role: string) => {
    try {
      await adminAPI.updateUserRole(userId, role);
      await loadUsers();
    } catch (error) {
      setError('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await adminAPI.deleteUser(userId);
        await loadUsers();
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const filteredUsers = filterRole === 'ALL'
      ? users
      : users.filter(user => user.role === filterRole);

  return (
      <div className="admin-layout">
        <AdminNavbar />
        <div className="admin-container">
          <h1 className="admin-page-title">👥 Gestion des Utilisateurs</h1>

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Filtrer par rôle</label>
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                  <option value="ALL">Tous les rôles</option>
                  <option value="CLIENT">Clients</option>
                  <option value="AGENT">Agents</option>
                  <option value="ADMIN">Administrateurs</option>
                </select>
              </div>
              <button onClick={loadUsers} className="btn-primary">
                🔄 Actualiser
              </button>
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-card primary">
              <div className="card-icon">👥</div>
              <div className="card-content">
                <h3>Total Utilisateurs</h3>
                <p className="stat-number">{users.length}</p>
              </div>
            </div>
            <div className="admin-card success">
              <div className="card-icon">👤</div>
              <div className="card-content">
                <h3>Clients</h3>
                <p className="stat-number">{users.filter(u => u.role === 'CLIENT').length}</p>
              </div>
            </div>
            <div className="admin-card warning">
              <div className="card-icon">🛠️</div>
              <div className="card-content">
                <h3>Agents</h3>
                <p className="stat-number">{users.filter(u => u.role === 'AGENT').length}</p>
              </div>
            </div>
            <div className="admin-card danger">
              <div className="card-icon">⚡</div>
              <div className="card-content">
                <h3>Admins</h3>
                <p className="stat-number">{users.filter(u => u.role === 'ADMIN').length}</p>
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <div className="admin-table-header">
              <h3>Liste des Utilisateurs ({filteredUsers.length})</h3>
            </div>

            <UserTable
                users={filteredUsers}
                onUpdateRole={handleUpdateRole}
                onDeleteUser={handleDeleteUser}
                loading={loading}
            />
          </div>
        </div>
      </div>
  );
};

export default UserManagementPage;