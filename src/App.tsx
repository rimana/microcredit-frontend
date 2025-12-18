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
import Settings from './pages/Admin/SystemSettings'; // À créer

// IMPORTATIONS AJOUTÉES :
import AgentDashboard from './pages/Agent/AgentDashboard'; // Le composant que vous avez créé
import MLTest from './pages/Tools/MLTest'; // Le composant de test ML que vous avez créé
import UniversalOcrScanner from './pages/Credits/UniversalOcrScanner'; // Si vous avez ce composant
import AdminNavbar from './components/Admin/AdminNavbar'; // Pour la navigation admin

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

// Route pour utilisateur seulement (non admin, non agent)
const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role === 'ADMIN' || user.role === 'AGENT') {
        console.warn(`⚠️  User ${user.username} (${user.role}) tried to access user-only route`);
        return <Navigate to="/" />;
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

// Layout pour admin avec navbar
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="admin-layout">
            <AdminNavbar />
            <div className="admin-content">
                {children}
            </div>
        </div>
    );
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
                            path="/admin/*"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <Routes>
                                            <Route path="dashboard" element={<AdminDashboard />} />
                                            <Route path="users" element={<UserManagement />} />
                                            <Route path="credits" element={<AdminCredits />} />
                                            <Route path="statistics" element={<Statistics />} />
                                            <Route path="settings" element={<Settings />} />
                                            {/* Redirection par défaut pour /admin */}
                                            <Route path="" element={<Navigate to="dashboard" />} />
                                        </Routes>
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />

                        {/* Routes AGENT */}
                        <Route
                            path="/agent/dashboard"
                            element={
                                <AgentRoute>
                                    <AgentDashboard />
                                </AgentRoute>
                            }
                        />

                        {/* Routes AGENT (autres) - vous pouvez en ajouter plus tard */}
                        <Route
                            path="/agent/*"
                            element={
                                <AgentRoute>
                                    <Routes>
                                        <Route path="dashboard" element={<AgentDashboard />} />
                                        {/* Vous pouvez ajouter d'autres routes agent ici */}
                                        <Route path="" element={<Navigate to="dashboard" />} />
                                    </Routes>
                                </AgentRoute>
                            }
                        />

                        {/* Routes pour le test ML (accessible aux admin et agents) */}
                        <Route
                            path="/tools/ml-test"
                            element={
                                <ProtectedRoute>
                                    <MLTest />
                                </ProtectedRoute>
                            }
                        />

                        {/* Routes communes */}
                        <Route
                            path="/credit-request"
                            element={
                                <UserRoute>
                                    <CreditRequestForm />
                                </UserRoute>
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
                        <Route
                            path="/ocr-scanner"
                            element={
                                <ProtectedRoute>
                                    <UniversalOcrScanner />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route 404 */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;