
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickLogin = () => {
    setEmail('admin@physio.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 font-bold text-2xl mb-10 justify-center">
            <Activity className="w-8 h-8" />
            <span>PhysioSync</span>
          </Link>

          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-8">Login to manage your health journey.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="admin@physio.com or user email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold">Password</label>
                <Link to="#" className="text-xs text-emerald-600 hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
             <div className="text-sm text-slate-500">
               Don't have an account? <Link to="/signup" className="text-emerald-600 font-bold hover:underline">Create Account</Link>
             </div>
             
             <div className="w-full">
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest">Administrator Portal</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                </div>
                <button 
                  onClick={handleAdminQuickLogin}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all group"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  Quick Fill Admin Credentials
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
