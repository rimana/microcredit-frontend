import React, { useState } from 'react';
import { UserManagement } from '../../ types/admin';
import './UserTable.css';

interface UserTableProps {
  users: UserManagement[];
  onUpdateRole: (userId: number, role: string) => void;
  onDeleteUser: (userId: number) => void;
  loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onUpdateRole, onDeleteUser, loading }) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserManagement;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: keyof UserManagement) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig) return users;

    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.length ? [] : users.map(user => user.id)
    );
  };

  if (loading) {
    return <div className="user-table__loading">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="user-table">
      <div className="user-table__header">
        <h3>Gestion des Utilisateurs ({users.length})</h3>
        {selectedUsers.length > 0 && (
          <div className="user-table__actions">
            <span>{selectedUsers.length} sélectionné(s)</span>
            <button className="btn btn--danger btn--sm">
              Supprimer la sélection
            </button>
          </div>
        )}
      </div>

      <div className="user-table__container">
        <table className="user-table__table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('username')}>
                Nom d'utilisateur
                <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleSort('email')}>
                Email
                <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleSort('role')}>
                Rôle
                <i className="fas fa-sort"></i>
              </th>
              <th>Téléphone</th>
              <th onClick={() => handleSort('creditCount')}>
                Crédits
                <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleSort('totalBorrowedAmount')}>
                Montant Total
                <i className="fas fa-sort"></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>
                  <div className="user-info">
                    <strong>{user.username}</strong>
                    <small>{user.cin}</small>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => onUpdateRole(user.id, e.target.value)}
                    className={`role-select role-select--${user.role.toLowerCase()}`}
                  >
                    <option value="CLIENT">Client</option>
                    <option value="AGENT">Agent</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>{user.phone}</td>
                <td>
                  <span className="badge badge--info">
                    {user.creditCount}
                  </span>
                </td>
                <td>
                  <span className="amount">
                    {user.totalBorrowedAmount.toLocaleString()} €
                  </span>
                </td>
                <td>
                  <div className="user-actions">
                    <button className="btn btn--sm btn--outline">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn btn--sm btn--outline">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn btn--sm btn--danger"
                      onClick={() => onDeleteUser(user.id)}
                      disabled={user.role === 'ADMIN'}
                    >
                      <i className="fas fa-trash"></i>
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

export default UserTable;