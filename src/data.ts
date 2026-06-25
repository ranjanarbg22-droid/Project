import { Doctor, Patient, Appointment } from './types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Evelyn Carter',
    specialty: 'Cardiology',
    rating: 4.9,
    reviewsCount: 124,
    experience: 15,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    about: 'Dr. Evelyn Carter is an experienced cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She completed her fellowship at Johns Hopkins and is highly dedicated to preventative heart healthcare.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    consultationFee: 150,
    hospital: 'Saint Mary Heart Institute'
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    specialty: 'Pediatrics',
    rating: 4.8,
    reviewsCount: 98,
    experience: 12,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    about: 'Dr. Marcus Vance is a compassionate pediatrician who specializes in early childhood development, asthma management, and immunization schedules. He strives to make every hospital visit a pleasant experience for kids.',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '03:30 PM'],
    consultationFee: 100,
    hospital: 'Metro Children\'s Clinic'
  },
  {
    id: 'doc-3',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Dermatology',
    rating: 4.7,
    reviewsCount: 156,
    experience: 10,
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
    about: 'Dr. Sarah Jenkins offers general, surgical, and cosmetic dermatology services. She is a published researcher in acne therapies and specializes in skin cancer screenings and advanced skin restoration.',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    consultationFee: 120,
    hospital: 'Skin & Laser Center'
  },
  {
    id: 'doc-4',
    name: 'Dr. Robert Chen',
    specialty: 'Neurology',
    rating: 4.9,
    reviewsCount: 84,
    experience: 18,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    about: 'Dr. Robert Chen specializes in neurological disorders, sleep medicine, and chronic pain management. He uses advanced diagnostic imaging to deliver highly targeted therapy plans.',
    availableDays: ['Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    consultationFee: 180,
    hospital: 'Neurological Sciences Hospital'
  },
  {
    id: 'doc-5',
    name: 'Dr. Alisha Patel',
    specialty: 'Orthopedics',
    rating: 4.6,
    reviewsCount: 110,
    experience: 8,
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=300',
    about: 'Dr. Alisha Patel is an orthopedic surgeon focusing on sports injuries, arthroscopic surgeries, and joint replacements. She guides patients from initial diagnosis through comprehensive post-op recovery.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    consultationFee: 140,
    hospital: 'Sports Medicine & Bone Joint Center'
  },
  {
    id: 'doc-6',
    name: 'Dr. William Wright',
    specialty: 'General Medicine',
    rating: 4.8,
    reviewsCount: 240,
    experience: 20,
    image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=300',
    about: 'Dr. William Wright has been a trusted family physician for two decades. He treats a wide array of acute and chronic conditions, focusing on healthy lifestyle changes and comprehensive care coordination.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    consultationFee: 80,
    hospital: 'General Wellness Hospital'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+1 (555) 019-2834',
    dob: '1985-11-10',
    gender: 'Female',
    bloodGroup: 'O+',
    medicalHistory: 'Mild asthma, managed with an inhaler as needed.',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'pat-2',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 012-3456',
    dob: '1990-05-15',
    gender: 'Male',
    bloodGroup: 'A-',
    medicalHistory: 'No chronic conditions. Occasional seasonal allergies.',
    createdAt: '2026-02-10T14:30:00Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    patientName: 'Sarah Connor',
    patientPhone: '+1 (555) 019-2834',
    doctorId: 'doc-1',
    doctorName: 'Dr. Evelyn Carter',
    doctorSpecialty: 'Cardiology',
    date: '2026-06-26', // relative future date based on current date 2026-06-24
    timeSlot: '10:00 AM',
    status: 'scheduled',
    reason: 'Routine annual cardiovascular screening and blood pressure review.',
    createdAt: '2026-06-24T09:00:00Z'
  },
  {
    id: 'apt-2',
    patientId: 'pat-1',
    patientName: 'Sarah Connor',
    patientPhone: '+1 (555) 019-2834',
    doctorId: 'doc-3',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Dermatology',
    date: '2026-06-20', // past date
    timeSlot: '02:00 PM',
    status: 'completed',
    reason: 'Skin cancer screening check on arm freckles.',
    notes: 'Patient exhibits normal freckles. Recommend SPF 50+ and annual screen.',
    createdAt: '2026-06-15T11:15:00Z'
  },
  {
    id: 'apt-3',
    patientId: 'pat-2',
    patientName: 'John Doe',
    patientPhone: '+1 (555) 012-3456',
    doctorId: 'doc-5',
    doctorName: 'Dr. Alisha Patel',
    doctorSpecialty: 'Orthopedics',
    date: '2026-06-28', // future date
    timeSlot: '11:00 AM',
    status: 'scheduled',
    reason: 'Knee inflammation and sports recovery checkup after a running injury.',
    createdAt: '2026-06-23T16:45:00Z'
  },
  {
    id: 'apt-4',
    patientId: 'pat-2',
    patientName: 'John Doe',
    patientPhone: '+1 (555) 012-3456',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Vance',
    doctorSpecialty: 'Pediatrics',
    date: '2026-06-22',
    timeSlot: '09:30 AM',
    status: 'cancelled',
    reason: 'Cousin\'s medical checkup consultation.',
    notes: 'Cancelled by patient due to timing conflict.',
    createdAt: '2026-06-20T10:00:00Z'
  }
];

export const SPECIALTIES = [
  'All',
  'General Medicine',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Neurology',
  'Orthopedics'
];
