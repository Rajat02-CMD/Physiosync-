
import React from 'react';
import { Shield, Zap, Activity, Heart, Calendar, MessageSquare } from 'lucide-react';

export const PLANS = [
  {
    name: 'Basic',
    price: 999,
    sessions: 3,
    features: ['3 sessions per month', 'Email support', 'Progress tracking'],
    recommended: false
  },
  {
    name: 'Recovery',
    price: 2499,
    sessions: 8,
    features: ['8 sessions per month', 'Weekly monitoring', 'Chat support', 'Custom exercise plans'],
    recommended: true
  },
  {
    name: 'Pro',
    price: 4999,
    sessions: 99,
    features: ['Unlimited sessions', 'Priority 24/7 Chat', 'Unlimited recovery tracking', 'Video consultations'],
    recommended: false
  }
];

export const HOW_IT_WORKS = [
  {
    title: 'Sign Up',
    desc: 'Create an account as a patient or a licensed physiotherapist.',
    icon: <Shield className="w-10 h-10 text-emerald-600" />
  },
  {
    title: 'Select Doctor',
    desc: 'Browse verified specialists and choose the right fit for your needs.',
    icon: <Calendar className="w-10 h-10 text-emerald-600" />
  },
  {
    title: 'Get Treated',
    desc: 'Follow your custom plan and track your recovery progress daily.',
    icon: <Activity className="w-10 h-10 text-emerald-600" />
  }
];

export const DOCTOR_BENEFITS = [
  'Automated patient tracking',
  'Integrated payment management',
  'Digital exercise prescription',
  'Real-time communication tools'
];

export const PATIENT_BENEFITS = [
  'Personalized recovery plans',
  'Affordable subscription options',
  'Verified physiotherapists',
  'Visual progress tracking'
];
