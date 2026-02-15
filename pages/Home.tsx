
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { HOW_IT_WORKS, PLANS, DOCTOR_BENEFITS, PATIENT_BENEFITS } from '../constants';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-emerald-50 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Recovery <span className="text-emerald-600 italic">Synchronized</span> with Your Life.
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              PhysioSync connects you with expert physiotherapists for remote monitoring, personalized exercise plans, and visual progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
                Start My Recovery <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/signup?role=DOCTOR" className="bg-white text-emerald-600 border border-emerald-100 px-8 py-4 rounded-xl font-bold text-center hover:bg-emerald-50 transition-all">
                Join as a Doctor
              </Link>
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
              alt="Physio Treatment" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl hidden lg:block border border-emerald-50">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Total Recoveries</div>
                  <div className="text-slate-900 font-bold text-xl">12,450+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How PhysioSync Works</h2>
          <p className="text-slate-600">Three simple steps to start your health journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all group">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-bold mb-8">For Patients</h2>
            <ul className="space-y-4">
              {PATIENT_BENEFITS.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
                  <span className="text-slate-300">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-8">For Doctors</h2>
            <ul className="space-y-4">
              {DOCTOR_BENEFITS.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
                  <span className="text-slate-300">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Flexible Plans</h2>
          <p className="text-slate-600">Choose the support level that matches your recovery pace</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${plan.recommended ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/10' : 'border-slate-100 shadow-md'} flex flex-col bg-white transition-transform hover:scale-105 duration-300`}>
              {plan.recommended && <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">RECOMMENDED</span>}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
                <span className="text-slate-500 ml-1">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="text-emerald-600 w-4 h-4 shrink-0" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`block text-center py-3 rounded-xl font-bold transition-all ${plan.recommended ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-emerald-50">
        <div className="max-w-3xl mx-auto px-4 bg-white p-10 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows={4} className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
