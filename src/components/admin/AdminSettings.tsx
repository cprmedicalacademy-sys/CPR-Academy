import React, { useState } from 'react';
import { AcademySettings } from '../../types';
import { updateAcademySettings, resetDemoData } from '../../services/storage';
import { Sliders, CheckCircle, RotateCcw, Building2 } from 'lucide-react';

interface AdminSettingsProps {
  settings: AcademySettings;
  onSettingsUpdated: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const [academyName, setAcademyName] = useState(settings.academyName);
  const [portalName, setPortalName] = useState(settings.portalName);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [defaultDurationMinutes, setDefaultDurationMinutes] = useState(settings.defaultDurationMinutes);
  const [defaultNegativeMarking, setDefaultNegativeMarking] = useState(settings.defaultNegativeMarking);
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(settings.leaderboardEnabled);
  const [resultVisibilityDefault, setResultVisibilityDefault] = useState(settings.resultVisibilityDefault);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademySettings({
      academyName,
      portalName,
      phone,
      email,
      address,
      defaultDurationMinutes: Number(defaultDurationMinutes),
      defaultNegativeMarking: Number(defaultNegativeMarking),
      leaderboardEnabled,
      resultVisibilityDefault,
    });
    setSavedSuccess(true);
    onSettingsUpdated();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Warning: This will reset all questions, exams, batches, and student attempts back to original demo state (Special BCS Crystal Batch with 40 questions). Continue?'
      )
    ) {
      resetDemoData();
      onSettingsUpdated();
      alert('Data reset successfully.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-english pb-16">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ACADEMY SETTINGS</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            প্রতিষ্ঠান প্রোফাইল, নেগেটিভ মার্কিং ডিফল্ট ও সিস্টেম কনফিগারেশন
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Academy settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5 text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Academy Identification & Branding
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academy Name</label>
            <input
              type="text"
              required
              value={academyName}
              onChange={(e) => setAcademyName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Portal Name</label>
            <input
              type="text"
              required
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Academy Campus Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Evaluation Defaults */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Default Examination Rules & Evaluation
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                value={defaultDurationMinutes}
                onChange={(e) => setDefaultDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-red-700 mb-1">Default Negative Marking</label>
              <input
                type="number"
                step="0.25"
                min="0"
                value={defaultNegativeMarking}
                onChange={(e) => setDefaultNegativeMarking(Number(e.target.value))}
                className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs font-bold text-red-700"
              />
              <span className="text-[11px] text-slate-500 font-bangla mt-1 block">
                ভুল উত্তরের জন্য স্বয়ংক্রিয়ভাবে ০.৫ নম্বর কর্তন সূত্র।
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={leaderboardEnabled}
                onChange={(e) => setLeaderboardEnabled(e.target.checked)}
                className="rounded border-slate-300 text-sky-700"
              />
              <span>Enable Leaderboard globally for published exams</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={resultVisibilityDefault}
                onChange={(e) => setResultVisibilityDefault(e.target.checked)}
                className="rounded border-slate-300 text-sky-700"
              />
              <span>Display detailed calculation to students immediately after submission</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg uppercase tracking-wider cursor-pointer shadow-xs"
          >
            Save All Settings
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-50/50 border border-red-200 rounded-xl p-6 text-xs text-red-900 space-y-3">
        <h3 className="font-bold text-red-950 text-sm">Danger Zone / Demo State Reset</h3>
        <p className="text-slate-600">
          Reset all storage and restore the original 40 questions from Math 01 Question.pdf, initial demo student accounts, and leaderboard.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Exam Data</span>
        </button>
      </div>
    </div>
  );
};
