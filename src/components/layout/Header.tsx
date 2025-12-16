import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; // Ajoutez cette importation

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <h1>MicroCrédit Platform</h1>
                <nav>
                    {user && (
                        <div className="user-menu">
                            <span>Bonjour, {user.username}</span>
                            {/* Ajoutez le lien vers le profil */}
                            <Link to="/profile" className="profile-link">
                                Mon Profil
                            </Link>
                            <button onClick={logout}>Déconnexion</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;