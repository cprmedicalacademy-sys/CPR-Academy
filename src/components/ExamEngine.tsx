import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Exam,
  StudentQuestion,
  ExamAttempt,
  OptionKey,
  ExamResult,
} from '../types';
import {
  getQuestionsForStudent,
  saveStudentAnswer,
  recordTabSwitch,
  submitExamAttempt,
} from '../services/storage';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  Send,
  ShieldAlert,
} from 'lucide-react';

interface ExamEngineProps {
  exam: Exam;
  initialAttempt: ExamAttempt;
  onFinishExam: (result: ExamResult) => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  exam,
  initialAttempt,
  onFinishExam,
}) => {
  // Load questions (these DO NOT contain correctAnswer or explanation)
  const questions: StudentQuestion[] = useMemo(() => {
    return getQuestionsForStudent(exam.id);
  }, [exam.id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>(initialAttempt.answers || {});
  const [markedForReview, setMarkedForReview] = useState<string[]>(initialAttempt.markedForReview || []);
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(initialAttempt.tabSwitchCount || 0);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer setup: remaining seconds calculated from expectedEndTime
  const calculateRemainingSeconds = useCallback(() => {
    const end = new Date(initialAttempt.expectedEndTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((end - now) / 1000));
  }, [initialAttempt.expectedEndTime]);

  const [timeLeft, setTimeLeft] = useState<number>(calculateRemainingSeconds);

  // Submit exam handler
  const handleFinalSubmit = useCallback(
    (isAuto: boolean = false) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const result = submitExamAttempt(initialAttempt.id, isAuto);
        onFinishExam(result);
      } catch (err) {
        console.error('Error submitting exam:', err);
        setIsSubmitting(false);
      }
    },
    [initialAttempt.id, isSubmitting, onFinishExam]
  );

  // Countdown Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleFinalSubmit]);

  // Tab switch & visibility monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const count = recordTabSwitch(initialAttempt.id);
        setTabSwitchCount(count);
        setShowTabWarning(true);
      }
    };

    const handleWindowBlur = () => {
      const count = recordTabSwitch(initialAttempt.id);
      setTabSwitchCount(count);
      setShowTabWarning(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [initialAttempt.id]);

  // Current question helper
  const currentQuestion: StudentQuestion | undefined = questions[currentIndex];

  // Option selection
  const handleSelectOption = (option: OptionKey) => {
    if (!currentQuestion) return;
    const currentSelected = answers[currentQuestion.id];
    const newOption = currentSelected === option ? null : option; // toggle

    const newAnswers = { ...answers };
    if (newOption === null) {
      delete newAnswers[currentQuestion.id];
    } else {
      newAnswers[currentQuestion.id] = newOption;
    }
    setAnswers(newAnswers);

    // Continuous auto-save
    saveStudentAnswer(initialAttempt.id, currentQuestion.id, newOption);
  };

  // Clear answer
  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    setAnswers(newAnswers);
    saveStudentAnswer(initialAttempt.id, currentQuestion.id, null);
  };

  // Toggle Mark for review
  const handleToggleReview = () => {
    if (!currentQuestion) return;
    const isMarked = markedForReview.includes(currentQuestion.id);
    let newMarked: string[];
    if (isMarked) {
      newMarked = markedForReview.filter((id) => id !== currentQuestion.id);
    } else {
      newMarked = [...markedForReview, currentQuestion.id];
    }
    setMarkedForReview(newMarked);
    saveStudentAnswer(
      initialAttempt.id,
      currentQuestion.id,
      answers[currentQuestion.id] || null,
      !isMarked
    );
  };

  // Format Time: MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Stats for submission modal
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const reviewCount = markedForReview.length;

  const isLowTime = timeLeft <= 300; // less than 5 minutes

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center font-english">
          <p className="text-base text-slate-700">Loading exam questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-english exam-secure-mode select-none">
      {/* Top Exam Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowMobilePalette(!showMobilePalette)}
                className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-md cursor-pointer"
                title="Question Palette"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-sky-400 block uppercase font-english">
                  CPR MEDICAL ACADEMY
                </span>
                <h1 className="text-xs sm:text-sm md:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  {exam.title}
                </h1>
              </div>
            </div>

            {/* Center: Countdown Timer */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border tabular-nums transition-colors ${
                isLowTime
                  ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <Clock className={`w-4 h-4 ${isLowTime ? 'text-red-400' : 'text-sky-400'}`} />
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-english leading-none">
                  TIME LEFT
                </span>
                <span className="text-base sm:text-lg font-bold tracking-wider font-mono">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Right: Submit Exam Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 shadow-xs uppercase tracking-wider cursor-pointer font-english"
              >
                <Send className="w-3.5 h-3.5" />
                <span>SUBMIT EXAM</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Examination Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left: Active Question Area */}
        <div className="flex-1 flex flex-col justify-between bg-white border border-slate-200 rounded-xl shadow-xs p-6 sm:p-8">
          <div>
            {/* Question Header & Meta */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-sky-100 text-sky-900 font-bold text-sm rounded-md font-english">
                  Question {String(currentIndex + 1).padStart(2, '0')} of {questions.length}
                </span>
                <span className="text-xs text-slate-500 font-bangla">
                  মান: {currentQuestion.marks} | নেগেটিভ: -{currentQuestion.negativeMarks}
                </span>
              </div>

              {markedForReview.includes(currentQuestion.id) && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full font-english">
                  <Bookmark className="w-3 h-3 fill-current" />
                  Marked for Review
                </span>
              )}
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed font-bangla whitespace-pre-line">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Four Options: A, B, C, D */}
            <div className="space-y-3.5 max-w-2xl">
              {(['A', 'B', 'C', 'D'] as OptionKey[]).map((optKey) => {
                const optText =
                  optKey === 'A'
                    ? currentQuestion.optionA
                    : optKey === 'B'
                    ? currentQuestion.optionB
                    : optKey === 'C'
                    ? currentQuestion.optionC
                    : currentQuestion.optionD;

                const isSelected = answers[currentQuestion.id] === optKey;

                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 cursor-pointer select-none ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-sky-700 text-white ring-2 ring-sky-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {optKey}
                    </div>
                    <div className="flex-1 text-base text-slate-900 font-bangla pt-0.5 leading-relaxed">
                      {optText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearAnswer}
                disabled={!answers[currentQuestion.id]}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer font-english"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Answer</span>
              </button>

              <button
                type="button"
                onClick={handleToggleReview}
                className={`px-3 py-2 text-xs font-semibold border rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-english ${
                  markedForReview.includes(currentQuestion.id)
                    ? 'bg-purple-100 border-purple-300 text-purple-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  {markedForReview.includes(currentQuestion.id)
                    ? 'Unmark Review'
                    : 'Mark for Review'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer font-english"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-english shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-english shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Exam</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette (Desktop & Mobile Drawer) */}
        <div
          className={`lg:w-80 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between ${
            showMobilePalette
              ? 'fixed inset-y-0 right-0 z-50 w-72 shadow-2xl block overflow-y-auto'
              : 'hidden lg:flex'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-english">
                  Question Palette
                </h3>
                <span className="text-[11px] text-slate-500 font-bangla">প্রশ্ন নেভিগেশন</span>
              </div>
              {showMobilePalette && (
                <button
                  type="button"
                  onClick={() => setShowMobilePalette(false)}
                  className="p-1 text-slate-500 hover:text-slate-800 lg:hidden cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Legend Indicators */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4 font-english">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300 shrink-0" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
                <span>Review ({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-sky-600 shrink-0" />
                <span>Current</span>
              </div>
            </div>

            {/* 40 Questions Grid (e.g. 01 to 40) */}
            <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];
                const isMarked = markedForReview.includes(q.id);

                let badgeStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                if (isAnswered && isMarked) {
                  badgeStyle = 'bg-purple-600 text-white font-bold border-purple-700';
                } else if (isAnswered) {
                  badgeStyle = 'bg-emerald-600 text-white font-bold border-emerald-700';
                } else if (isMarked) {
                  badgeStyle = 'bg-amber-400 text-slate-900 font-bold border-amber-500';
                }

                if (isCurrent) {
                  badgeStyle += ' ring-2 ring-sky-600 ring-offset-2';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowMobilePalette(false);
                    }}
                    className={`h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center cursor-pointer tabular-nums font-mono ${badgeStyle}`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Summary in Palette */}
          <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-700 font-english">
              <div className="flex justify-between">
                <span>Total Answered:</span>
                <span className="font-bold text-emerald-700 tabular-nums">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="font-bold text-slate-500 tabular-nums">{unansweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Marked Review:</span>
                <span className="font-bold text-purple-700 tabular-nums">{reviewCount}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer uppercase tracking-wider font-english shadow-xs"
            >
              FINISH & SUBMIT EXAM
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal on Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-1">
              Submit Examination?
            </h3>
            <p className="text-xs text-slate-500 text-center font-bangla mb-6">
              আপনি কি নিশ্চিতভাবে আপনার উত্তরপত্র জমা দিতে চান?
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900 tabular-nums">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-800">
                <span className="font-semibold">Answered (উত্তর দেওয়া হয়েছে):</span>
                <span className="font-bold tabular-nums">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Unanswered (উত্তর দেওয়া হয়নি):</span>
                <span className="font-bold tabular-nums">{unansweredCount}</span>
              </div>
              <div className="flex items-center justify-between text-purple-800">
                <span>Marked for Review:</span>
                <span className="font-bold tabular-nums">{reviewCount}</span>
              </div>
            </div>

            <p className="text-[11px] text-red-600 text-center mb-6 font-bangla leading-relaxed">
              * জমা দেওয়ার পর আর কোনো উত্তর পরিবর্তন করা যাবে না এবং স্বয়ংক্রিয়ভাবে ফলাফল হিসাব করা হবে।
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleFinalSubmit(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer uppercase tracking-wider shadow-xs"
              >
                {isSubmitting ? 'CALCULATING...' : 'SUBMIT EXAM'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switching Warning Modal */}
      {showTabWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-red-200 shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-1">
              Warning: Leaving the exam window has been detected.
            </h3>
            <p className="text-xs text-slate-600 font-bangla mb-4 leading-relaxed">
              সতর্কতা: পরীক্ষার উইন্ডো থেকে বের হওয়া রেকর্ড করা হয়েছে। বার বার উইন্ডো পরিবর্তন করলে আপনার খাতা বাতিল হতে পারে।
            </p>
            <p className="text-xs font-semibold text-slate-700 mb-6 font-english">
              Recorded Tab Switches: <span className="text-red-600 font-bold tabular-nums">{tabSwitchCount}</span>
            </p>
            <button
              type="button"
              onClick={() => setShowTabWarning(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              I Understand, Continue Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
