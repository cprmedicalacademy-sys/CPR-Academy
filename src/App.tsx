import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Profile,
  Exam,
  Batch,
  ExamResult,
  AcademySettings,
  ExamAttempt,
} from './types';
import {
  initStorage,
  getCurrentUser,
  setCurrentUser,
  getExams,
  getBatches,
  getQuestions,
  getResults,
  getAcademySettings,
  getStudentAttempt,
  startExamAttempt,
  getProfiles,
} from './services/storage';

// Components
import { TopHeaderBar } from './components/TopHeaderBar';
import { Navbar } from './components/Navbar';
import { StudentSidebar, StudentNavTab } from './components/StudentSidebar';
import { AdminSidebar, AdminNavTab } from './components/AdminSidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { AvailableExamsPage } from './components/AvailableExamsPage';
import { ExamInstructionsModal } from './components/ExamInstructionsModal';
import { ExamEngine } from './components/ExamEngine';
import { ExamResultView } from './components/ExamResultView';
import { StudentProfileView } from './components/StudentProfileView';
import { AuthModal, AuthMode } from './components/AuthModal';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminExams } from './components/admin/AdminExams';
import { AdminQuestions } from './components/admin/AdminQuestions';
import { AdminImportQuestions } from './components/admin/AdminImportQuestions';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminBatches } from './components/admin/AdminBatches';
import { AdminSettings } from './components/admin/AdminSettings';

import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  // Global Data State
  const [currentUser, setUser] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<AcademySettings>(getAcademySettings());
  const [exams, setExams] = useState<Exam[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Navigation State
  const [studentTab, setStudentTab] = useState<StudentNavTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminNavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('student-login');

  // Exam flow states
  const [examToStart, setExamToStart] = useState<Exam | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);
  const [adminSelectedExamForQuestions, setAdminSelectedExamForQuestions] = useState<string | undefined>();

  // Refresh all state from storage
  const refreshData = useCallback(() => {
    initStorage();
    const user = getCurrentUser();
    setUser(user);
    setSettings(getAcademySettings());
    setExams(getExams());
    setBatches(getBatches());
    setResults(getResults());
    setProfiles(getProfiles());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setActiveAttempt(null);
    setActiveExam(null);
    setViewingResult(null);
    setExamToStart(null);
    setShowInstructions(false);
    setStudentTab('dashboard');
    setAdminTab('dashboard');
  };

  // Open Auth Modal
  const handleOpenAuth = (mode: AuthMode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Successful Auth callback
  const handleAuthSuccess = (user: Profile) => {
    setUser(user);
    refreshData();
    if (user.role === 'admin') {
      setAdminTab('dashboard');
    } else {
      setStudentTab('dashboard');
    }
  };

  // Start exam flow
  const handleInitiateExam = (exam: Exam) => {
    if (!currentUser) {
      handleOpenAuth('student-login');
      return;
    }
    setExamToStart(exam);
    setShowInstructions(true);
  };

  const handleAgreeAndStartExam = () => {
    if (!examToStart || !currentUser) return;
    setShowInstructions(false);
    const attempt = startExamAttempt(currentUser, examToStart);
    setActiveAttempt(attempt);
    setActiveExam(examToStart);
  };

  const handleFinishExam = (result: ExamResult) => {
    setActiveAttempt(null);
    setActiveExam(null);
    setViewingResult(result);
    refreshData();
  };

  // Filter exams available to student
  const availableExamsForStudent = useMemo(() => {
    if (!currentUser) return exams.filter((e) => e.status === 'published');
    return exams.filter((e) => {
      const isPublished = e.status === 'published' || e.status === 'live';
      const isBatchMatch =
        e.batchId === 'all' || !currentUser.batchId || e.batchId === currentUser.batchId;
      return isPublished && isBatchMatch;
    });
  }, [exams, currentUser]);

  const studentResults = useMemo(() => {
    if (!currentUser) return [];
    return results.filter((r) => r.studentId === currentUser.id);
  }, [results, currentUser]);

  // All questions in database for admin counter
  const allQuestionsCount = useMemo(() => {
    return exams.reduce((acc, ex) => acc + getQuestions(ex.id).length, 0);
  }, [exams]);

  // IF ACTIVE EXAM IS RUNNING: Render Fullscreen Exam Engine
  if (activeExam && activeAttempt) {
    return (
      <ExamEngine
        exam={activeExam}
        initialAttempt={activeAttempt}
        onFinishExam={handleFinishExam}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-english text-slate-900 selection:bg-sky-200">
      {/* Top Header Bar: Contact Phone Numbers, Logo, Chittagong Campus Location */}
      <TopHeaderBar />

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        settings={settings}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onNavigateHome={() => {
          setViewingResult(null);
          if (currentUser?.role === 'admin') setAdminTab('dashboard');
          else setStudentTab('dashboard');
        }}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* If user is logged in, show appropriate Sidebar */}
        {currentUser ? (
          <>
            {/* Desktop & Mobile Drawer Sidebar */}
            <div
              className={`lg:block ${
                mobileMenuOpen
                  ? 'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex'
                  : 'hidden'
              }`}
            >
              <div
                className={`bg-white h-full ${
                  mobileMenuOpen ? 'w-64 max-w-xs shadow-2xl relative z-50' : 'w-full'
                }`}
              >
                {currentUser.role === 'admin' ? (
                  <AdminSidebar
                    currentTab={adminTab}
                    onSelectTab={(tab) => {
                      setAdminTab(tab);
                      setViewingResult(null);
                      setMobileMenuOpen(false);
                    }}
                    onLogout={handleLogout}
                  />
                ) : (
                  <StudentSidebar
                    currentTab={studentTab}
                    onSelectTab={(tab) => {
                      setStudentTab(tab);
                      setViewingResult(null);
                      setMobileMenuOpen(false);
                    }}
                    onLogout={handleLogout}
                    availableExamsCount={availableExamsForStudent.length}
                  />
                )}
              </div>
              {mobileMenuOpen && (
                <div
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                />
              )}
            </div>

            {/* Main Content Pane */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {viewingResult ? (
                /* Result Screen */
                <ExamResultView
                  result={viewingResult}
                  onBackToDashboard={() => {
                    setViewingResult(null);
                    setStudentTab('dashboard');
                  }}
                />
              ) : currentUser.role === 'admin' ? (
                /* Admin Views */
                <>
                  {adminTab === 'dashboard' && (
                    <AdminDashboard
                      students={profiles}
                      exams={exams}
                      questions={exams.flatMap((e) => getQuestions(e.id))}
                      batches={batches}
                      onNavigate={setAdminTab}
                      onOpenCreateExam={() => setAdminTab('exams')}
                      onOpenAddQuestion={() => setAdminTab('questions')}
                    />
                  )}
                  {adminTab === 'exams' && (
                    <AdminExams
                      exams={exams}
                      batches={batches}
                      onExamsUpdated={refreshData}
                      onManageQuestions={(examId) => {
                        setAdminSelectedExamForQuestions(examId);
                        setAdminTab('questions');
                      }}
                    />
                  )}
                  {adminTab === 'questions' && (
                    <AdminQuestions
                      exams={exams}
                      selectedExamId={adminSelectedExamForQuestions}
                      onQuestionsUpdated={refreshData}
                    />
                  )}
                  {adminTab === 'import-questions' && (
                    <AdminImportQuestions
                      exams={exams}
                      onImportCompleted={(examId) => {
                        refreshData();
                        setAdminSelectedExamForQuestions(examId);
                        setAdminTab('questions');
                      }}
                    />
                  )}
                  {adminTab === 'students' && (
                    <AdminStudents
                      students={profiles}
                      batches={batches}
                      onStudentsUpdated={refreshData}
                    />
                  )}
                  {adminTab === 'batches' && (
                    <AdminBatches
                      batches={batches}
                      onBatchesUpdated={refreshData}
                    />
                  )}
                  {adminTab === 'settings' && (
                    <AdminSettings
                      settings={settings}
                      onSettingsUpdated={refreshData}
                    />
                  )}
                </>
              ) : (
                /* Student Views */
                <>
                  {studentTab === 'dashboard' && (
                    <StudentDashboard
                      student={currentUser}
                      availableExams={availableExamsForStudent}
                      onStartExam={handleInitiateExam}
                      onViewAllExams={() => setStudentTab('available-exams')}
                    />
                  )}
                  {studentTab === 'available-exams' && (
                    <AvailableExamsPage
                      exams={availableExamsForStudent}
                      onStartExam={handleInitiateExam}
                    />
                  )}
                  {studentTab === 'profile' && (
                    <StudentProfileView
                      student={currentUser}
                      results={studentResults}
                      onProfileUpdated={() => refreshData()}
                    />
                  )}
                </>
              )}
            </main>
          </>
        ) : (
          /* Public Portal Landing View (When Not Logged In) */
          <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Hero Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-full text-xs font-bold uppercase tracking-widest font-english">
                <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                <span>CPR MEDICAL ACADEMY</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                ONLINE EXAMINATION PORTAL
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-bangla max-w-2xl mx-auto leading-relaxed">
                সিপিআর মেডিকেল একাডেমি বিসিএস অনলাইন পরীক্ষা সিরিজ। স্বয়ংক্রিয় নেগেটিভ মার্কিং মূল্যায়ন, লাইভ টাইমার এবং স্বয়ংক্রিয় ফলাফল।
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('student-login')}
                  className="px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer uppercase tracking-wider flex items-center gap-2"
                >
                  <span>Student Login</span>
                  <span className="font-bangla font-normal text-xs">(শিক্ষার্থী প্রবেশ — নাম ও রোল)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAuth('admin-login')}
                  className="px-5 py-3 text-slate-700 hover:text-slate-900 font-semibold text-xs rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                >
                  Admin Portal (এডমিন)
                </button>
              </div>
            </div>

            {/* Featured Demo Exam Card */}
            <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block font-english">
                    Featured Model Test (Verified Source: Math 01 Question.pdf)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                    SPECIAL BCS CRYSTAL BATCH
                  </h2>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    টপিক: গাণিতিক যুক্তি (Mathematical Logic) • ৪০টি এমসিকিউ প্রশ্ন • ৪০ মিনিট সময়
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenAuth('student-login')}
                  className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider whitespace-nowrap"
                >
                  <span>START EXAM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Total Questions</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">40 MCQ</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Duration</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">40 Minutes</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[11px]">Total Marks</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">40.0</span>
                </div>
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                  <span className="text-red-700 block text-[11px] font-bold">Negative Marking</span>
                  <span className="text-base font-extrabold text-red-700 tabular-nums">-0.5</span>
                </div>
              </div>

              {/* Exact Formula Callout */}
              <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-xl text-center space-y-1">
                <p className="text-xs font-bold text-sky-900 font-bangla">
                  মূল্যায়ন সূত্র: প্রাপ্ত ফলাফল = সঠিক MCQ − (ভুল MCQ সংখ্যা × ০.৫)
                </p>
                <p className="text-[11px] text-slate-600 font-english">
                  Strictly automatic real-time grading, anti-cheat detection, and comprehensive answer review with explanations.
                </p>
              </div>
            </div>

            {/* Academy Features Highlights */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Real-time Countdown Engine</h3>
                <p className="text-slate-600 leading-relaxed font-bangla">
                  নির্দিষ্ট সময় শেষে স্বয়ংক্রিয় পরীক্ষা সাবমিশন এবং ব্যাকগ্রাউন্ডে উত্তর সেভ হওয়া।
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Automated Negative Evaluation</h3>
                <p className="text-slate-600 leading-relaxed font-bangla">
                  ভুল উত্তরের জন্য ০.৫ নম্বর কর্তন সহ নিখুঁত মার্কশিট ও প্রতিটি প্রশ্নের পূর্ণাঙ্গ ব্যাখ্যা।
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Detailed Solution & Review</h3>
                <p className="text-slate-600 leading-relaxed font-bangla">
                  সঠিক ও ভুল উত্তর চিহ্নিতকরণ এবং প্রতিটি প্রশ্নের বিশদ সমাধান ও ব্যাখ্যা বিশ্লেষণ।
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exam Instructions Modal */}
      {showInstructions && examToStart && (
        <ExamInstructionsModal
          exam={examToStart}
          onAgreeAndStart={handleAgreeAndStartExam}
          onCancel={() => {
            setShowInstructions(false);
            setExamToStart(null);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        initialMode={authModalMode}
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-english mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-slate-700 uppercase tracking-wider">
            {settings.academyName}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 font-bangla">
            মতি টাওয়ার (৫ম তলা), গুলজার মোড়, চকবাজার, চট্টগ্রাম • EBL ব্যাংকের ATM বুথের ডান পাশে লিফটের ৪ তলা
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-english">
            Contact: 01898-938981 (WhatsApp), 01898-938982 • cprmedicalacademy@gmail.com
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-bangla">
            © {new Date().getFullYear()} সিপিআর মেডিকেল একাডেমি। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </footer>
    </div>
  );
}
