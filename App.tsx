
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  // Doctor approval check
  if (user.role === UserRole.DOCTOR && !user.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center bg-emerald-50">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md border border-emerald-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Approval Pending</h2>
          <p className="text-slate-600 leading-relaxed">Your professional profile is being reviewed by our medical board. You will receive an email once your account is activated.</p>
        </div>
      </div>
    );
  }

  // Patient onboarding check
  if (user.role === UserRole.PATIENT && !user.condition) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
