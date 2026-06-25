import React, { useState } from 'react';
import { Database, Server, Cpu, FileText } from 'lucide-react';

export default function DocSection() {
  const [activeTab, setActiveTab] = useState<'db' | 'api' | 'screens'>('db');

  return (
    <div id="tech-docs-container" className="bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800 p-6 md:p-8 mt-12 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">Technical Architecture</span>
          <h2 id="docs-title" className="text-2xl font-semibold text-white tracking-tight mt-1">System Specs & Design Patterns</h2>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button
            id="tab-db"
            onClick={() => setActiveTab('db')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'db' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Database className="w-4 h-4" />
            Database Schema
          </button>
          <button
            id="tab-api"
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'api' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Server className="w-4 h-4" />
            API Contracts
          </button>
          <button
            id="tab-screens"
            onClick={() => setActiveTab('screens')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'screens' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Tech Stack
          </button>
        </div>
      </div>

      {activeTab === 'db' && (
        <div id="db-schema-doc" className="space-y-6 animate-fade-in">
          <p className="text-slate-400 text-sm leading-relaxed">
            The application follows a clean 3-entity relational database layout. In-app changes are synchronized dynamically and persisted locally using the client-side storage engine.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table 1: Doctors */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-mono text-sm text-emerald-400 font-semibold">doctors</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">6 fields</span>
              </div>
              <ul className="space-y-2 font-mono text-xs">
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span className="text-emerald-500 font-bold">id (PK)</span>
                  <span className="text-slate-500">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>name</span>
                  <span className="text-slate-500">VARCHAR(100)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>specialty</span>
                  <span className="text-slate-500">VARCHAR(100)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>experience</span>
                  <span className="text-slate-500">INT</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>availableDays</span>
                  <span className="text-slate-500">JSON Array</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>consultationFee</span>
                  <span className="text-slate-500">DECIMAL(10,2)</span>
                </li>
              </ul>
            </div>

            {/* Table 2: Patients */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-mono text-sm text-sky-400 font-semibold">patients</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">8 fields</span>
              </div>
              <ul className="space-y-2 font-mono text-xs">
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span className="text-sky-500 font-bold">id (PK)</span>
                  <span className="text-slate-500">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>name</span>
                  <span className="text-slate-500">VARCHAR(100)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>email (Unique)</span>
                  <span className="text-slate-500">VARCHAR(150)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>phone</span>
                  <span className="text-slate-500">VARCHAR(20)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>dob</span>
                  <span className="text-slate-500">DATE</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>medicalHistory</span>
                  <span className="text-slate-500">TEXT</span>
                </li>
              </ul>
            </div>

            {/* Table 3: Appointments */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-mono text-sm text-rose-400 font-semibold">appointments</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">11 fields</span>
              </div>
              <ul className="space-y-2 font-mono text-xs">
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span className="text-rose-500 font-bold">id (PK)</span>
                  <span className="text-slate-500">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span className="text-slate-400">patientId (FK)</span>
                  <span className="text-slate-500">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span className="text-slate-400">doctorId (FK)</span>
                  <span className="text-slate-500">VARCHAR(36)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>date</span>
                  <span className="text-slate-500">DATE</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>timeSlot</span>
                  <span className="text-slate-500">VARCHAR(15)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-900/50">
                  <span>status</span>
                  <span className="text-slate-500">VARCHAR(15)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div id="api-doc-view" className="space-y-6 animate-fade-in font-mono text-xs md:text-sm">
          <p className="text-slate-400 text-sm font-sans leading-relaxed">
            The application interacts with a standard, documented RESTful endpoint layout. In-app requests simulate real network latencies and return standard response bodies.
          </p>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-xs font-bold font-mono">POST</span>
                <span className="text-white font-semibold font-mono">/api/auth/register</span>
                <span className="text-slate-500 text-xs ml-auto">Demographics Enrollment</span>
              </div>
              <p className="text-slate-400 text-xs font-sans mb-3">Enrolls a new patient into the hospital demographics registry.</p>
              <pre className="text-emerald-400 text-xs overflow-x-auto bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`Request:
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "phone": "+1 (555) 019-2834",
  "dob": "1985-11-10",
  "gender": "Female"
}`}
              </pre>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-xs font-bold font-mono">POST</span>
                <span className="text-white font-semibold font-mono">/api/appointments</span>
                <span className="text-slate-500 text-xs ml-auto">Book Consultation</span>
              </div>
              <p className="text-slate-400 text-xs font-sans mb-3">Books a consultation block. Prevents conflict double-booking on same doctor, date, and slot.</p>
              <pre className="text-emerald-400 text-xs overflow-x-auto bg-slate-900/60 p-2.5 rounded border border-slate-800">
{`Request:
{
  "patientId": "pat-1",
  "doctorId": "doc-1",
  "date": "2026-06-26",
  "timeSlot": "10:00 AM",
  "reason": "Routine Cardiology Review"
}`}
              </pre>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-xs font-bold font-mono">PUT</span>
                <span className="text-white font-semibold font-mono">/api/appointments/:id/cancel</span>
                <span className="text-slate-500 text-xs ml-auto">Revoke Slot</span>
              </div>
              <p className="text-slate-400 text-xs font-sans mb-3">Cancels a booked slot and returns it back to the available calendar pool.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'screens' && (
        <div id="tech-stack-doc" className="space-y-6 animate-fade-in">
          <p className="text-slate-400 text-sm leading-relaxed">
            Engineered using a high-density, decoupled layout. Features responsive panels optimized for desktop clinics and portable patient browsers alike.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Frontend Core
              </h3>
              <ul className="space-y-2 text-slate-400 font-mono text-xs">
                <li>• <strong className="text-slate-200">Framework:</strong> React (v19) Function Components</li>
                <li>• <strong className="text-slate-200">Styling Engine:</strong> Tailwind CSS & Lucide Icons</li>
                <li>• <strong className="text-slate-200">Animations:</strong> Motion for transitions</li>
                <li>• <strong className="text-slate-200">Type System:</strong> TypeScript compiler with strict safety</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                Database & Repository Pattern
              </h3>
              <ul className="space-y-2 text-slate-400 font-mono text-xs">
                <li>• <strong className="text-slate-200">Persistence:</strong> localStorage-backed transaction queues</li>
                <li>• <strong className="text-slate-200">Conflicts:</strong> Automated double-booking blockers</li>
                <li>• <strong className="text-slate-200">User Switching:</strong> instant hot-swapping patient ↔ admin</li>
                <li>• <strong className="text-slate-200">Analytics:</strong> Live charting & KPIs dynamically recalculated</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
