import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminNavbar.css';

const AdminNavbar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="admin-navbar">
            <div className="navbar-header">
                <h2>Admin Panel</h2>
                <div className="user-info">
                    <span>👤 {user?.username}</span>
                    <button onClick={logout} className="logout-btn">
                        Déconnexion
                    </button>
                </div>
            </div>
            
            <div className="navbar-menu">
                <Link 
                    to="/admin/dashboard" 
                    className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
                >
                    📊 Dashboard
                </Link>
                
                <Link 
                    to="/admin/users" 
                    className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
                >
                    👥 Gestion Utilisateurs
                </Link>
                
                <Link 
                    to="/admin/credits" 
                    className={`nav-item ${isActive('/admin/credits') ? 'active' : ''}`}
                >
                    💰 Gestion Crédits
                </Link>
                
                <Link 
                    to="/admin/settings" 
                    className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`}
                >
                    ⚙️ Paramètres
                </Link>
            </div>
        </nav>
    );
};

export default AdminNavbar;