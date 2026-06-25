import React, { useState } from 'react';
import { Doctor, Patient, Appointment } from '../types';
import {
  TrendingUp, Users, Calendar, DollarSign, Activity,
  CheckCircle2, Ban, Stethoscope, Plus, Search, HelpCircle,
  FileText, Clipboard, Sparkles, Filter, ChevronRight
} from 'lucide-react';

interface AdminDashboardProps {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  onAddDoctor: (docData: Omit<Doctor, 'id' | 'rating' | 'reviewsCount'>) => void;
  onCancelAppointment: (id: string, reason: string) => void;
  onCompleteAppointment: (id: string, notes: string) => void;
}

export default function AdminDashboard({
  doctors,
  patients,
  appointments,
  onAddDoctor,
  onCancelAppointment,
  onCompleteAppointment
}: AdminDashboardProps) {
  const [panel, setPanel] = useState<'stats' | 'appointments' | 'doctors' | 'patients'>('stats');

  // Add Doctor Form State
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('General Medicine');
  const [docExperience, setDocExperience] = useState('10');
  const [docFee, setDocFee] = useState('100');
  const [docHospital, setDocHospital] = useState('');
  const [docAbout, setDocAbout] = useState('');
  const [docImage, setDocImage] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Complete Appointment Modal State
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  // Search & Filter state
  const [appFilter, setAppFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchPatient, setSearchPatient] = useState('');

  // Weekdays pool
  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Clinical Time Slots pool
  const STANDARD_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  // Recalculating KPI Stats
  const totalBookings = appointments.length;
  const activeBookingsCount = appointments.filter(a => a.status === 'scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  const totalRevenue = appointments
    .filter(a => a.status === 'completed' || a.status === 'scheduled')
    .reduce((sum, apt) => {
      const doc = doctors.find(d => d.id === apt.doctorId);
      return sum + (doc ? doc.consultationFee : 100);
    }, 0);

  const cancellationRate = totalBookings > 0 ? Math.round((cancelledCount / totalBookings) * 100) : 0;

  // Toggle days check
  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Submit doctor creation
  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!docName.trim() || !docHospital.trim() || !docAbout.trim()) {
      setFormError('Please fill in all clinical profile parameters.');
      return;
    }

    if (selectedDays.length === 0) {
      setFormError('Please select at least one practicing weekday.');
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300'
    ];

    const finalImage = docImage.trim() || defaultImages[doctors.length % defaultImages.length];

    onAddDoctor({
      name: docName.trim(),
      specialty: docSpecialty,
      experience: parseInt(docExperience) || 10,
      consultationFee: parseInt(docFee) || 100,
      hospital: docHospital.trim(),
      about: docAbout.trim(),
      image: finalImage,
      availableDays: selectedDays,
      timeSlots: STANDARD_SLOTS
    });

    setFormSuccess(true);
    // Reset Form
    setDocName('');
    setDocHospital('');
    setDocAbout('');
    setDocImage('');
    setFormError('');

    setTimeout(() => {
      setFormSuccess(false);
    }, 2000);
  };

  // Complete consultation write out
  const handleCompleteSubmit = (id: string) => {
    if (!prescriptionNotes.trim()) return;
    onCompleteAppointment(id, prescriptionNotes.trim());
    setCompletingId(null);
    setPrescriptionNotes('');
  };

  // Filter master schedule list
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = appFilter === 'all' || apt.status === appFilter;
    const matchesDoctor = apt.doctorName.toLowerCase().includes(searchDoctor.toLowerCase());
    const matchesPatient = apt.patientName.toLowerCase().includes(searchPatient.toLowerCase());
    return matchesStatus && matchesDoctor && matchesPatient;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div id="admin-dashboard-container" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Command Links */}
      <div id="admin-sidebar" className="lg:col-span-1 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-5 h-fit">
        <div>
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Clinical Ops</span>
          <h3 className="text-white font-bold text-lg leading-tight mt-0.5">Admin Desk</h3>
        </div>

        <nav className="space-y-1">
          <button
            id="admin-nav-stats"
            onClick={() => setPanel('stats')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition ${
              panel === 'stats' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview & Analytics
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            id="admin-nav-appointments"
            onClick={() => setPanel('appointments')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition ${
              panel === 'appointments' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Master Schedule ({appointments.length})
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            id="admin-nav-doctors"
            onClick={() => setPanel('doctors')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition ${
              panel === 'doctors' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Doctor Roster ({doctors.length})
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            id="admin-nav-patients"
            onClick={() => setPanel('patients')}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition ${
              panel === 'patients' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patient Registry ({patients.length})
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Main Board Area */}
      <div id="admin-main-stage" className="lg:col-span-3 space-y-6">
        
        {panel === 'stats' && (
          <div id="admin-stats-panel" className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Scheduled Active</span>
                  <Calendar className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{activeBookingsCount}</div>
                <p className="text-[10px] text-slate-500">Awaiting clinical sessions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Estimated Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-slate-800">${totalRevenue}</div>
                <p className="text-[10px] text-slate-500">Calculated from consult fees</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                  <CheckCircle2 className="w-5 h-5 text-teal-500" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{completedCount}</div>
                <p className="text-[10px] text-slate-500">Visits with summarized logs</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Cancellation Rate</span>
                  <Ban className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{cancellationRate}%</div>
                <p className="text-[10px] text-slate-500">{cancelledCount} total cancellations</p>
              </div>
            </div>

            {/* Simple Visual Chart - Hospital specialty distribution list */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Consultation Distribution by Specialty</h4>
                  <p className="text-xs text-slate-400">Comparing active and completed bookings across clinic streams</p>
                </div>
                <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-semibold">Live Metrics</span>
              </div>

              <div className="space-y-3.5 pt-2">
                {['Cardiology', 'Pediatrics', 'Dermatology', 'Neurology', 'Orthopedics', 'General Medicine'].map((spec) => {
                  const count = appointments.filter(a => a.doctorSpecialty === spec).length;
                  const maxCount = Math.max(...['Cardiology', 'Pediatrics', 'Dermatology', 'Neurology', 'Orthopedics', 'General Medicine'].map(s => appointments.filter(a => a.doctorSpecialty === s).length), 1);
                  const pct = Math.round((count / maxCount) * 100);

                  return (
                    <div key={spec} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{spec}</span>
                        <span>{count} {count === 1 ? 'visit' : 'visits'}</span>
                      </div>
                      <div className="w-full bg-slate-50 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {panel === 'appointments' && (
          <div id="admin-appointments-panel" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-base">Master Clinic Schedule</h4>
                <p className="text-xs text-slate-400">Oversee, update, and manage clinical consultations across all rosters</p>
              </div>

              {/* Status Filters */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100/50 self-start">
                {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((filterVal) => (
                  <button
                    key={filterVal}
                    id={`btn-filter-status-${filterVal}`}
                    onClick={() => setAppFilter(filterVal)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition ${
                      appFilter === filterVal ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {filterVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini search inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="search-doctor-input"
                  type="text"
                  value={searchDoctor}
                  onChange={(e) => setSearchDoctor(e.target.value)}
                  placeholder="Filter by Doctor..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="search-patient-input"
                  type="text"
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  placeholder="Filter by Patient..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>

            {/* Appointments Log List */}
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400 max-w-sm mx-auto space-y-2">
                  <Clipboard className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="font-semibold text-slate-600">No Matching Bookings</div>
                  <p className="text-xs px-6">Adjust search strings or statuses to display other records.</p>
                </div>
              ) : (
                filteredAppointments.map((apt) => {
                  const isScheduled = apt.status === 'scheduled';
                  const isCompleted = apt.status === 'completed';
                  const isCancelled = apt.status === 'cancelled';

                  return (
                    <div
                      key={apt.id}
                      className="border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-200 transition"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-800 text-sm">{apt.patientName}</h5>
                            <span className="text-[10px] text-slate-400 font-mono">({apt.patientPhone})</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Consulting <span className="font-semibold text-indigo-600">{apt.doctorName}</span> ({apt.doctorSpecialty})
                          </p>
                        </div>
                        <div>
                          {isScheduled && <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">Scheduled</span>}
                          {isCompleted && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">Completed</span>}
                          {isCancelled && <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">Cancelled</span>}
                        </div>
                      </div>

                      <div className="flex gap-4 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 text-slate-500 font-semibold">
                        <div>Date: {apt.date}</div>
                        <div className="border-l border-slate-200 pl-4">Time: {apt.timeSlot}</div>
                      </div>

                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Complaint:</span> "{apt.reason}"
                      </div>

                      {/* Summary text left already */}
                      {isCompleted && apt.notes && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 text-xs text-slate-600">
                          <span className="font-bold text-slate-800 block mb-1">Clinical Notes & Treatment Summary</span>
                          <p className="font-mono text-[11px] whitespace-pre-wrap">{apt.notes}</p>
                        </div>
                      )}

                      {isCancelled && apt.notes && (
                        <div className="text-xs text-rose-700/80 italic font-semibold">
                          Cancellation Reason: "{apt.notes}"
                        </div>
                      )}

                      {/* Operations: Mark Complete / Cancel */}
                      {isScheduled && (
                        <div className="flex justify-end gap-2.5 border-t border-slate-50 pt-3">
                          <button
                            id={`btn-admin-cancel-${apt.id}`}
                            onClick={() => onCancelAppointment(apt.id, 'Cancelled by Clinical Coordinator due to roster adjustment.')}
                            className="px-3 py-1.5 border border-slate-200 hover:border-rose-200 hover:text-rose-600 text-slate-500 text-xs font-semibold rounded-xl transition"
                          >
                            Cancel Slot
                          </button>
                          <button
                            id={`btn-admin-complete-${apt.id}`}
                            onClick={() => setCompletingId(apt.id)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                          >
                            Log Clinical Complete
                          </button>
                        </div>
                      )}

                      {/* Complete write-out card */}
                      {completingId === apt.id && (
                        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-3.5 animate-fade-in text-xs">
                          <div className="flex items-center gap-1.5 text-indigo-900 font-semibold">
                            <FileText className="w-4 h-4 text-indigo-600" />
                            <span>Log Consultation Clinical Summary & Prescriptions</span>
                          </div>
                          <textarea
                            id={`textarea-admin-notes-${apt.id}`}
                            value={prescriptionNotes}
                            onChange={(e) => setPrescriptionNotes(e.target.value)}
                            placeholder="Add clinical diagnostic evaluation and prescribed treatments/therapies..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              id={`btn-close-notes-${apt.id}`}
                              onClick={() => setCompletingId(null)}
                              className="px-3 py-1.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition"
                            >
                              Cancel
                            </button>
                            <button
                              id={`btn-save-notes-${apt.id}`}
                              disabled={!prescriptionNotes.trim()}
                              onClick={() => handleCompleteSubmit(apt.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition shadow-sm disabled:opacity-40"
                            >
                              Finalize Log
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {panel === 'doctors' && (
          <div id="admin-doctors-panel" className="space-y-6 animate-fade-in">
            {/* Create Doctor Profile */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-base">Add Doctor Profile</h4>
                <p className="text-xs text-slate-400">Onboard a new medical consultant with customized specialities and slots</p>
              </div>

              <form id="add-doctor-form" onSubmit={handleAddDoctorSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold uppercase tracking-wider mb-1.5">Doctor Full Name *</label>
                    <input
                      id="input-doc-name"
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="e.g. Dr. Arthur Pendelton"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold uppercase tracking-wider mb-1.5">Medical Specialty *</label>
                    <select
                      id="select-doc-specialty"
                      value={docSpecialty}
                      onChange={(e) => setDocSpecialty(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm font-semibold"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold uppercase tracking-wider mb-1.5">Years of Experience *</label>
                    <input
                      id="input-doc-experience"
                      type="number"
                      value={docExperience}
                      onChange={(e) => setDocExperience(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold uppercase tracking-wider mb-1.5">Consultation Fee ($) *</label>
                    <input
                      id="input-doc-fee"
                      type="number"
                      value={docFee}
                      onChange={(e) => setDocFee(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold uppercase tracking-wider mb-1.5">Affiliated Hospital *</label>
                    <input
                      id="input-doc-hospital"
                      type="text"
                      value={docHospital}
                      onChange={(e) => setDocHospital(e.target.value)}
                      placeholder="e.g. Saint Jude Research Center"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold uppercase tracking-wider mb-1.5">Avatar Image URL (Optional)</label>
                    <input
                      id="input-doc-image"
                      type="url"
                      value={docImage}
                      onChange={(e) => setDocImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                    />
                  </div>
                </div>

                {/* Weekdays Practicing selection */}
                <div className="space-y-2">
                  <label className="block text-slate-600 font-semibold uppercase tracking-wider">Practicing Weekdays *</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map(day => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          id={`btn-day-toggle-${day}`}
                          onClick={() => handleDayToggle(day)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold uppercase tracking-wider mb-1.5">Clinical Biography / Professional About *</label>
                  <textarea
                    id="textarea-doc-about"
                    value={docAbout}
                    onChange={(e) => setDocAbout(e.target.value)}
                    placeholder="Provide professional history, medical educational credentials, clinical specialties, fellowships, etc..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                    required
                  />
                </div>

                {formError && (
                  <div className="bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-100 font-medium">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-bounce" />
                    Doctor profile successfully generated and added to the medical system.
                  </div>
                )}

                <button
                  id="btn-add-doctor-submit"
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm"
                >
                  Onboard Practitioner
                </button>
              </form>
            </div>

            {/* Doctor list summary */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h5 className="font-bold text-slate-800 text-base">Current Clinic Directory</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map(doc => (
                  <div key={doc.id} className="flex gap-4 p-4 border border-slate-50 rounded-xl">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h6 className="font-semibold text-slate-800 text-sm">{doc.name}</h6>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{doc.specialty}</p>
                      <p className="text-slate-500 text-[11px] mt-1">{doc.hospital}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {panel === 'patients' && (
          <div id="admin-patients-panel" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h4 className="font-bold text-slate-800 text-base">Patient Registration Catalog</h4>
              <p className="text-xs text-slate-400">Review clinical history parameters, demographics, and contact fields for active profiles</p>
            </div>

            <div className="space-y-4">
              {patients.map(pat => {
                const patConsultCount = appointments.filter(a => a.patientId === pat.id).length;

                return (
                  <div
                    key={pat.id}
                    className="border border-slate-50 rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-slate-100 transition text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">{pat.name}</h5>
                        <p className="text-[10px] text-slate-400 font-mono">Patient ID: {pat.id}</p>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        {patConsultCount} {patConsultCount === 1 ? 'Booking' : 'Bookings'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/30 text-[11px] text-slate-600 font-semibold">
                      <div>
                        Email: <span className="text-slate-800 block mt-0.5">{pat.email}</span>
                      </div>
                      <div>
                        Phone: <span className="text-slate-800 block mt-0.5">{pat.phone}</span>
                      </div>
                      <div>
                        DOB: <span className="text-slate-800 block mt-0.5">{pat.dob}</span>
                      </div>
                      <div>
                        Gender: <span className="text-slate-800 block mt-0.5">{pat.gender}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-700">Medical Records summary:</span>
                      <p className="text-slate-500 italic p-2.5 bg-slate-50/30 border border-slate-100/30 rounded-lg leading-relaxed">
                        {pat.medicalHistory || 'No previous medical history cataloged.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
