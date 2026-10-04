import React, { useState, useMemo } from 'react';
import { ExamResult, Exam, Batch } from '../../types';
import {
  Award,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  Filter,
  Eye,
  ShieldAlert,
  X,
} from 'lucide-react';
import { ExamResultView } from '../ExamResultView';

interface AdminResultsProps {
  results: ExamResult[];
  exams: Exam[];
  batches: Batch[];
}

export const AdminResults: React.FC<AdminResultsProps> = ({ results, exams, batches }) => {
  const [selectedExamFilter, setSelectedExamFilter] = useState('all');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedResultForDetail, setSelectedResultForDetail] = useState<ExamResult | null>(null);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const matchExam = selectedExamFilter === 'all' || r.examId === selectedExamFilter;
      const matchBatch = selectedBatchFilter === 'all' || r.batchName === selectedBatchFilter;
      const matchSearch =
        r.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
        r.studentStudentId.toLowerCase().includes(searchStudent.toLowerCase());

      return matchExam && matchBatch && matchSearch;
    });
  }, [results, selectedExamFilter, selectedBatchFilter, searchStudent]);

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Student Name',
      'Student ID',
      'Exam',
      'Correct MCQ',
      'Wrong MCQ',
      'Unanswered',
      'Final Score',
      'Percentage',
      'Time Taken',
      'Submission Time',
    ];

    const rows = filteredResults.map((r) => [
      r.rank || '—',
      `"${r.studentName}"`,
      r.studentStudentId,
      `"${r.examTitle}"`,
      r.correctCount,
      r.wrongCount,
      r.unansweredCount,
      r.finalScore,
      `${r.percentage}%`,
      formatSeconds(r.timeTakenSeconds),
      `"${new Date(r.submittedAt).toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `CPR_Academy_Results_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-english pb-16">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">EXAM RESULTS & SUBMISSIONS</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            সকল শিক্ষার্থীর প্রাপ্ত ফলাফল, মূল্যায়ন বিবরণ ও এক্সেল/সিএসভি এক্সপোর্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-600 mb-1">Filter by Exam</label>
          <select
            value={selectedExamFilter}
            onChange={(e) => setSelectedExamFilter(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
          >
            <option value="all">All Exams</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Filter by Batch</label>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.batchName}>
                {b.batchName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Search Student</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Name or Student ID..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Exam</th>
                <th className="py-3 px-4 text-center">Correct</th>
                <th className="py-3 px-4 text-center">Wrong</th>
                <th className="py-3 px-4 text-center">Unanswered</th>
                <th className="py-3 px-4 text-center">Final Score</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Time Taken</th>
                <th className="py-3 px-4 text-center">Tab Switches</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No results matched your selected filters.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-amber-700 font-mono">
                      {r.rank ? `#${r.rank}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{r.studentStudentId}</td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-[180px] truncate">
                      {r.examTitle}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700 tabular-nums">
                      {r.correctCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-red-600 tabular-nums">
                      {r.wrongCount}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400 tabular-nums">
                      {r.unansweredCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-sky-900 text-sm tabular-nums">
                      {r.finalScore}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 tabular-nums">
                      {r.percentage}%
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600 tabular-nums">
                      {formatSeconds(r.timeTakenSeconds)}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums">
                      {r.tabSwitchCount > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-red-600">
                          <ShieldAlert className="w-3 h-3" />
                          {r.tabSwitchCount}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedResultForDetail(r)}
                        className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 rounded cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Detail Modal */}
      {selectedResultForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Detailed Attempt Inspection: {selectedResultForDetail.studentName}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedResultForDetail(null)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ExamResultView
              result={selectedResultForDetail}
              onBackToDashboard={() => setSelectedResultForDetail(null)}
              onViewLeaderboard={() => setSelectedResultForDetail(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
