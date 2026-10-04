import React, { useState, useMemo } from 'react';
import { Exam, LeaderboardEntry } from '../types';
import { getLeaderboard } from '../services/storage';
import { Trophy, Medal, Clock, Award, Filter } from 'lucide-react';

interface LeaderboardViewProps {
  exams: Exam[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ exams }) => {
  const publishedExams = useMemo(
    () => exams.filter((e) => e.leaderboardVisibility !== false),
    [exams]
  );

  const [selectedExamId, setSelectedExamId] = useState<string>(
    publishedExams[0]?.id || ''
  );

  const currentExam = useMemo(
    () => exams.find((e) => e.id === selectedExamId),
    [exams, selectedExamId]
  );

  const entries: LeaderboardEntry[] = useMemo(() => {
    if (!selectedExamId) return [];
    return getLeaderboard(selectedExamId);
  }, [selectedExamId]);

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6 font-english">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Merit Ranking System</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">EXAM LEADERBOARD</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            মেধা তালিকা — সর্বোচ্চ প্রাপ্ত নম্বর এবং সাবমিশন সময় অনুসারে ক্রমবিন্যাস
          </p>
        </div>

        {/* Exam Selector Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Select Examination
          </label>
          <div className="relative">
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
            >
              {publishedExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Exam Information Banner */}
      {currentExam && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Examination</span>
            <span className="font-bold text-slate-900 text-sm">{currentExam.title}</span>
            <span className="text-slate-500 block text-[11px] font-bangla">
              টপিক: {currentExam.topic}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Candidates</span>
              <span className="font-bold text-slate-800 tabular-nums">{entries.length}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Marks</span>
              <span className="font-bold text-slate-800 tabular-nums">{currentExam.totalMarks}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Negative Marking</span>
              <span className="font-bold text-red-600 tabular-nums">
                -{currentExam.negativeMarking} per wrong
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {entries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No submissions recorded yet for this exam.</p>
          <p className="font-bangla mt-1">শিক্ষার্থীদের পরীক্ষা সম্পন্ন হওয়ার পর মেধা তালিকা দৃশ্যমান হবে।</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-20 text-center">Rank</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4 text-center">Final Score</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Time Taken</th>
                  <th className="py-3 px-4 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry) => {
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;

                  let rankBadge = (
                    <span className="font-mono font-bold text-slate-600 tabular-nums">
                      #{entry.rank}
                    </span>
                  );

                  if (isTop1) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 text-xs shadow-xs">
                        🥇 1
                      </span>
                    );
                  } else if (isTop2) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold border border-slate-300 text-xs">
                        🥈 2
                      </span>
                    );
                  } else if (isTop3) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 text-xs">
                        🥉 3
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={`${entry.studentStudentId}-${entry.rank}`}
                      className={`hover:bg-slate-50 transition-colors ${
                        isTop1 ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">{rankBadge}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{entry.studentName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums">
                        {entry.studentStudentId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{entry.batchName || 'General'}</td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-sky-900 text-sm tabular-nums">
                        {entry.finalScore}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-emerald-800 tabular-nums">
                        {entry.percentage}%
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                        {formatSeconds(entry.timeTakenSeconds)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 tabular-nums">
                        {new Date(entry.submittedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
