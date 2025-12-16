import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import CreditRequestForm from './pages/Credits/CreditRequestForm';
import CreditList from './pages/Credits/CreditList';
import Profile from './pages/Profile/Profile';
// Importez les nouveaux composants dont vous avez besoin
import UserManagement from './pages/Admin/UserManagement'; // À créer
import AdminCredits from './pages/Admin/CreditManagement'; // À créer
import Statistics from './pages/Admin/Statistics';
import Settings from './pages/Admin/SystemSettings';// À créer
import './App.css';

// Route protégée standard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" />;
};

// Route pour admin seulement
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'ADMIN') {
        // Rediriger vers le dashboard approprié
        console.warn(`⚠️  User ${user.username} (${user.role}) tried to access admin route`);

        if (user.role === 'AGENT') {
            return <Navigate to="/agent/dashboard" />;
        }
        return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
};

// Route pour agent seulement
const AgentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'AGENT' && user.role !== 'ADMIN') {
        console.warn(`⚠️  User ${user.username} (${user.role}) tried to access agent route`);
        return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
};

// Composant pour la redirection automatique
const RoleBasedRedirect: React.FC = () => {
    const { user } = useAuth();

    console.log('🔄 RoleBasedRedirect - Current user:', user?.username, 'Role:', user?.role);

    if (!user) {
        return <Navigate to="/login" />;
    }

    switch (user.role) {
        case 'ADMIN':
            return <Navigate to="/admin/dashboard" />;
        case 'AGENT':
            return <Navigate to="/agent/dashboard" />;
        default:
            return <Navigate to="/dashboard" />;
    }
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        {/* Routes protégées selon rôle */}
                        <Route path="/" element={<RoleBasedRedirect />} />

                        {/* Dashboard client */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <UserDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Routes ADMIN */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        {/* AJOUTEZ CES ROUTES MANQUANTES */}
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <UserManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/credits"
                            element={
                                <AdminRoute>
                                    <AdminCredits />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/statistics"
                            element={
                                <AdminRoute>
                                    <Statistics />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/settings"
                            element={
                                <AdminRoute>
                                    <Settings />
                                </AdminRoute>
                            }
                        />

                        {/* Routes communes */}
                        <Route
                            path="/credit-request"
                            element={
                                <ProtectedRoute>
                                    <CreditRequestForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-credits"
                            element={
                                <ProtectedRoute>
                                    <CreditList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;