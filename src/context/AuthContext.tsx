import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User  } from '../ types/auth';
import { authService } from '../services/api/auth';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const response = await authService.login({ username, password });

        localStorage.setItem('token', response.token);
        const userData: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            role: response.role,
            phone: '',
            cin: '',
            address: '',
            employed: false
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = async (userData: any) => {
        await authService.register(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};