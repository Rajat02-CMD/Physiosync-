
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Appointment, AppointmentStatus, PaymentStatus, RecoveryLog, Subscription } from '../types';
import { PLANS } from '../constants';
import { 
  Calendar, Plus, Clock, TrendingUp, MessageCircle, 
  CreditCard, ChevronRight, Bell, X, AlertCircle, Info, 
  CheckCircle, Zap, Shield, Crown, RefreshCw, Stethoscope, Heart,
  Activity, Sparkles, BrainCircuit, Bot
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import HealthChat from '../components/HealthChat';
import ExerciseVision from '../components/ExerciseVision';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'message';
  title: string;
  message: string;
  timestamp: string;
}

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<RecoveryLog[]>([
    { id: '1', patientId: '3', date: '2023-10-24', painLevel: 7, mobilityLevel: 3, notes: 'Feeling stiff' },
    { id: '2', patientId: '3', date: '2023-10-25', painLevel: 6, mobilityLevel: 4, notes: 'Better mobility' },
    { id: '3', patientId: '3', date: '2023-10-26', painLevel: 4, mobilityLevel: 6, notes: 'Exercises helped' },
  ]);

  const [appointments] = useState<Appointment[]>([
    { 
      id: 'a1', 
      doctorId: 'd1', 
      patientId: 'p1', 
      date: '2023-11-05', 
      time: '10:00 AM', 
      status: AppointmentStatus.CONFIRMED, 
      paymentStatus: PaymentStatus.SUCCESS, 
      paymentAmount: 45 
    }
  ]);

  const [subscription] = useState<Subscription>({
    id: 's1',
    userId: user?.uid || '',
    planName: 'Recovery',
    expiryDate: '2023-11-20',
    remainingSessions: 5,
    status: 'active'
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'info',
      title: 'Upcoming Appointment',
      message: 'You have a session with your specialist tomorrow at 10:00 AM.',
      timestamp: '2 hours ago'
    },
    {
      id: 'n3',
      type: 'warning',
      title: 'Plan Expiration',
      message: `Your Pack expires in 4 days. Renew now to avoid interruption.`,
      timestamp: '1 day ago'
    }
  ]);

  const [showLogModal, setShowLogModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showAiVision, setShowAiVision] = useState(false);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPlanIcon = (name: string) => {
    switch(name) {
      case 'Pro': return <Crown className="w-5 h-5" />;
      case 'Recovery': return <Zap className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold px-1">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h2>Recent Notifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`relative p-4 rounded-2xl border flex gap-4 transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
                  notif.type === 'warning' 
                    ? 'bg-amber-50 border-amber-100 text-amber-900' 
                    : notif.type === 'message'
                    ? 'bg-blue-50 border-blue-100 text-blue-900'
                    : 'bg-emerald-50 border-emerald-100 text-emerald-900'
                }`}
              >
                <div className="shrink-0 mt-1">
                  {notif.type === 'warning' ? <AlertCircle className="w-5 h-5 text-amber-600" /> : <Info className="w-5 h-5 text-emerald-600" />}
                </div>
                <div className="flex-grow pr-6">
                  <h3 className="font-bold text-sm">{notif.title}</h3>
                  <p className="text-xs opacity-80 leading-relaxed mb-1">{notif.message}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{notif.timestamp}</span>
                </div>
                <button 
                  onClick={() => dismissNotification(notif.id)}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Super-Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div 
            onClick={() => setShowAiVision(true)}
            className="group relative bg-slate-900 rounded-[32px] p-8 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10 transition-all border border-white/5"
          >
           <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <BrainCircuit className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  AI Live Form Check <Sparkles className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Open camera for real-time skeletal analysis & correction.</p>
              </div>
           </div>
         </div>

         <div 
            onClick={() => setShowAiChat(true)}
            className="group relative bg-emerald-600 rounded-[32px] p-8 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/20 transition-all"
          >
           <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">AI Health Assistant</h3>
                <p className="text-emerald-100 text-sm font-medium mt-1">Ask anything about your pain, recovery, or symptoms.</p>
              </div>
           </div>
         </div>
      </div>

      {/* Header & Case Details */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-grow">
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome, {user?.name}!</h1>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Condition: {user?.condition || 'Analyzing...'}</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Assigned Specialist: {user?.assignedDoctorId === 'd1' ? 'Dr. Sarah Smith' : 'Consulting Specialist'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full lg:w-auto self-center">
          <button 
            onClick={() => setShowLogModal(true)}
            className="flex-1 lg:flex-none bg-white text-emerald-600 border border-emerald-100 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <TrendingUp className="w-5 h-5" /> Daily Log
          </button>
          <button 
            onClick={() => setShowBookingModal(true)}
            className="flex-1 lg:flex-none bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-200"
          >
            <Plus className="w-5 h-5" /> Book Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-900">Recovery Analytics</h2>
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-400 rounded-full"></div> Pain Level</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-400 rounded-full"></div> Mobility</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Line type="monotone" dataKey="painLevel" stroke="#ef4444" strokeWidth={4} dot={{ r: 5, fill: '#ef4444' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="mobilityLevel" stroke="#10b981" strokeWidth={4} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar: Appointments & Active Plan */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900">Upcoming</h2>
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            {appointments.map(apt => (
              <div key={apt.id} className="border-l-4 border-emerald-500 pl-4 py-3 mb-4 bg-slate-50 rounded-r-xl">
                <div className="text-sm font-black text-slate-900">{apt.date}</div>
                <div className="text-xs font-bold text-emerald-600 mt-0.5">{apt.time} • Video Consult</div>
              </div>
            ))}
            <button className="w-full text-center text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center justify-center gap-1.5 mt-4">
              View All History <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl overflow-hidden relative group">
             <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
             <div className="flex items-center justify-between mb-6 relative">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30">
                  {getPlanIcon(subscription.planName)}
                </div>
                <h2 className="text-lg font-black tracking-tight">Active Plan</h2>
              </div>
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                {subscription.status}
              </span>
            </div>
            
            <div className="space-y-4 relative">
              <div>
                <div className="text-4xl font-black mb-1">{subscription.planName}</div>
                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-emerald-500" /> Valid until {new Date(subscription.expiryDate).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                  <span className="text-slate-400">Monthly Usage</span>
                  <span className="text-emerald-400">3 / 8 Sessions</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '37.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <MessageCircle />, color: 'blue', title: 'Consultations', desc: 'Secure message your doctor' },
          { icon: <CreditCard />, color: 'purple', title: 'Billing', desc: 'Manage payments & receipts' },
          { icon: <Activity />, color: 'emerald', title: 'Medical History', desc: 'All logs and prescriptions' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-6 group">
            <div className={`w-14 h-14 bg-${item.color}-50 rounded-2xl flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
              {React.cloneElement(item.icon as React.ReactElement, { className: 'w-7 h-7' })}
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New Components */}
      {showAiChat && <HealthChat onClose={() => setShowAiChat(false)} />}
      {showAiVision && <ExerciseVision onClose={() => setShowAiVision(false)} />}

      {/* Log Modal Placeholder */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Daily Recovery Log</h2>
            <div className="space-y-8">
              <div>
                <label className="text-sm font-black text-slate-900 uppercase tracking-widest block mb-4">Pain Level (1-10)</label>
                <input type="range" min="1" max="10" className="w-full accent-emerald-600 h-2 rounded-full" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowLogModal(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest transition">Cancel</button>
                <button onClick={() => setShowLogModal(false)} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-200">Save Progress</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
