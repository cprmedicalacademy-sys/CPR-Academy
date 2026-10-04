import React from 'react';
import { Exam, Profile, Question, Batch } from '../../types';
import {
  Users,
  FileSpreadsheet,
  HelpCircle,
  PlusCircle,
  FileUp,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { AdminNavTab } from '../AdminSidebar';

interface AdminDashboardProps {
  students: Profile[];
  exams: Exam[];
  questions: Question[];
  batches?: Batch[];
  onNavigate: (tab: AdminNavTab) => void;
  onOpenCreateExam: () => void;
  onOpenAddQuestion: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  exams,
  questions,
  batches = [],
  onNavigate,
  onOpenCreateExam,
  onOpenAddQuestion,
}) => {
  const studentCount = students.filter((s) => s.role === 'student').length;

  return (
    <div className="space-y-8 font-english">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Administrative Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Management Dashboard</h1>
          <p className="text-xs text-slate-300 font-bangla mt-1">
            সিপিআর মেডিকেল একাডেমি বিসিএস অনলাইন পরীক্ষা সিরিজ — প্রশ্ন সংযোজন ও একাডেমি ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenCreateExam}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer uppercase tracking-wider"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Exam</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('import-questions')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <FileUp className="w-4 h-4 text-sky-400" />
            <span>Import Questions</span>
          </button>
        </div>
      </div>

      {/* 3 Key Metric Cards (No results or leaderboard metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Students</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
            {studentCount}
          </p>
          <span className="text-[11px] text-slate-400">Registered Students</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Exams</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
            {exams.length}
          </p>
          <span className="text-[11px] text-slate-400">Active & Published Exams</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Questions</span>
            <HelpCircle className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
            {questions.length}
          </p>
          <span className="text-[11px] text-slate-400">In Question Bank</span>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={onOpenCreateExam}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="block font-bold text-slate-900 text-xs">Create Exam</span>
            <span className="text-[11px] text-slate-500 font-bangla">নতুন পরীক্ষা তৈরি</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddQuestion}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="block font-bold text-slate-900 text-xs">Add Question</span>
            <span className="text-[11px] text-slate-500 font-bangla">প্রশ্ন সংযোজন</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('import-questions')}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="block font-bold text-slate-900 text-xs">Import Questions</span>
            <span className="text-[11px] text-slate-500 font-bangla">পিডিএফ ইমপোর্ট</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('students')}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="block font-bold text-slate-900 text-xs">Manage Students</span>
            <span className="text-[11px] text-slate-500 font-bangla">শিক্ষার্থী তালিকা</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Recent Exams & Quick Student Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Online Exams</h2>
            <button
              type="button"
              onClick={() => onNavigate('exams')}
              className="text-xs font-semibold text-sky-800 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {exams.slice(0, 4).map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{ex.title}</h4>
                  <p className="text-[11px] text-slate-500 font-bangla mt-0.5">টপিক: {ex.topic}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>{ex.totalQuestions} Questions</span>
                    <span>•</span>
                    <span>{ex.durationMinutes} Mins</span>
                    <span>•</span>
                    <span className="text-red-600 font-semibold">Neg: -{ex.negativeMarking}</span>
                  </div>
                </div>
                <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  {ex.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Students Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Enrolled Students</h2>
            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-sky-800 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Add / Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {students.filter((s) => s.role === 'student').length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-600">No students registered yet</p>
                <p className="font-bangla mt-1">এডমিন প্যানেল থেকে &apos;Add Student&apos; দিয়ে শিক্ষার্থী যোগ করুন অথবা শিক্ষার্থীরা নাম দিয়ে লগইন করবে।</p>
              </div>
            ) : (
              students
                .filter((s) => s.role === 'student')
                .slice(0, 4)
                .map((st) => (
                  <div
                    key={st.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{st.fullName}</p>
                      <p className="text-[11px] font-mono text-slate-500">ID: {st.studentId || 'N/A'}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-xs bg-sky-50 text-sky-800 border border-sky-200">
                      {st.batchName || 'General'}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
