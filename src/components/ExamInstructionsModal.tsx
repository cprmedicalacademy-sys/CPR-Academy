import React, { useState } from 'react';
import { Exam } from '../types';
import { ShieldAlert, Clock, CheckCircle2, AlertOctagon, X } from 'lucide-react';

interface ExamInstructionsModalProps {
  exam: Exam;
  onAgreeAndStart: () => void;
  onCancel: () => void;
}

export const ExamInstructionsModal: React.FC<ExamInstructionsModalProps> = ({
  exam,
  onAgreeAndStart,
  onCancel,
}) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest block">
              CPR MEDICAL ACADEMY
            </span>
            <h2 className="text-lg font-bold">EXAM INSTRUCTIONS</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
            <p className="text-xs text-sky-800 font-medium font-bangla mt-1">
              টপিক: {exam.topic}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Total MCQ</span>
              <span className="font-bold text-slate-800 text-base tabular-nums">
                {exam.totalQuestions}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Duration</span>
              <span className="font-bold text-slate-800 text-base tabular-nums">
                {exam.durationMinutes} Mins
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Negative Marking</span>
              <span className="font-bold text-red-600 text-base tabular-nums">
                -{exam.negativeMarking}
              </span>
            </div>
          </div>

          {/* Rules Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Exam Rules & Guidelines:
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Select one answer for each question from the 4 available options (A, B, C, D).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Negative Marking:</strong> Wrong answers will deduct{' '}
                  <span className="text-red-700 font-bold">{exam.negativeMarking} mark</span> each.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Unanswered questions will receive <strong>0 mark</strong> (no negative penalty).</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <span>The exam will automatically submit when the countdown timer reaches 00:00.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Do not switch browser tabs or minimize the window during the exam. Tab switching is monitored.
                </span>
              </li>
            </ul>
          </div>

          {/* Bengali Summary */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 font-bangla space-y-1">
            <p className="font-semibold text-slate-900 font-english text-[11px] uppercase tracking-wider">
              ফলাফল গণনার সূত্র:
            </p>
            <p className="leading-relaxed font-semibold">
              প্রাপ্ত ফলাফল = সঠিক MCQ − (ভুল MCQ সংখ্যা × ০.৫)
            </p>
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-sky-700 rounded-sm border-slate-300 focus:ring-sky-600"
            />
            <span className="text-xs text-slate-800 font-medium">
              I have read and understood all the exam rules and instructions.
            </span>
          </label>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!agreed}
            onClick={onAgreeAndStart}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider ${
              agreed
                ? 'bg-sky-700 hover:bg-sky-800 text-white shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>I AGREE & START EXAM</span>
            <span className="font-bangla font-normal text-[11px]">(পরীক্ষা শুরু করুন)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
