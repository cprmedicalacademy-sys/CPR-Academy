import React from 'react';
import { ExamResult } from '../types';
import { Award, ArrowRight, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface MyResultsViewProps {
  results: ExamResult[];
  onViewResult: (result: ExamResult) => void;
  onGoToExams: () => void;
}

export const MyResultsView: React.FC<MyResultsViewProps> = ({
  results,
  onViewResult,
  onGoToExams,
}) => {
  return (
    <div className="space-y-6 font-english">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">MY RESULTS</h1>
        <p className="text-xs text-slate-500 font-bangla mt-1">
          আপনার সকল পরীক্ষার ফলাফল ও মূল্যায়ন ইতিহাস (নেগেটিভ মার্কিং সমেত)।
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Exam Results Found</h3>
          <p className="text-xs text-slate-500 font-bangla mt-1 mb-4">
            আপনি এখনো কোনো পরীক্ষায় অংশগ্রহণ করেননি।
          </p>
          <button
            type="button"
            onClick={onGoToExams}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Explore Available Exams
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Exam</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Total MCQ</th>
                  <th className="py-3 px-4 text-center">Correct</th>
                  <th className="py-3 px-4 text-center">Wrong</th>
                  <th className="py-3 px-4 text-center">Unanswered</th>
                  <th className="py-3 px-4 text-center">Final Score</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4 text-right">View Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {res.examTitle}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(res.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-medium text-slate-700">
                      {res.totalQuestions}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-bold text-emerald-700">
                      {res.correctCount}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-bold text-red-600">
                      {res.wrongCount}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums text-slate-400">
                      {res.unansweredCount}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-extrabold text-sky-900 text-sm">
                      {res.finalScore}
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-semibold text-slate-800">
                      {res.percentage}%
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-bold text-amber-700">
                      {res.rank ? `#${res.rank}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewResult(res)}
                        className="px-3 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 font-semibold rounded-md transition-colors cursor-pointer text-xs"
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
