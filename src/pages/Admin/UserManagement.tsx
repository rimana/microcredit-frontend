import React, { useState, useEffect } from 'react';
import { UserManagement } from '../../ types/admin';
import { adminAPI } from '../../services/api/admin';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import UserTable from '../../components/Admin/UserTable';
import './Admin.css';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: number, role: string) => {
    try {
      await adminAPI.updateUserRole(userId, role);
      await loadUsers(); // Recharger la liste
    } catch (error) {
      setError('Erreur lors de la mise à jour du rôle');
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await adminAPI.deleteUser(userId);
        await loadUsers(); // Recharger la liste
      } catch (error) {
        setError('Erreur lors de la suppression');
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    filterRole === 'ALL' || user.role === filterRole
  );

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-container">
        <h1 className="admin-page-title">
          👥 Gestion des Utilisateurs
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
              <label>Filtrer par rôle</label>
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="ALL">Tous les rôles</option>
                <option value="CLIENT">Clients</option>
                <option value="AGENT">Agents</option>
                <option value="ADMIN">Administrateurs</option>
              </select>
            </div>
            <div className="filter-group">
              <button onClick={loadUsers} className="btn-primary">
                🔄 Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
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
              <p className="stat-number">
                {users.filter(u => u.role === 'CLIENT').length}
              </p>
            </div>
          </div>
          <div className="admin-card warning">
            <div className="card-icon">🛠️</div>
            <div className="card-content">
              <h3>Agents</h3>
              <p className="stat-number">
                {users.filter(u => u.role === 'AGENT').length}
              </p>
            </div>
          </div>
          <div className="admin-card danger">
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h3>Admins</h3>
              <p className="stat-number">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>

        {/* Table des utilisateurs */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h3>Liste des Utilisateurs ({filteredUsers.length})</h3>
          </div>
          
          {loading ? (
            <div className="admin-loading">
              Chargement des utilisateurs...
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onUpdateRole={handleUpdateRole}
              onDeleteUser={handleDeleteUser}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;