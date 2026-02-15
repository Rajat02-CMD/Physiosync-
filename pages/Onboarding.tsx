
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';
import { 
  Activity, 
  ChevronRight, 
  Stethoscope, 
  CheckCircle, 
  Bone, 
  Zap, 
  Brain, 
  Dumbbell,
  ArrowLeft
} from 'lucide-react';

const CONDITIONS = [
  { id: 'ortho', title: 'Orthopedic / Bone', icon: <Bone />, specialty: 'Orthopedics', desc: 'Joint pain, fractures, or post-surgery recovery.' },
  { id: 'neuro', title: 'Neurological', icon: <Brain />, specialty: 'Neurology', desc: 'Stroke recovery, Parkinson\'s, or nerve damage.' },
  { id: 'sports', title: 'Sports Injury', icon: <Dumbbell />, specialty: 'Sports Medicine', desc: 'ACL tears, muscle strains, or performance rehab.' },
  { id: 'geriatric', title: 'Geriatric Care', icon: <Activity />, specialty: 'Geriatrics', desc: 'Age-related mobility and balance improvement.' },
];

const MOCK_DOCTORS: Partial<User>[] = [
  { uid: 'd1', name: 'Dr. Sarah Smith', specialty: 'Orthopedics', approved: true },
  { uid: 'd2', name: 'Dr. James Wilson', specialty: 'Neurology', approved: true },
  { uid: 'd3', name: 'Dr. Elena Rodriguez', specialty: 'Sports Medicine', approved: true },
  { uid: 'd4', name: 'Dr. Amit Shah', specialty: 'Orthopedics', approved: true },
];

const Onboarding: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<typeof CONDITIONS[0] | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const handleComplete = () => {
    if (selectedCondition && selectedDoctorId) {
      updateUser({
        condition: selectedCondition.title,
        assignedDoctorId: selectedDoctorId
      });
      navigate('/dashboard');
    }
  };

  const filteredDoctors = MOCK_DOCTORS.filter(d => 
    selectedCondition ? d.specialty === selectedCondition.specialty : true
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="flex h-2 bg-slate-100">
          <div className={`h-full bg-emerald-500 transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        <div className="p-8 md:p-12">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-black text-slate-900 mb-2">What brings you to PhysioSync?</h1>
              <p className="text-slate-500 mb-10">Select the area that best describes your current health concern.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCondition(c);
                      setStep(2);
                    }}
                    className="flex items-start gap-4 p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
                  >
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                      {c.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{c.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => setStep(1)} 
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to conditions
              </button>
              
              <h1 className="text-3xl font-black text-slate-900 mb-2">Recommended Specialists</h1>
              <p className="text-slate-500 mb-8">We found {filteredDoctors.length} experts specializing in <span className="text-emerald-600 font-bold">{selectedCondition?.title}</span>.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {filteredDoctors.map((doc) => (
                  <button
                    key={doc.uid}
                    onClick={() => setSelectedDoctorId(doc.uid!)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedDoctorId === doc.uid 
                        ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100' 
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900">{doc.name}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> {doc.specialty}
                      </div>
                    </div>
                    {selectedDoctorId === doc.uid && <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>}
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedDoctorId}
                onClick={handleComplete}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
              >
                Complete Profile & Enter Dashboard <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
