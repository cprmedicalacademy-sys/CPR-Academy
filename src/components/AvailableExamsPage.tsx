import React from 'react';
import { Exam } from '../types';
import { FileCheck, Clock, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

interface AvailableExamsPageProps {
  exams: Exam[];
  onStartExam: (exam: Exam) => void;
}

export const AvailableExamsPage: React.FC<AvailableExamsPageProps> = ({ exams, onStartExam }) => {
  return (
    <div className="space-y-6 font-english">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Available Exams</h1>
        <p className="text-sm text-slate-500 font-bangla mt-1">
          উপলব্ধ পরীক্ষা সমূহ — আপনার ব্যাচের জন্য নির্ধারিত চলমান ও আসন্ন অনলাইন পরীক্ষা।
        </p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Available Exams</h3>
          <p className="text-sm text-slate-500 font-bangla mt-1">
            এই মুহূর্তে কোনো পরীক্ষা উপলব্ধ নেই। অনুগ্রহ করে পরে আবার চেক করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs font-semibold text-sky-800 font-bangla mt-1">
                      টপিক: {exam.topic}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm uppercase tracking-wider">
                    {exam.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  {exam.description || 'Comprehensive evaluation covering academy syllabus and competitive examination patterns.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg text-xs mb-5 border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Questions</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {exam.totalQuestions} MCQ
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Marks</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {exam.totalMarks} Marks
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Duration</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {exam.durationMinutes} Minutes
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Negative Marking</span>
                    <span className="font-bold text-red-600 tabular-nums">
                      -{exam.negativeMarking} per wrong
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Start Time</span>
                    <span className="font-medium text-slate-700">
                      {exam.startDate} {exam.startTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">End Time</span>
                    <span className="font-medium text-slate-700">
                      {exam.endDate} {exam.endTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 mb-5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="font-bangla leading-tight text-[11px]">
                    টাইমার শুরু হওয়ার পর পেজ রিফ্রেশ বা উইন্ডো পরিবর্তন করলে সতর্কতা জারী হবে।
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartExam(exam)}
                className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
              >
                <span>START EXAM</span>
                <span className="font-bangla font-normal">| পরীক্ষা শুরু করুন</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
