import React, { useState, useEffect } from 'react';
import { Doctor, Patient, Appointment, DatabaseSchema } from './types';
import { INITIAL_DOCTORS, INITIAL_PATIENTS, INITIAL_APPOINTMENTS, SPECIALTIES } from './data';
import DoctorCard from './components/DoctorCard';
import BookingModal from './components/BookingModal';
import AppointmentList from './components/AppointmentList';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import DocSection from './components/DocSection';
import { HeartPulse, Stethoscope, Search, Shield, LogOut, User, Activity, CalendarClock, BookOpen, ExternalLink } from 'lucide-react';

export default function App() {
  // Database State - initialized from localStorage or defaults
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('h_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('h_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('h_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<Patient | null>(() => {
    const savedEmail = localStorage.getItem('h_current_user_email');
    if (savedEmail) {
      const pList: Patient[] = JSON.parse(localStorage.getItem('h_patients') || '[]');
      const actualList = pList.length ? pList : INITIAL_PATIENTS;
      return actualList.find(p => p.email.toLowerCase() === savedEmail.toLowerCase()) || null;
    }
    return null;
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('h_is_admin') === 'true';
  });

  // UI state
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showDocs, setShowDocs] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('h_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('h_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('h_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Auth synchronization helpers
  const handleLogin = (email: string, role: 'patient' | 'admin') => {
    if (role === 'admin') {
      setIsAdminMode(true);
      setCurrentUser(null);
      localStorage.setItem('h_is_admin', 'true');
      localStorage.removeItem('h_current_user_email');
    } else {
      const patient = patients.find(p => p.email.toLowerCase() === email.toLowerCase().trim());
      if (patient) {
        setCurrentUser(patient);
        setIsAdminMode(false);
        localStorage.setItem('h_current_user_email', patient.email);
        localStorage.setItem('h_is_admin', 'false');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    localStorage.removeItem('h_current_user_email');
    localStorage.setItem('h_is_admin', 'false');
  };

  const handleRegisterPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  // Onboard new physician - admin feature
  const handleAddDoctor = (docData: Omit<Doctor, 'id' | 'rating' | 'reviewsCount'>) => {
    const newDoctor: Doctor = {
      ...docData,
      id: `doc-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setDoctors(prev => [...prev, newDoctor]);
  };

  // Schedule an appointment
  const handleBookAppointment = (bookingData: {
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    timeSlot: string;
    reason: string;
  }) => {
    if (!currentUser) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientPhone: currentUser.phone,
      ...bookingData,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);
  };

  // Cancel an appointment - patient or admin
  const handleCancelAppointment = (id: string, notes: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id
          ? { ...apt, status: 'cancelled', notes }
          : apt
      )
    );
  };

  // Finalize appointment (mark complete and add diagnostic summary) - admin
  const handleCompleteAppointment = (id: string, notes: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id
          ? { ...apt, status: 'completed', notes }
          : apt
      )
    );
  };

  // Filter doctor catalog
  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Professional Hospital Banner */}
      <header id="hospital-header" className="bg-slate-900 text-white border-b border-slate-800 shrink-0 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2.5 rounded-xl border border-teal-400 flex items-center justify-center text-slate-950 shadow-sm animate-pulse">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 font-mono">Saint Mary Medical Campus</span>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none mt-0.5">Clinical Booking Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct specs toggler in header */}
            <button
              id="header-btn-docs"
              onClick={() => setShowDocs(!showDocs)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-700 hover:border-teal-500 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Specs & API Logs</span>
            </button>

            {/* Authenticated user status bar */}
            {currentUser && (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 p-1.5 rounded-xl">
                <div className="flex items-center gap-2 px-2.5 py-1 text-xs">
                  <User className="w-4 h-4 text-teal-400" />
                  <span className="font-semibold text-slate-200">Patient:</span>
                  <span className="font-bold text-teal-400">{currentUser.name}</span>
                </div>
                <button
                  id="btn-header-signout"
                  onClick={handleLogout}
                  className="bg-slate-900 border border-slate-700/50 hover:bg-slate-950 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {isAdminMode && (
              <div className="flex items-center gap-3 bg-indigo-950 border border-indigo-800/60 p-1.5 rounded-xl">
                <div className="flex items-center gap-2 px-2.5 py-1 text-xs">
                  <Shield className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-indigo-400">Clinical Administrator</span>
                </div>
                <button
                  id="btn-admin-header-signout"
                  onClick={handleLogout}
                  className="bg-indigo-900 border border-indigo-800/50 hover:bg-indigo-950 p-1.5 rounded-lg text-slate-300 hover:text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Case 1: Unauthenticated Welcome Split View */}
        {!currentUser && !isAdminMode ? (
          <div id="unauth-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            
            {/* Left Hand: Hospital Branding & Informational Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 border border-teal-200/50 px-3 py-1 rounded-full uppercase tracking-widest">
                  Integrated Medical Center
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                  Schedule Consultations & Manage Your Clinical Records Instantly
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                  Saint Mary Clinical Campus bridges world-class medicine with absolute patient comfort. Book pediatric, cardiology, dermatology, or orthopedics appointments using real-time practitioner availability schedules.
                </p>
              </div>

              {/* Bulleted trust indices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <Stethoscope className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Verified Clinical Staff</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Review specialized certifications, practice histories, and clinical bios.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <CalendarClock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Dynamic Time Slots</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Real-time availability filters prevent dual booking and lock chosen calendar times.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hand: Interactive Sign-In Modal */}
            <div className="lg:col-span-5">
              <AuthModal
                patients={patients}
                onRegister={handleRegisterPatient}
                onLogin={handleLogin}
                currentUserId={null}
                isAdminMode={false}
              />
            </div>
          </div>
        ) : isAdminMode ? (
          /* Case 2: Authenticated Administrator Dashboard view */
          <div id="admin-view-wrapper" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Staff & Schedule Control</h2>
                <p className="text-xs text-slate-400">Synchronized master databases for practitioners, bookings, and diagnostics summaries</p>
              </div>
              <div className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 self-start">
                <Shield className="w-4 h-4" />
                Staff Access Granted
              </div>
            </div>

            <AdminDashboard
              doctors={doctors}
              patients={patients}
              appointments={appointments}
              onAddDoctor={handleAddDoctor}
              onCancelAppointment={handleCancelAppointment}
              onCompleteAppointment={handleCompleteAppointment}
            />
          </div>
        ) : (
          /* Case 3: Authenticated Patient Directory and Appointments view */
          <div id="patient-view-wrapper" className="space-y-8">
            
            {/* Dashboard Welcome Segment */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400">Welcome back to Saint Mary Clinicals</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Hello, {currentUser.name}
                </h2>
                <p className="text-slate-400 text-xs max-w-lg leading-relaxed">
                  Browse physicians by clinical specialty, choose an open calendar slot, or monitor your clinical summaries and prescription details below.
                </p>
              </div>

              {/* Switch to administrative demo helper right in the banner */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2.5 shrink-0 max-w-xs md:self-center">
                <div className="font-semibold text-slate-300">Evaluating clinical flows?</div>
                <p className="text-[10px] text-slate-400 leading-tight">Swap directly to Clinical Coordinator mode to onboarding doctors or prescribe medication summary logs.</p>
                <button
                  id="btn-banner-swap-admin"
                  onClick={() => handleLogin('admin@hospital.com', 'admin')}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Swap to Administrator Mode
                </button>
              </div>
            </div>

            {/* Split Patient Panel: Left Doctor Catalog, Right Appointments Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Doctor Catalog & Specialities */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">Physician Directory</h3>
                  <p className="text-xs text-slate-400">Search by practitioner names, hospital centers, or specialty streams</p>
                </div>

                {/* Filter and Search board */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="input-catalog-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search doctor names, specialties, hospitals..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                    />
                  </div>

                  {/* Specialty selectors */}
                  <div className="flex flex-wrap gap-1.5">
                    {SPECIALTIES.map(spec => (
                      <button
                        key={spec}
                        id={`btn-spec-filter-${spec.replace(/\s+/g, '-')}`}
                        onClick={() => setSelectedSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                          selectedSpecialty === spec
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-50 border border-slate-100/50 text-slate-500 hover:border-slate-200 hover:text-slate-800'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doctor Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredDoctors.length === 0 ? (
                    <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-10 text-center text-slate-400 space-y-2">
                      <Stethoscope className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-semibold text-slate-600">No Practicing Doctors Found</div>
                      <p className="text-xs">Adjust search parameters or choose a different specialty filter block.</p>
                    </div>
                  ) : (
                    filteredDoctors.map(doc => (
                      <DoctorCard
                        key={doc.id}
                        doctor={doc}
                        isLoggedIn={true}
                        onBook={setSelectedDoctorForBooking}
                        onPromptLogin={() => {}}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Appointment Manager Logs */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">My Appointments</h3>
                  <p className="text-xs text-slate-400">View upcoming times, past prescription logs, and clinical summaries</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <AppointmentList
                    appointments={appointments.filter(a => a.patientId === currentUser.id)}
                    onCancelAppointment={handleCancelAppointment}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Dynamic Booking Modal overlays */}
        {selectedDoctorForBooking && currentUser && (
          <BookingModal
            doctor={selectedDoctorForBooking}
            patient={currentUser}
            appointments={appointments}
            onBook={handleBookAppointment}
            onClose={() => setSelectedDoctorForBooking(null)}
          />
        )}

        {/* Dynamic System Specs & API Contracts Documentation drawer */}
        {showDocs && (
          <div id="specs-overlay-container" className="animate-fade-in">
            <DocSection />
          </div>
        )}

      </main>

      {/* Modern Compact Footer with specs button */}
      <footer id="hospital-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-200">Saint Mary Medical Booking System</span>
            <span className="text-slate-600">|</span>
            <span>Local Seed Synchronization Active</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="footer-btn-docs"
              onClick={() => setShowDocs(!showDocs)}
              className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold transition"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>{showDocs ? 'Hide System Specs' : 'Show Database Schema & REST APIs'}</span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="font-mono text-slate-500">v1.2.0 (React 19)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
