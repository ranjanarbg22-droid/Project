import React, { useState } from 'react';
import { Patient } from '../types';
import { LogIn, UserPlus, ShieldAlert, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  patients: Patient[];
  onRegister: (patientData: Omit<Patient, 'id' | 'createdAt'>) => Patient;
  onLogin: (email: string, role: 'patient' | 'admin') => void;
  currentUserId: string | null;
  isAdminMode: boolean;
}

export default function AuthModal({ patients, onRegister, onLogin, currentUserId, isAdminMode }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'demo'>('demo');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regBlood, setRegBlood] = useState('O+');
  const [regHistory, setRegHistory] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('Email address is required.');
      return;
    }
    
    // Check if user is admin
    if (loginEmail.toLowerCase() === 'admin@hospital.com') {
      onLogin(loginEmail, 'admin');
      return;
    }

    const patient = patients.find(p => p.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (patient) {
      onLogin(patient.email, 'patient');
    } else {
      setLoginError('No registered patient found with this email. Please register or use Demo Accounts.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regDob.trim()) {
      setRegError('Please fill in all required fields.');
      return;
    }

    // Email duplication check
    const exists = patients.some(p => p.email.toLowerCase() === regEmail.toLowerCase().trim());
    if (exists || regEmail.toLowerCase() === 'admin@hospital.com') {
      setRegError('Email is already registered. Please login or use a different email.');
      return;
    }

    try {
      const newPatient = onRegister({
        name: regName,
        email: regEmail.trim(),
        phone: regPhone,
        dob: regDob,
        gender: regGender,
        bloodGroup: regBlood,
        medicalHistory: regHistory
      });
      
      setRegSuccess(true);
      setTimeout(() => {
        onLogin(newPatient.email, 'patient');
        // Reset form
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegDob('');
        setRegHistory('');
        setRegSuccess(false);
      }, 1500);
    } catch (err) {
      setRegError('Registration failed. Please try again.');
    }
  };

  return (
    <div id="auth-panel" className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 max-w-lg mx-auto">
      <div className="flex border-b border-slate-100 pb-4 mb-6">
        <button
          id="auth-tab-demo"
          onClick={() => setTab('demo')}
          className={`flex-1 py-2 text-center text-sm font-semibold transition-all border-b-2 ${
            tab === 'demo' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Demo Portals
        </button>
        <button
          id="auth-tab-login"
          onClick={() => setTab('login')}
          className={`flex-1 py-2 text-center text-sm font-semibold transition-all border-b-2 ${
            tab === 'login' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Patient Sign In
        </button>
        <button
          id="auth-tab-register"
          onClick={() => setTab('register')}
          className={`flex-1 py-2 text-center text-sm font-semibold transition-all border-b-2 ${
            tab === 'register' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Register Patient
        </button>
      </div>

      {tab === 'demo' && (
        <div id="demo-pane" className="space-y-5 animate-fade-in">
          <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100/70 text-slate-700 text-xs leading-relaxed">
            <h4 className="font-semibold text-teal-800 text-sm mb-1">Quick Access Sandbox</h4>
            We have pre-configured a medical test environment. Click any role below to log in instantly.
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Patients (Demo Profiles)</h5>
            {patients.map((pat) => (
              <button
                key={pat.id}
                id={`demo-user-${pat.id}`}
                onClick={() => onLogin(pat.email, 'patient')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition ${
                  currentUserId === pat.id && !isAdminMode
                    ? 'border-teal-600 bg-teal-50/30'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{pat.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{pat.email}</div>
                </div>
                {currentUserId === pat.id && !isAdminMode ? (
                  <span className="text-xs font-semibold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full">Active Patient</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Sign In</span>
                )}
              </button>
            ))}

            <h5 className="text-xs font-mono text-slate-400 uppercase tracking-wider pt-2">Clinical Staff / Admin</h5>
            <button
              id="demo-user-admin"
              onClick={() => onLogin('admin@hospital.com', 'admin')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition ${
                isAdminMode
                  ? 'border-indigo-600 bg-indigo-50/30'
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
              }`}
            >
              <div>
                <div className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                  Clinic Administrator
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Staff</span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">admin@hospital.com</div>
              </div>
              {isAdminMode ? (
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full">Active Admin</span>
              ) : (
                <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Sign In</span>
              )}
            </button>
          </div>
        </div>
      )}

      {tab === 'login' && (
        <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Registered Email Address</label>
            <input
              id="input-login-email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="e.g. sarah@example.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-sm"
              required
            />
          </div>

          {loginError && (
            <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            id="btn-login-submit"
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
          >
            <LogIn className="w-4 h-4" />
            Continue to Patient Portal
          </button>
        </form>
      )}

      {tab === 'register' && (
        <form id="register-form" onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name <span className="text-rose-500">*</span></label>
              <input
                id="input-reg-name"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Sarah Connor"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address <span className="text-rose-500">*</span></label>
              <input
                id="input-reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Contact Phone <span className="text-rose-500">*</span></label>
              <input
                id="input-reg-phone"
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Date of Birth <span className="text-rose-500">*</span></label>
              <input
                id="input-reg-dob"
                type="date"
                value={regDob}
                onChange={(e) => setRegDob(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Biological Gender</label>
              <select
                id="select-reg-gender"
                value={regGender}
                onChange={(e) => setRegGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Blood Group (Optional)</label>
              <select
                id="select-reg-blood"
                value={regBlood}
                onChange={(e) => setRegBlood(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Prior Medical History / Allergies (Optional)</label>
            <textarea
              id="textarea-reg-history"
              value={regHistory}
              onChange={(e) => setRegHistory(e.target.value)}
              placeholder="e.g., Asthma, Penicillin allergy, high blood pressure."
              rows={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          {regError && (
            <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          {regSuccess && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
              <span>Registration completed! Logging you in now...</span>
            </div>
          )}

          <button
            id="btn-reg-submit"
            type="submit"
            disabled={regSuccess}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            Create Demographic Account
          </button>
        </form>
      )}
    </div>
  );
}
