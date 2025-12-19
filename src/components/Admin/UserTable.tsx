import React from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  profession: string;
  role: string;
  monthlyIncome?: number;
  employed?: boolean;
  cin?: string;
  address?: string;
}

interface UserTableProps {
  users: User[];
  onUpdateRole: (userId: number, role: string) => void;
  onDeleteUser: (userId: number) => void;
  loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onUpdateRole, onDeleteUser, loading }) => {
  if (loading) {
    return <div className="admin-loading">Chargement des utilisateurs...</div>;
  }

  return (
      <table className="users-table">
        <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Profession</th>
          <th>Revenu Mensuel</th>
          <th>Employé</th>
          <th>CIN</th>
          <th>Adresse</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone || '-'}</td>
              <td>{user.profession || '-'}</td>
              <td>{user.monthlyIncome?.toLocaleString() || '-'} DH</td>
              <td>{user.employed ? 'Oui' : 'Non'}</td>
              <td>{user.cin || '-'}</td>
              <td>{user.address || '-'}</td>
              <td>
                <select
                    value={user.role}
                    onChange={(e) => onUpdateRole(user.id, e.target.value)}
                    className="role-select"
                >
                  <option value="CLIENT">Client</option>
                  <option value="AGENT">Agent</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td>
                <button
                    className="btn-danger"
                    onClick={() => onDeleteUser(user.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
        ))}
        </tbody>
      </table>
  );
};

export default UserTable;