import React from 'react';
import { Doctor } from '../types';
import { Star, Clock, MapPin, DollarSign, Award, ArrowRight } from 'lucide-react';

interface DoctorCardProps {
  key?: string;
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  isLoggedIn: boolean;
  onPromptLogin: () => void;
}

export default function DoctorCard({ doctor, onBook, isLoggedIn, onPromptLogin }: DoctorCardProps) {
  return (
    <div
      id={`doctor-card-${doctor.id}`}
      className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col overflow-hidden h-full group"
    >
      {/* Photo and Specialty Header */}
      <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
        <img
          src={doctor.image}
          alt={doctor.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
        <span
          id={`doctor-specialty-${doctor.id}`}
          className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider"
        >
          {doctor.specialty}
        </span>
      </div>

      {/* Main Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 id={`doctor-name-${doctor.id}`} className="font-semibold text-slate-800 text-lg group-hover:text-teal-600 transition">
                {doctor.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {doctor.hospital}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-amber-800">{doctor.rating}</span>
            </div>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
            {doctor.about}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-50">
            <div className="flex items-center gap-2 text-slate-600">
              <Award className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <div className="font-semibold text-slate-800">{doctor.experience} Yrs</div>
                <div className="text-[10px] text-slate-400">Experience</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-semibold text-slate-800">${doctor.consultationFee}</div>
                <div className="text-[10px] text-slate-400">Consultation Fee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-4 border-t border-slate-50">
          {isLoggedIn ? (
            <button
              id={`btn-book-doctor-${doctor.id}`}
              onClick={() => onBook(doctor)}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id={`btn-login-to-book-${doctor.id}`}
              onClick={onPromptLogin}
              className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600 font-semibold text-sm py-2.5 px-4 rounded-xl transition"
            >
              Sign In to Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
