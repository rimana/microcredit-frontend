import React from 'react';
import { useAuth } from '../../context/AuthContext';

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
                            <button onClick={logout}>Déconnexion</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;