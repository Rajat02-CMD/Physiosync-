
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';
import { Navbar } from '../components/Layout';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600 w-12 h-12" />
      </div>
    );
  }

  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.ADMIN: return <AdminDashboard />;
      case UserRole.DOCTOR: return <DoctorDashboard />;
      case UserRole.PATIENT: return <PatientDashboard />;
      default: return <div>Unauthorized</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
