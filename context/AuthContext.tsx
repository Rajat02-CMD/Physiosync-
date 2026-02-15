
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial auth check
    const savedUser = localStorage.getItem('physio_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // Mock login logic
    if (email === 'admin@physio.com') {
      const u: User = { uid: '1', name: 'Admin User', email, role: UserRole.ADMIN, approved: true };
      setUser(u);
      localStorage.setItem('physio_user', JSON.stringify(u));
    } else if (email.includes('doctor')) {
      const u: User = { uid: '2', name: 'Dr. Sarah Smith', email, role: UserRole.DOCTOR, approved: true, specialty: 'Orthopedics' };
      setUser(u);
      localStorage.setItem('physio_user', JSON.stringify(u));
    } else {
      const u: User = { uid: '3', name: 'John Doe', email, role: UserRole.PATIENT, approved: true, age: 30, gender: 'Male' };
      setUser(u);
      localStorage.setItem('physio_user', JSON.stringify(u));
    }
  };

  const signup = async (userData: Partial<User>) => {
    const newUser: User = {
      uid: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'New User',
      email: userData.email || '',
      role: userData.role || UserRole.PATIENT,
      approved: userData.role !== UserRole.DOCTOR, // Doctors need admin approval
      ...userData
    };
    setUser(newUser);
    localStorage.setItem('physio_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('physio_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('physio_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
