import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, AlertTriangle, FileText, Ban, Trash2, CheckCircle, HelpCircle } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string, cancelReason: string) => void;
}

export default function AppointmentList({ appointments, onCancelAppointment }: AppointmentListProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  // Current Local Time Date check placeholder: 2026-06-24
  const currentDateStr = '2026-06-24';

  const upcomingAppointments = appointments.filter(apt => {
    return apt.status === 'scheduled' && apt.date >= currentDateStr;
  }).sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot));

  const historyAppointments = appointments.filter(apt => {
    return apt.status !== 'scheduled' || apt.date < currentDateStr;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const handleCancelClick = (id: string) => {
    setCancellingId(id);
    setCancelReasonInput('');
  };

  const handleCancelSubmit = (id: string) => {
    if (!cancelReasonInput.trim()) return;
    onCancelAppointment(id, cancelReasonInput.trim());
    setCancellingId(null);
  };

  return (
    <div id="patient-appointments-manager" className="space-y-6">
      {/* Tab Switchers */}
      <div className="flex border-b border-slate-100 pb-3 justify-start gap-6">
        <button
          id="btn-tab-upcoming"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-2.5 text-sm font-semibold relative transition ${
            activeTab === 'upcoming' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Upcoming Bookings ({upcomingAppointments.length})
          {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />}
        </button>
        <button
          id="btn-tab-history"
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 text-sm font-semibold relative transition ${
            activeTab === 'history' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Consultation History ({historyAppointments.length})
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />}
        </button>
      </div>

      {activeTab === 'upcoming' ? (
        <div id="upcoming-list" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl py-12 text-center text-slate-400 max-w-md mx-auto space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-semibold text-slate-600">No Scheduled Bookings</div>
              <p className="text-xs px-6">Explore the clinical directory above and select an available specialty slot to consult a doctor.</p>
            </div>
          ) : (
            upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                id={`appointment-card-${apt.id}`}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:border-slate-200 transition space-y-4"
              >
                {/* Doctor Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-800 text-sm">{apt.doctorName}</h4>
                    <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                      {apt.doctorSpecialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </div>
                </div>

                {/* Date-Time Segment */}
                <div className="flex gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{apt.timeSlot}</span>
                  </div>
                </div>

                {/* Complaint Summary */}
                <div className="text-xs text-slate-500 space-y-1">
                  <span className="font-semibold text-slate-700">Reason for visit:</span>
                  <p className="bg-slate-50/30 p-2.5 rounded-lg border border-slate-100/30 italic">
                    "{apt.reason}"
                  </p>
                </div>

                {/* Cancellation Section */}
                {cancellingId === apt.id ? (
                  <div id={`cancel-form-${apt.id}`} className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 space-y-3 animate-fade-in text-xs">
                    <div className="flex items-center gap-1.5 text-rose-800 font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Confirm Cancellation</span>
                    </div>
                    <p className="text-rose-700">Please provide a reason. This slot will immediately return to the available roster.</p>
                    <input
                      id={`input-cancel-reason-${apt.id}`}
                      type="text"
                      value={cancelReasonInput}
                      onChange={(e) => setCancelReasonInput(e.target.value)}
                      placeholder="e.g., Timing conflict, recovered already, booking mistake"
                      className="w-full px-3 py-2 border border-rose-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-xs"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        id={`btn-keep-booking-${apt.id}`}
                        onClick={() => setCancellingId(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition"
                      >
                        Keep Appointment
                      </button>
                      <button
                        id={`btn-confirm-cancel-${apt.id}`}
                        disabled={!cancelReasonInput.trim()}
                        onClick={() => handleCancelSubmit(apt.id)}
                        className="px-3 py-1.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition disabled:opacity-40"
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end pt-2">
                    <button
                      id={`btn-cancel-appt-${apt.id}`}
                      onClick={() => handleCancelClick(apt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 font-semibold text-xs rounded-xl transition"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div id="history-list" className="space-y-4">
          {historyAppointments.length === 0 ? (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl py-12 text-center text-slate-400 max-w-md mx-auto space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-semibold text-slate-600">No Past Records</div>
              <p className="text-xs px-6">Any completed visits, prescriptions, or legacy cancellations will appear in this clinical folder.</p>
            </div>
          ) : (
            historyAppointments.map((apt) => {
              const isPastActive = apt.status === 'scheduled';
              const isCompleted = apt.status === 'completed';
              const isCancelled = apt.status === 'cancelled';

              return (
                <div
                  key={apt.id}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 opacity-90 hover:opacity-100 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{apt.doctorName}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{apt.doctorSpecialty}</p>
                    </div>
                    <div>
                      {isCompleted && (
                        <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          Completed
                        </span>
                      )}
                      {isCancelled && (
                        <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                          Cancelled
                        </span>
                      )}
                      {isPastActive && (
                        <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                          Unattended / Past
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs font-medium text-slate-400 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/30">
                    <div>
                      Date: <span className="text-slate-600 font-semibold">{apt.date}</span>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      Time: <span className="text-slate-600 font-semibold">{apt.timeSlot}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Reason for consultation:</span>
                    <p className="italic text-slate-500 mt-0.5">"{apt.reason}"</p>
                  </div>

                  {/* Doctor feedback/prescription notes or cancellation reason */}
                  {isCompleted && apt.notes && (
                    <div className="bg-emerald-50/40 border border-emerald-100/60 p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <FileText className="w-4 h-4" />
                        <span>Clinical Summary & Prescription Notes</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
                        {apt.notes}
                      </p>
                    </div>
                  )}

                  {isCancelled && apt.notes && (
                    <div className="bg-rose-50/40 border border-rose-100/50 p-3 rounded-xl space-y-1.5 text-xs text-slate-500">
                      <span className="font-semibold text-rose-800">Cancellation Reason:</span>
                      <p className="italic">"{apt.notes}"</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
