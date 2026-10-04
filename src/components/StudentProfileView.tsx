import React, { useState } from 'react';
import { Profile, ExamResult } from '../types';
import { updateProfile } from '../services/storage';
import { User, Lock, Phone, Mail, Award, CheckCircle, ShieldCheck } from 'lucide-react';

interface StudentProfileViewProps {
  student: Profile;
  results: ExamResult[];
  onProfileUpdated: (updated: Profile) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  results,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(student.fullName);
  const [mobileNumber, setMobileNumber] = useState(student.mobileNumber);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const completedCount = results.length;
  const averageScore =
    completedCount > 0
      ? (results.reduce((acc, r) => acc + r.finalScore, 0) / completedCount).toFixed(1)
      : '0.0';
  const bestScore =
    completedCount > 0
      ? Math.max(...results.map((r) => r.finalScore)).toFixed(1)
      : '0.0';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaveSuccess(false);

    if (!fullName.trim()) {
      setErrorMessage('Full name cannot be empty.');
      return;
    }

    if (password && password !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    try {
      const updated = updateProfile({
        id: student.id,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim() || '',
      });
      onProfileUpdated(updated);
      setSaveSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-english pb-12">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">STUDENT PROFILE</h1>
        <p className="text-xs text-slate-500 font-bangla mt-0.5">
          আপনার শিক্ষার্থী প্রোফাইল ও প্রাতিষ্ঠানিক তথ্য
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Academic ID Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-sky-100 border-2 border-sky-300 rounded-full flex items-center justify-center text-sky-800 text-2xl font-bold mb-4 font-mono shadow-xs">
            {student.fullName.substring(0, 2).toUpperCase()}
          </div>

          <h2 className="text-lg font-bold text-slate-900">{student.fullName}</h2>
          <p className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 mt-1">
            {student.studentId}
          </p>

          <div className="w-full mt-6 pt-6 border-t border-slate-200 text-left space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Enrolled Batch</span>
              <span className="font-semibold text-slate-800">{student.batchName || 'General'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Email Address</span>
              <span className="font-medium text-slate-700">{student.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Registration Date</span>
              <span className="font-medium text-slate-700">
                {new Date(student.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Academic Stats Box */}
          <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-200 text-center">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Exams</span>
              <span className="font-bold text-slate-800 text-sm tabular-nums">{completedCount}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Avg</span>
              <span className="font-bold text-sky-800 text-sm tabular-nums">{averageScore}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Best</span>
              <span className="font-bold text-amber-700 text-sm tabular-nums">{bestScore}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Update Personal Information</h3>
          <p className="text-xs text-slate-500 mb-6">
            Keep your contact details up to date for official academy results and announcements.
          </p>

          {saveSuccess && (
            <div className="p-3 mb-6 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 mb-6 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Student ID <span className="text-slate-400 font-normal">(Admin Protected)</span>
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 font-mono">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>{student.studentId}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={student.email}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs mb-3">Change Password (Optional)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
