
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <Activity className="w-8 h-8" />
            <span>PhysioSync</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium">Login</Link>
                <Link to="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">Get Started</Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-1">
                  <User className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="text-slate-600 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-b px-4 pb-4 flex flex-col gap-3">
           {!user ? (
              <>
                <Link to="/login" className="block text-slate-600 py-2">Login</Link>
                <Link to="/signup" className="block bg-emerald-600 text-white text-center py-2 rounded-lg">Get Started</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block text-slate-600 py-2">Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-red-600 py-2">Logout</button>
              </>
            )}
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-slate-400 py-12">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
          <Activity className="w-6 h-6 text-emerald-500" />
          <span>PhysioSync</span>
        </div>
        <p className="text-sm">Modernizing physiotherapy through technology and continuous care.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Features</h4>
        <ul className="space-y-2 text-sm">
          <li>Remote Monitoring</li>
          <li>Exercise Prescription</li>
          <li>Real-time Chat</li>
          <li>Verified Doctors</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Portals</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/signup?role=PATIENT" className="hover:text-emerald-500 transition">Patient Portal</Link></li>
          <li><Link to="/signup?role=DOCTOR" className="hover:text-emerald-500 transition">Doctor Portal</Link></li>
          <li className="pt-2">
            <Link to="/login" className="flex items-center gap-2 text-emerald-500 font-bold hover:underline">
              <ShieldCheck className="w-4 h-4" /> Admin Login
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Company</h4>
        <ul className="space-y-2 text-sm">
          <li>About Us</li>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-slate-800 text-center text-xs">
      &copy; {new Date().getFullYear()} PhysioSync. All rights reserved.
    </div>
  </footer>
);
