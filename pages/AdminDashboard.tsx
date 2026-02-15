
import React, { useState } from 'react';
import { User, UserRole, PaymentStatus, ExercisePlan } from '../types';
import { 
  ShieldAlert, Check, X, Users, Settings, BarChart3, Search, 
  Stethoscope, CreditCard, ClipboardList, TrendingUp, Filter,
  MoreVertical, ExternalLink, Activity, ShieldCheck
} from 'lucide-react';

type AdminTab = 'overview' | 'doctors' | 'patients' | 'payments' | 'prescriptions';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Mock Data for Admin View
  const [pendingDoctors, setPendingDoctors] = useState<User[]>([
    { uid: 'd100', name: 'Dr. Michael Chen', email: 'mchen@physio.com', role: UserRole.DOCTOR, approved: false, specialty: 'Sports Medicine' },
    { uid: 'd101', name: 'Dr. Lisa Wong', email: 'lwong@physio.com', role: UserRole.DOCTOR, approved: false, specialty: 'Neurological Rehab' },
  ]);

  const [allDoctors] = useState<User[]>([
    { uid: 'd1', name: 'Dr. Sarah Smith', email: 'sarah@physio.com', role: UserRole.DOCTOR, approved: true, specialty: 'Orthopedics' },
    { uid: 'd2', name: 'Dr. James Wilson', email: 'james@physio.com', role: UserRole.DOCTOR, approved: true, specialty: 'Pediatrics' },
  ]);

  const [allPatients] = useState<User[]>([
    { uid: 'p1', name: 'John Doe', email: 'john@example.com', role: UserRole.PATIENT, approved: true, age: 34 },
    { uid: 'p2', name: 'Jane Smith', email: 'jane@example.com', role: UserRole.PATIENT, approved: true, age: 28 },
    { uid: 'p3', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: UserRole.PATIENT, approved: true, age: 45 },
  ]);

  const [payments] = useState<any[]>([
    { id: 'PAY-8821', userName: 'John Doe', plan: 'Recovery', amount: 2499, status: PaymentStatus.SUCCESS, date: '2023-10-25' },
    { id: 'PAY-8822', userName: 'Jane Smith', plan: 'Pro', amount: 4999, status: PaymentStatus.SUCCESS, date: '2023-10-24' },
    { id: 'PAY-8823', userName: 'Rajesh Kumar', plan: 'Basic', amount: 999, status: PaymentStatus.PENDING, date: '2023-10-26' },
  ]);

  const [prescriptions] = useState<ExercisePlan[]>([
    { id: 'ex_1', patientId: 'p1', doctorId: 'd1', title: 'Lumbar Support Routine', description: 'Daily stretches for chronic back pain', duration: '15 mins', datePrescribed: '2023-10-24' },
    { id: 'ex_2', patientId: 'p2', doctorId: 'd2', title: 'Wrist Mobility Phase 1', description: 'Gentle rotations and grip strengthening', duration: '10 mins', datePrescribed: '2023-10-25' },
  ]);

  const handleApprove = (uid: string) => {
    setPendingDoctors(prev => prev.filter(d => d.uid !== uid));
    alert("Doctor credentials verified and approved.");
  };

  const handleReject = (uid: string) => {
    setPendingDoctors(prev => prev.filter(d => d.uid !== uid));
    alert("Doctor application has been rejected.");
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'doctors', label: 'Doctors', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <ClipboardList className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Revenue (MTD)', value: '₹1,24,500', icon: <TrendingUp className="text-emerald-600" />, trend: '+12% vs last month' },
                { label: 'Active Doctors', value: '42', icon: <Stethoscope className="text-blue-600" />, trend: '4 pending approval' },
                { label: 'Registered Patients', value: '856', icon: <Users className="text-purple-600" />, trend: '+24 this week' },
                { label: 'Prescriptions', value: '1,204', icon: <Activity className="text-rose-600" />, trend: 'Across all specialties' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                    <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{stat.trend}</div>
                </div>
              ))}
            </div>

            {pendingDoctors.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-amber-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-amber-50 bg-amber-50/30 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600" /> Verify Medical Professionals
                  </h2>
                  <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                    {pendingDoctors.length} Action Needed
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Practitioner</th>
                        <th className="px-6 py-4">Specialty</th>
                        <th className="px-6 py-4">Application Date</th>
                        <th className="px-6 py-4 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingDoctors.map(doctor => (
                        <tr key={doctor.uid} className="hover:bg-amber-50/20 transition group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{doctor.name}</div>
                            <div className="text-xs text-slate-500">{doctor.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-md font-bold border border-blue-100">
                              {doctor.specialty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">Oct 26, 2023</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleApprove(doctor.uid)}
                                className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition shadow-sm"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(doctor.uid)}
                                className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition shadow-sm"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'doctors':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Verified Professionals</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by name or specialty..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Total Patients</th>
                    <th className="px-6 py-4 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allDoctors.map(doc => (
                    <tr key={doc.uid} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-black text-xs">
                            {doc.name.split(' ')[1]?.[0] || 'D'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">{doc.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{doc.specialty}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black">
                          <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">48</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-300 hover:text-slate-600 transition"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Patient Directory</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">Active Plan</th>
                    <th className="px-6 py-4">Join Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allPatients.map(pat => (
                    <tr key={pat.uid} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{pat.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{pat.uid}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{pat.age} yrs</td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">RECOVERY</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-medium">Jan 12, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-300 hover:text-slate-600 transition"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Financial Records</h2>
              <div className="flex gap-2">
                 <button className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5" /> Filter
                 </button>
                 <button className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 shadow-lg shadow-emerald-100">
                    <ExternalLink className="w-3.5 h-3.5" /> Export Report
                 </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Ref ID</th>
                    <th className="px-6 py-4">Payer</th>
                    <th className="px-6 py-4">Plan Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400 font-bold">{pay.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{pay.userName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{pay.plan}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">₹{pay.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border ${
                          pay.status === PaymentStatus.SUCCESS 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{pay.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'prescriptions':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Treatment Audit Logs</h2>
              <span className="text-slate-400 text-xs font-medium">Tracking doctor-to-patient exercise assignments</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Exercise Module</th>
                    <th className="px-6 py-4">Assignee (Patient)</th>
                    <th className="px-6 py-4">Prescriber (Doctor)</th>
                    <th className="px-6 py-4">Issued On</th>
                    <th className="px-6 py-4">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescriptions.map(pres => {
                    const patient = allPatients.find(p => p.uid === pres.patientId);
                    const doctor = allDoctors.find(d => d.uid === pres.doctorId);
                    return (
                      <tr key={pres.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-emerald-700 text-sm">{pres.title}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{pres.description}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{patient?.name || 'Unknown Patient'}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{doctor?.name || 'Unknown Doctor'}</td>
                        <td className="px-6 py-4 text-xs text-slate-400">{pres.datePrescribed}</td>
                        <td className="px-6 py-4">
                           <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase">
                              {pres.duration}
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Control</h1>
          <p className="text-slate-500 font-medium">Welcome back, Admin. Managing the future of physiotherapy.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto backdrop-blur-md">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl scale-105 z-10' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Rendering Area */}
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>

      {/* Footer System Status Bar */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-200 mt-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="flex items-center gap-6 relative">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <Settings className="w-7 h-7 text-emerald-400 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-wide">System Health: Optimal</h3>
            <p className="text-slate-400 text-sm">All core services, database connections, and AI models are running smoothly.</p>
          </div>
        </div>
        <div className="flex gap-4 relative">
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition border border-white/10">System Logs</button>
          <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-xl shadow-emerald-500/20">Check Updates</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
