import React, { useState } from 'react';
import { Profile } from '../types';
import { loginStudent, loginAdmin } from '../services/storage';
import { X, ShieldCheck, User } from 'lucide-react';

export type AuthMode = 'student-login' | 'admin-login';

interface AuthModalProps {
  initialMode: AuthMode;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: Profile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode === 'admin-login' ? 'admin-login' : 'student-login');

  // Student simple login fields: Name (Required) + Registration No (Optional)
  const [studentName, setStudentName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');

  // Admin login fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (mode === 'student-login') {
      const res = loginStudent(studentName, registrationNo);
      setIsLoading(false);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Please enter student name.');
      }
    } else {
      const res = loginAdmin(adminEmail, adminPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid administrator credentials.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {mode === 'admin-login' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <User className="w-5 h-5 text-sky-400" />
            )}
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block font-english">
                CPR MEDICAL ACADEMY
              </span>
              <h2 className="text-base font-bold">
                {mode === 'student-login' ? 'Student Exam Portal Login' : 'Admin Management Login'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Student Login & Admin Login Only */}
        <div className="flex border-b border-slate-200 text-xs font-semibold bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setMode('student-login');
              setError('');
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'student-login'
                ? 'bg-white text-sky-900 border-b-2 border-sky-700 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Login (শিক্ষার্থী প্রবেশ)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin-login');
              setError('');
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              mode === 'admin-login'
                ? 'bg-white text-slate-900 border-b-2 border-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Login (এডমিন)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 font-bangla">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'student-login' ? (
              <>
                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-lg text-[11px] text-sky-900 font-bangla">
                  রেজিস্ট্রেশন নম্বর না থাকলে ফাঁকা রাখুন, কেবল নাম লিখে সরাসরি পরীক্ষায় অংশ নিন।
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Student Full Name <span className="font-bangla font-normal text-slate-500">(শিক্ষার্থীর নাম)</span> *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="আপনার পুরো নাম লিখুন (e.g. Dr. Mohammad Tanvir)"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden font-bangla"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Registration No / Student ID <span className="font-bangla font-normal text-slate-500">(ঐচ্ছিক / না থাকলে ফাঁকা রাখুন)</span>
                  </label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="রেজিস্ট্রেশন নম্বর (না থাকলে ফাঁকা রাখুন)"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden font-mono uppercase"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 mt-2 rounded-lg text-white font-bold text-xs uppercase tracking-wider bg-sky-700 hover:bg-sky-800 transition-colors cursor-pointer shadow-xs"
                >
                  {isLoading ? 'Entering Portal...' : 'ENTER EXAM PORTAL (পরীক্ষা শুরু করুন)'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Admin ID / Email *</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="cprmedicalacademy@gmail.com"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 mt-2 rounded-lg text-white font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                  {isLoading ? 'Verifying...' : 'Sign In as Administrator'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
