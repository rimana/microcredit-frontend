import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../ types/auth';
import { authService } from '../services/api/auth';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<User>; // Change: retourne Promise<User>
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
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                console.log('✅ User restored from localStorage:', parsedUser.username, 'Role:', parsedUser.role);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<User> => {
        console.log('🔐 Login attempt for:', username);

        try {
            const response = await authService.login({ username, password });

            console.log('✅ Login response received:', {
                token: response.token ? '✓' : '✗',
                username: response.username,
                role: response.role
            });

            // Stocker le token
            localStorage.setItem('token', response.token);

            // Créer l'objet utilisateur complet
            const userData: User = {
                id: response.id,
                username: response.username,
                email: response.email,
                role: response.role,
                phone: response.phone || '',
                cin: response.cin || '',
                address: response.address || '',
                employed: response.employed || false,
                monthlyIncome: response.monthlyIncome,
                profession: response.profession,
                fullname: response.fullname
            };

            // Stocker l'utilisateur
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            console.log('🎉 User logged in successfully:', userData.username, 'Role:', userData.role);

            return userData; // IMPORTANT: Retourner l'utilisateur

        } catch (error: any) {
            console.error('❌ Login error:', error.message);
            throw error;
        }
    };

    const register = async (userData: any) => {
        await authService.register(userData);
    };

    const logout = () => {
        console.log('🚪 Logging out user:', user?.username);
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