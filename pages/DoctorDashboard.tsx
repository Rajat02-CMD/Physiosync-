
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Appointment, AppointmentStatus, PaymentStatus } from '../types';
import { 
  Users, CalendarCheck, DollarSign, Activity, Search, Filter, 
  MoreVertical, BrainCircuit, Calendar as CalendarIcon, Clock, 
  ChevronLeft, ChevronRight, Check, Lock, Unlock 
} from 'lucide-react';
import { generateExercisePlan } from '../services/geminiService';

type DashboardTab = 'patients' | 'appointments' | 'availability';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('patients');
  const [patients] = useState<Partial<User>[]>([
    { uid: 'p1', name: 'John Doe', age: 34, email: 'john@example.com' },
    { uid: 'p2', name: 'Jane Smith', age: 28, email: 'jane@example.com' },
  ]);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Mock availability: key is date string, value is array of available hour strings or 'BLOCKED'
  const [availability, setAvailability] = useState<{ [key: string]: string[] | 'BLOCKED' }>({
    '2023-11-05': ['09:00', '10:00', '11:00', '14:00', '15:00'],
    '2023-11-06': 'BLOCKED',
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any[] | null>(null);

  const handleAiPrescribe = async () => {
    setAiLoading(true);
    const result = await generateExercisePlan("ACL Tear Post-Op", 6);
    setAiResult(result);
    setAiLoading(false);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const toggleSlot = (time: string) => {
    setAvailability(prev => {
      const current = prev[selectedDate];
      if (current === 'BLOCKED') return prev;
      const slots = current || [];
      const newSlots = slots.includes(time) 
        ? slots.filter(s => s !== time) 
        : [...slots, time].sort();
      return { ...prev, [selectedDate]: newSlots };
    });
  };

  const toggleBlockDay = () => {
    setAvailability(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate] === 'BLOCKED' ? [] : 'BLOCKED'
    }));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-20" />);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const status = availability[dateStr];
      const isBlocked = status === 'BLOCKED';
      const hasSlots = Array.isArray(status) && status.length > 0;

      days.push(
        <button
          key={d}
          onClick={() => setSelectedDate(dateStr)}
          className={`h-20 border border-slate-50 p-2 flex flex-col items-start transition-all relative ${
            isSelected ? 'bg-emerald-50 ring-2 ring-emerald-500 ring-inset z-10' : 'hover:bg-slate-50'
          }`}
        >
          <span className={`text-sm font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>{d}</span>
          <div className="mt-auto w-full flex flex-wrap gap-1">
            {isBlocked ? (
              <div className="w-full bg-red-100 text-red-600 text-[8px] font-bold px-1 rounded flex items-center justify-center py-0.5">
                BLOCKED
              </div>
            ) : hasSlots ? (
              <div className="w-full bg-emerald-100 text-emerald-600 text-[8px] font-bold px-1 rounded flex items-center justify-center py-0.5">
                {status.length} SLOTS
              </div>
            ) : null}
          </div>
        </button>
      );
    }
    return days;
  };

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Active Patients</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black">24</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Sessions Today</span>
            <CalendarCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black">8</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Earnings</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black">$3,450</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Rating</span>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-black">4.9/5</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-3 font-semibold transition relative ${activeTab === 'patients' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          My Patients
          {activeTab === 'patients' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-3 font-semibold transition relative ${activeTab === 'appointments' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          Appointments
          {activeTab === 'appointments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-3 font-semibold transition relative ${activeTab === 'availability' ? 'text-emerald-600' : 'text-slate-500'}`}
        >
          Availability
          {activeTab === 'availability' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />}
        </button>
      </div>

      {activeTab === 'patients' && (
        <>
          {/* Gemini AI Helper Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-200">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-6 h-6" />
                <h2 className="text-xl font-bold">AI Exercise Assistant</h2>
              </div>
              <p className="opacity-90">Let Gemini suggest a starting exercise protocol based on patient data. Always review before prescribing.</p>
            </div>
            <button 
              onClick={handleAiPrescribe}
              disabled={aiLoading}
              className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition shrink-0 flex items-center gap-2 disabled:opacity-50"
            >
              {aiLoading ? "Thinking..." : "Generate Plan"}
            </button>
          </div>

          {aiResult && (
            <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BrainCircuit className="text-emerald-600" /> Suggested Exercises
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiResult.map((ex, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl">
                      <div className="font-bold text-emerald-600 mb-1">{ex.title}</div>
                      <div className="text-xs text-slate-500 mb-2">{ex.duration}</div>
                      <p className="text-sm text-slate-600">{ex.description}</p>
                    </div>
                  ))}
              </div>
              <button onClick={() => setAiResult(null)} className="mt-4 text-xs text-slate-400 hover:underline">Clear AI results</button>
            </div>
          )}

          {/* Patient List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Patient Overview</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm font-medium">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Recovery Level</th>
                    <th className="px-6 py-4">Next Session</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map(p => (
                    <tr key={p.uid} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                            {p.name?.[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.age} years • {p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">Active</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div className="bg-emerald-500 h-full" style={{ width: '65%' }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">Nov 5, 10:00 AM</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'availability' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CalendarIcon className="text-emerald-600 w-5 h-5" />
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-inner">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-slate-50 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
                <div className="col-span-7 grid grid-cols-7 bg-white">
                  {renderCalendar()}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-emerald-800 text-sm flex gap-3">
              <Activity className="w-5 h-5 shrink-0" />
              <p>Your patients can only see and book slots that you mark as available here. Blocking a date will cancel all pending requests for that day.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Slots for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
                <button 
                  onClick={toggleBlockDay}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    availability[selectedDate] === 'BLOCKED' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {availability[selectedDate] === 'BLOCKED' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {availability[selectedDate] === 'BLOCKED' ? 'Unblock Day' : 'Block Day'}
                </button>
              </div>

              {availability[selectedDate] === 'BLOCKED' ? (
                <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold">This day is completely blocked.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map(time => {
                    const isActive = Array.isArray(availability[selectedDate]) && (availability[selectedDate] as string[]).includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => toggleSlot(time)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          isActive 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          {time}
                        </div>
                        {isActive && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                  Save Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="p-12 text-center text-slate-400">
             <CalendarCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <h3 className="text-lg font-bold text-slate-900 mb-1">No pending appointments</h3>
             <p>All appointment requests have been processed.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
