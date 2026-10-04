import React from 'react';
import { Profile, Exam } from '../types';
import {
  FileText,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface StudentDashboardProps {
  student: Profile;
  availableExams: Exam[];
  onStartExam: (exam: Exam) => void;
  onViewAllExams: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  availableExams,
  onStartExam,
  onViewAllExams,
}) => {
  return (
    <div className="space-y-8 font-english">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider mb-1 font-english">
              <Sparkles className="w-3.5 h-3.5 text-sky-700" />
              <span>Student Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-english">
              Welcome, {student.fullName}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              <span className="font-semibold text-slate-800">Student ID / Roll:</span> {student.studentId || 'N/A'}
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-semibold text-slate-800">Batch:</span> {student.batchName || 'SPECIAL BCS CRYSTAL BATCH'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold font-bangla">
              বিসিএস অনলাইন পরীক্ষা সিরিজ
            </span>
          </div>
        </div>
      </div>

      {/* Available Exams Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-english">Available Exams</h2>
            <p className="text-xs text-slate-500 font-bangla">
              আপনার জন্য উপলব্ধ চলমান ও আসন্ন অনলাইন পরীক্ষা সমূহ
            </p>
          </div>
          {availableExams.length > 2 && (
            <button
              type="button"
              onClick={onViewAllExams}
              className="text-xs font-semibold text-sky-800 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Exams ({availableExams.length})</span>
            </button>
          )}
        </div>

        {availableExams.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 text-xs">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No exams currently available</p>
            <p className="text-slate-400 font-bangla mt-1">নতুন পরীক্ষা প্রকাশিত হলে এখানে দেখতে পাবেন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block font-english">
                        {exam.subject}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                        {exam.title}
                      </h3>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                      {exam.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-bangla line-clamp-2">
                    টপিক: {exam.topic}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total MCQ</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {exam.totalQuestions} Questions
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Marks</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {exam.totalMarks}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Duration</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {exam.durationMinutes} Minutes
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Batch</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {exam.batchName}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-red-700 font-medium">
                        Negative Marking: {exam.negativeMarking} per wrong MCQ
                      </span>
                      <span className="text-[11px] text-slate-400 font-bangla">ভুল উত্তরের পেনাল্টি</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartExam(exam)}
                  className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider font-english"
                >
                  <span>START EXAM</span>
                  <span className="font-bangla font-normal">| পরীক্ষা শুরু করুন</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
