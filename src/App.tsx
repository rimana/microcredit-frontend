import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import UserDashboard from './pages/Dashboard/UserDashboard';
import CreditRequestForm from './pages/Credits/CreditRequestForm';
import CreditList from './pages/Credits/CreditList';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
              />
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
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;