import React, { useState, useEffect } from 'react';
import { Doctor, Appointment, Patient } from '../types';
import { X, Calendar, Clock, AlertCircle, HeartPulse, Check } from 'lucide-react';

interface BookingModalProps {
  doctor: Doctor;
  patient: Patient;
  appointments: Appointment[];
  onBook: (bookingData: {
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    timeSlot: string;
    reason: string;
  }) => void;
  onClose: () => void;
}

export default function BookingModal({ doctor, patient, appointments, onBook, onClose }: BookingModalProps) {
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Set default min date to current local time (2026-06-24)
  const minDate = '2026-06-24';

  // State to track if the selected day is a doctor working day
  const [isDoctorWorkingDay, setIsDoctorWorkingDay] = useState(true);
  const [selectedDayName, setSelectedDayName] = useState('');

  // Re-evaluate working day and available slots when date changes
  useEffect(() => {
    if (!date) return;

    // Determine Day Name
    const parsedDate = new Date(date + 'T00:00:00'); // prevent timezone shifting
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[parsedDate.getDay()];
    setSelectedDayName(dayName);

    // Verify if doctor is available on this day of the week
    const isAvailable = doctor.availableDays.includes(dayName);
    setIsDoctorWorkingDay(isAvailable);
    
    if (!isAvailable) {
      setErrorMsg(`Dr. ${doctor.name} does not practice on ${dayName}s. Please choose a day listed in doctor's practicing schedule.`);
      setSelectedSlot('');
    } else {
      setErrorMsg('');
    }
  }, [date, doctor]);

  // Compute taken slots on the chosen date
  const getAvailableSlots = () => {
    if (!date || !isDoctorWorkingDay) return [];
    
    // Find appointments booked for this doctor on this date that are 'scheduled'
    const bookedSlots = appointments
      .filter(apt => apt.doctorId === doctor.id && apt.date === date && apt.status === 'scheduled')
      .map(apt => apt.timeSlot);

    return doctor.timeSlots.map(slot => ({
      slot,
      isBooked: bookedSlots.includes(slot)
    }));
  };

  const availableSlots = getAvailableSlots();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!date) {
      setErrorMsg('Please select a preferred date.');
      return;
    }
    if (!isDoctorWorkingDay) {
      setErrorMsg(`Dr. ${doctor.name} is not available on this day of the week (${selectedDayName}).`);
      return;
    }
    if (!selectedSlot) {
      setErrorMsg('Please select a preferred time slot.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please describe the reason for your visit.');
      return;
    }

    // Double booking guard for this patient at the same date & time across ALL doctors
    const isPatientDoubleBooked = appointments.some(
      apt => apt.patientId === patient.id && apt.date === date && apt.timeSlot === selectedSlot && apt.status === 'scheduled'
    );

    if (isPatientDoubleBooked) {
      setErrorMsg(`You already have another active appointment scheduled at ${selectedSlot} on ${date}. Please choose a different slot.`);
      return;
    }

    // Submit Booking
    onBook({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      date,
      timeSlot: selectedSlot,
      reason: reason.trim()
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        id="booking-modal-content"
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-fade-in border border-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <HeartPulse className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-slate-800 text-base">Schedule Consultation</span>
          </div>
          <button
            id="btn-close-booking"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Selected Doctor Summary */}
          <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-100/50 flex gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-cover rounded-xl border border-teal-100 shrink-0"
            />
            <div className="space-y-1">
              <div className="font-semibold text-slate-800 text-sm">{doctor.name}</div>
              <div className="text-xs text-teal-700 bg-teal-100/60 font-semibold px-2 py-0.5 rounded-md inline-block">
                {doctor.specialty}
              </div>
              <p className="text-[11px] text-slate-500">
                Practices at {doctor.hospital} (Fee: ${doctor.consultationFee})
              </p>
            </div>
          </div>

          {!success ? (
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Patient Detail Block */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100/50 text-xs text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">Patient:</span> {patient.name}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Phone:</span> {patient.phone}
                </div>
              </div>

              {/* Day selection and Practicing Days Banner */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  1. Choose Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="input-booking-date"
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                    required
                  />
                </div>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-2">
                  <span className="font-medium text-slate-700">Dr. {doctor.name} Practicing Schedule:</span>
                  <span className="text-teal-700 font-semibold">{doctor.availableDays.join(', ')}</span>
                </div>
              </div>

              {/* Time Slots Block */}
              {date && isDoctorWorkingDay && (
                <div className="space-y-2.5 animate-fade-in">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                    <span>2. Select Time Slot</span>
                    <span className="text-[10px] text-slate-400 capitalize">Available Slots</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map(({ slot, isBooked }) => (
                      <button
                        key={slot}
                        type="button"
                        id={`slot-btn-${slot.replace(/\s+/g, '-')}`}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl text-center border transition ${
                          isBooked
                            ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through'
                            : selectedSlot === slot
                            ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 hover:border-teal-500 hover:text-teal-600 text-slate-600'
                        }`}
                      >
                        {slot}
                        {isBooked && <span className="block text-[8px] opacity-75">Booked</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chief Complaint / Reason for Booking */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  3. Reason for Visit
                </label>
                <textarea
                  id="textarea-booking-reason"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your primary complaint, symptoms, or consultation requirements..."
                  maxLength={250}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                  required
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Please be concise</span>
                  <span>{reason.length}/250 characters</span>
                </div>
              </div>

              {/* Error block */}
              {errorMsg && (
                <div className="flex items-start gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                id="btn-confirm-booking"
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-3 rounded-xl transition mt-4"
              >
                <Clock className="w-4 h-4" />
                Confirm Consultation Appointment
              </button>
            </form>
          ) : (
            <div id="booking-success-animation" className="py-8 text-center space-y-4 animate-scale-up">
              <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-lg">Appointment Scheduled!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your appointment with Dr. {doctor.name} on {date} at {selectedSlot} has been added to our records successfully.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
