import React, { useEffect, useMemo } from 'react';
import { ExamResult, Exam, Question, OptionKey } from '../types';
import { getExamById, getQuestions } from '../services/storage';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Calendar,
  ArrowLeft,
  Trophy,
  Printer,
  ShieldAlert,
} from 'lucide-react';

interface ExamResultViewProps {
  result: ExamResult;
  onBackToDashboard: () => void;
  onViewLeaderboard?: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  result,
  onBackToDashboard,
  onViewLeaderboard,
}) => {
  const exam: Exam | undefined = useMemo(() => getExamById(result.examId), [result.examId]);
  const questions: Question[] = useMemo(() => getQuestions(result.examId), [result.examId]);

  // Gentle celebration if positive score
  useEffect(() => {
    if (result.finalScore > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore in non-browser envs
      }
    }
  }, [result.finalScore]);

  const formatMinutesSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} Seconds`;
    if (secs === 0) return `${mins} Minutes`;
    return `${mins} Min ${secs} Sec`;
  };

  const formatTimeString = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const negativePenalty = (result.wrongCount * result.negativeMarkRate).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-english pb-16">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Result</span>
          </button>
        </div>
      </div>

      {/* Official Academy Result Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-10">
        {/* Academic Header */}
        <div className="text-center border-b border-slate-200 pb-6 mb-8">
          <span className="text-xs font-bold tracking-widest text-sky-800 uppercase block font-english">
            CPR MEDICAL ACADEMY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 uppercase font-english">
            EXAM RESULT
          </h1>
          <p className="text-xs text-slate-500 font-bangla mt-1">
            অনলাইন পরীক্ষা ফলাফল ও মেধা মূল্যায়ন বিবরণী
          </p>
        </div>

        {/* Student & Exam Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mb-8">
          <div className="space-y-1.5">
            <div>
              <span className="text-slate-400 block text-[11px]">Student Name:</span>
              <span className="text-base font-bold text-slate-900">{result.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Student ID:</span>
              <span className="font-semibold text-slate-800 tabular-nums">{result.studentStudentId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Batch:</span>
              <span className="font-medium text-slate-700">{result.batchName || 'General'}</span>
            </div>
          </div>

          <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-6">
            <div>
              <span className="text-slate-400 block text-[11px]">Exam:</span>
              <span className="text-base font-bold text-slate-900">{result.examTitle}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Start Time:</span>
                <span className="font-medium text-slate-700">{formatTimeString(result.startTime)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Submit Time:</span>
                <span className="font-medium text-slate-700">{formatTimeString(result.submittedAt)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Time Taken:</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {formatMinutesSeconds(result.timeTakenSeconds)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Score Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <span className="text-slate-500 block text-xs font-medium">Total MCQ</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums block mt-1">
              {result.totalQuestions}
            </span>
            <span className="text-[10px] text-slate-400 font-bangla">মোট প্রশ্ন</span>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-center">
            <span className="text-emerald-800 block text-xs font-semibold">সঠিক MCQ</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums block mt-1">
              {result.correctCount}
            </span>
            <span className="text-[10px] text-emerald-600 font-english">Correct Answers</span>
          </div>

          <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 text-center">
            <span className="text-red-800 block text-xs font-semibold">ভুল MCQ</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-red-600 tabular-nums block mt-1">
              {result.wrongCount}
            </span>
            <span className="text-[10px] text-red-600 font-english">Wrong Answers</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <span className="text-slate-600 block text-xs font-medium">উত্তর দেওয়া হয়নি</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-600 tabular-nums block mt-1">
              {result.unansweredCount}
            </span>
            <span className="text-[10px] text-slate-400 font-english">Unanswered</span>
          </div>
        </div>

        {/* EXACT NEGATIVE MARKING CALCULATION BANNER */}
        <div className="bg-sky-50 border-2 border-sky-300 rounded-xl p-6 text-center mb-8 space-y-3">
          <span className="text-xs font-bold text-sky-900 uppercase tracking-wider block">
            ফলাফল গণনার বিবরণ (Calculation Details)
          </span>

          <div className="inline-block bg-white border border-sky-200 px-6 py-3 rounded-lg shadow-xs">
            <p className="text-xs font-semibold text-slate-600 font-bangla mb-1">
              প্রাপ্ত ফলাফল = সঠিক MCQ − (ভুল MCQ সংখ্যা × ০.৫)
            </p>
            <p className="text-base sm:text-lg font-mono font-bold text-slate-900 tracking-wide">
              {result.correctCount} − ({result.wrongCount} × {result.negativeMarkRate}) ={' '}
              <span className="text-sky-900 text-xl font-extrabold">{result.finalScore}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-700">
            <div>
              <span className="text-slate-500">প্রাপ্ত ফলাফল: </span>
              <span className="text-lg font-extrabold text-sky-900 tabular-nums">
                {result.finalScore} / {result.totalMarks}
              </span>
            </div>
            <div className="border-l border-sky-200 pl-6">
              <span className="text-slate-500">Percentage: </span>
              <span className="text-lg font-extrabold text-emerald-800 tabular-nums">
                {result.percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab switch warning summary if detected */}
        {result.tabSwitchCount > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2 mb-8">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Recorded Window/Tab Switches during this examination session:{' '}
              <strong className="text-amber-950 tabular-nums">{result.tabSwitchCount} times</strong>.
            </span>
          </div>
        )}

        {/* Answer Review Section */}
        {exam?.answerReview && questions.length > 0 && (
          <div className="border-t border-slate-200 pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Answer Review</h3>
                <p className="text-xs text-slate-500 font-bangla mt-0.5">
                  সকল প্রশ্নের সঠিক উত্তর ও ব্যাখ্যা সহ বিস্তারিত পর্যালোচনা
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const studentAnswer = result.answersSnapshot[q.id];
                const isCorrect = studentAnswer === q.correctAnswer;
                const isUnanswered = !studentAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-xl border transition-all text-xs ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : isUnanswered
                        ? 'border-slate-200 bg-slate-50/50'
                        : 'border-red-200 bg-red-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-200 font-bold text-slate-800 rounded text-[11px] font-mono">
                          Q{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Marks: {q.marks} | Neg: -{q.negativeMarks}
                        </span>
                      </div>

                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ✓ Correct
                        </span>
                      ) : isUnanswered ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full text-[11px]">
                          — Not Answered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100/80 px-2.5 py-0.5 rounded-full text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          ✕ Wrong (-0.5)
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-bold text-slate-900 font-bangla mb-4 leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 font-bangla">
                      {(['A', 'B', 'C', 'D'] as OptionKey[]).map((key) => {
                        const optText =
                          key === 'A'
                            ? q.optionA
                            : key === 'B'
                            ? q.optionB
                            : key === 'C'
                            ? q.optionC
                            : q.optionD;

                        const isStudentChoice = studentAnswer === key;
                        const isCorrectChoice = q.correctAnswer === key;

                        let style = 'bg-white border-slate-200 text-slate-700';
                        if (isCorrectChoice) {
                          style = 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isStudentChoice && !isCorrectChoice) {
                          style = 'bg-red-100 border-red-300 text-red-900 font-medium';
                        }

                        return (
                          <div
                            key={key}
                            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${style}`}
                          >
                            <span className="leading-snug">
                              <strong className="font-mono mr-1.5">{key}.</strong>
                              {optText}
                            </span>
                            {isCorrectChoice && (
                              <span className="text-[10px] font-bold text-emerald-800 uppercase ml-2 shrink-0">
                                Correct
                              </span>
                            )}
                            {isStudentChoice && !isCorrectChoice && (
                              <span className="text-[10px] font-bold text-red-700 uppercase ml-2 shrink-0">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-bangla">
                        <strong className="font-english text-sky-900 block mb-0.5 text-[11px] uppercase tracking-wider">
                          ব্যাখ্যা (Explanation):
                        </strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
