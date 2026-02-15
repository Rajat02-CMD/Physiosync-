
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Activity, Mail, Lock, User, ArrowRight, Loader2, Stethoscope, HeartPulse } from 'lucide-react';

const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || UserRole.PATIENT;

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ name, email, role });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 font-bold text-2xl mb-10 justify-center">
            <Activity className="w-8 h-8" />
            <span>PhysioSync</span>
          </Link>

          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500 mb-8">Join the community of modern healthcare.</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <button 
              type="button"
              onClick={() => setRole(UserRole.PATIENT)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === UserRole.PATIENT ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-100 grayscale opacity-60'}`}
            >
              <HeartPulse className="w-8 h-8" />
              <span className="font-bold">Patient</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole(UserRole.DOCTOR)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === UserRole.DOCTOR ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-100 grayscale opacity-60'}`}
            >
              <Stethoscope className="w-8 h-8" />
              <span className="font-bold">Doctor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {role === UserRole.DOCTOR && (
              <div className="bg-amber-50 p-4 rounded-xl text-amber-700 text-xs flex gap-3 border border-amber-100">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <p>Note: Doctor registrations require manual approval by the admin before you can access the dashboard features. This usually takes 24-48 hours.</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Signup <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldAlert = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
  </svg>
);

export default Signup;
