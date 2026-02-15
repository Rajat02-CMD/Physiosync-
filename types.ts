
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean;
  age?: number;
  gender?: string;
  specialty?: string;
  photoURL?: string;
  condition?: string;
  assignedDoctorId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentId?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planName: 'Basic' | 'Recovery' | 'Pro';
  expiryDate: string;
  remainingSessions: number;
  status: 'active' | 'expired';
}

export interface RecoveryLog {
  id: string;
  patientId: string;
  date: string;
  painLevel: number;
  mobilityLevel: number;
  notes: string;
}

export interface ExercisePlan {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  duration: string;
  datePrescribed: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}
