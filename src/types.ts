export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  experience: number; // in years
  image: string;
  about: string;
  availableDays: string[]; // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  timeSlots: string[]; // e.g., ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
  consultationFee: number;
  hospital: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  medicalHistory: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
}
