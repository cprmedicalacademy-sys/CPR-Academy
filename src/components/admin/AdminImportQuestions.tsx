import React, { useState } from 'react';
import { Exam, ImportedQuestionDraft, OptionKey } from '../../types';
import { saveQuestionsBatch } from '../../services/storage';
import { DEMO_QUESTIONS } from '../../data/demoExamData';
import {
  FileUp,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AdminImportQuestionsProps {
  exams: Exam[];
  onImportCompleted: (examId: string) => void;
}

export const AdminImportQuestions: React.FC<AdminImportQuestionsProps> = ({
  exams,
  onImportCompleted,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [draftQuestions, setDraftQuestions] = useState<ImportedQuestionDraft[]>([]);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [importSource, setImportSource] = useState<'none' | 'pdf' | 'csv' | 'excel'>('none');
  const [filterErrorOnly, setFilterErrorOnly] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState('');

  // Edit draft item states
  const [editText, setEditText] = useState('');
  const [editOptA, setEditOptA] = useState('');
  const [editOptB, setEditOptB] = useState('');
  const [editOptC, setEditOptC] = useState('');
  const [editOptD, setEditOptD] = useState('');
  const [editAns, setEditAns] = useState<OptionKey>('A');

  // Load official demo PDF extract: "Math 01 Question.pdf" (Questions 1 to 40 + Answer Sheet)
  const handleLoadDemoPdf = () => {
    setImportSource('pdf');
    const drafts: ImportedQuestionDraft[] = DEMO_QUESTIONS.map((q, idx) => ({
      id: `draft-${idx + 1}`,
      questionNumber: q.questionNumber,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
      explanation: q.explanation,
      status: 'approved',
    }));

    // Inject one intentional flag to test admin error review workflow
    drafts[11].validationError = 'Missing Option C format verify';
    drafts[11].status = 'has_error';

    setDraftQuestions(drafts);
    setImportSuccessMessage('');
  };

  // Simulate CSV / Excel import
  const handleSimulateCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportSource('csv');
    // Parse sample CSV or standard structure
    const drafts: ImportedQuestionDraft[] = [
      {
        id: 'draft-csv-1',
        questionNumber: 1,
        questionText: '১. logₐ7 + logₐ√7 + logₐ√7 = ?',
        optionA: 'K. logₐ10',
        optionB: 'L. logₐ40',
        optionC: 'M. logₐ49',
        optionD: 'N. logₐ35',
        correctAnswer: 'C',
        marks: 1,
        negativeMarks: 0.5,
        explanation: 'logₐ(7 × 7) = logₐ49',
        status: 'approved',
      },
      {
        id: 'draft-csv-2',
        questionNumber: 2,
        questionText: '২. 25√5 এর 5 ভিত্তিক লগ কত?',
        optionA: 'K. 5/2',
        optionB: 'L. 1/2',
        optionC: 'M. 125/2',
        optionD: 'N. 25/2',
        correctAnswer: 'A',
        marks: 1,
        negativeMarks: 0.5,
        status: 'approved',
      },
      {
        id: 'draft-csv-3',
        questionNumber: 3,
        questionText: '৩. {x : x ঋণাত্মক পূর্ণ সংখ্যা এবং x² < 18} উপাদানগুলো হবে?',
        optionA: 'K. {1,2,3,5}',
        optionB: 'L. {1,3,5,7}',
        optionC: '',
        optionD: 'N. {1,2,3,4}',
        correctAnswer: 'D',
        marks: 1,
        negativeMarks: 0.5,
        validationError: 'Missing Option C',
        status: 'has_error',
      },
    ];

    setDraftQuestions(drafts);
  };

  const startEditDraft = (d: ImportedQuestionDraft) => {
    setEditingDraftId(d.id);
    setEditText(d.questionText);
    setEditOptA(d.optionA);
    setEditOptB(d.optionB);
    setEditOptC(d.optionC);
    setEditOptD(d.optionD);
    setEditAns(d.correctAnswer);
  };

  const saveEditDraft = (id: string) => {
    setDraftQuestions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;

        const hasValidOpts =
          editText.trim() &&
          editOptA.trim() &&
          editOptB.trim() &&
          editOptC.trim() &&
          editOptD.trim();

        return {
          ...d,
          questionText: editText,
          optionA: editOptA,
          optionB: editOptB,
          optionC: editOptC,
          optionD: editOptD,
          correctAnswer: editAns,
          validationError: hasValidOpts ? undefined : 'Incomplete options or text',
          status: hasValidOpts ? 'approved' : 'has_error',
        };
      })
    );
    setEditingDraftId(null);
  };

  const deleteDraft = (id: string) => {
    setDraftQuestions((prev) => prev.filter((d) => d.id !== id));
  };

  const approveDraft = (id: string) => {
    setDraftQuestions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'approved', validationError: undefined } : d))
    );
  };

  // Confirm import into destination exam
  const handleConfirmImport = () => {
    if (!selectedExamId) {
      alert('Please select an exam to import questions into.');
      return;
    }

    const hasErrors = draftQuestions.some((d) => d.status === 'has_error');
    if (hasErrors) {
      alert('Please resolve or delete flagged questions before confirming import.');
      return;
    }

    const payload = draftQuestions.map((d) => ({
      questionNumber: d.questionNumber,
      questionText: d.questionText,
      optionA: d.optionA,
      optionB: d.optionB,
      optionC: d.optionC,
      optionD: d.optionD,
      correctAnswer: d.correctAnswer,
      marks: d.marks,
      negativeMarks: d.negativeMarks,
      explanation: d.explanation,
    }));

    saveQuestionsBatch(selectedExamId, payload);
    setImportSuccessMessage(
      `Successfully imported ${payload.length} questions into selected examination!`
    );
    setDraftQuestions([]);
    onImportCompleted(selectedExamId);
  };

  const errorCount = draftQuestions.filter((d) => d.status === 'has_error').length;
  const filteredDrafts = filterErrorOnly
    ? draftQuestions.filter((d) => d.status === 'has_error')
    : draftQuestions;

  return (
    <div className="space-y-8 font-english pb-16">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">IMPORT QUESTIONS</h1>
        <p className="text-xs text-slate-500 font-bangla mt-0.5">
          এক্সেল, সিএসভি অথবা পিডিএফ প্রশ্নপত্র থেকে সরাসরি প্রশ্ন সংগ্রহ ও অনুমোদন ব্যবস্থা
        </p>
      </div>

      {importSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{importSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportSuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Zone & Demo Source Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source 1: Demo PDF "Math 01 Question.pdf" */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Uploaded Source PDF</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Math 01 Question.pdf</h3>
            <p className="text-xs text-slate-600 font-bangla mt-1">
              SPECIAL BCS CRYSTAL BATCH — Topic: গাণিতিক যুক্তি (Questions 1 to 40 + Official Answer Sheet 1 to 40).
            </p>
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-slate-800">Verified PDF Source Contents:</p>
              <ul className="text-slate-600 list-disc list-inside text-[11px] space-y-0.5">
                <li>Questions 1–40 faithfully extracted</li>
                <li>4 Options per question (K=A, L=B, M=C, N=D)</li>
                <li>Official Answer Sheet (1–40) integrated</li>
                <li>Negative marking formula: -0.5 per wrong</li>
              </ul>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLoadDemoPdf}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Load & Review Math 01 PDF Questions</span>
            </button>
          </div>
        </div>

        {/* Source 2: Excel / CSV File Uploader */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Excel & CSV Spreadsheet Import</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Custom Question Paper Upload</h3>
            <p className="text-xs text-slate-600 font-bangla mt-1">
              এক্সেল বা সিএসভি ফাইল আপলোড করুন। ফাইলটিতে প্রশ্ন, অপশন A-D ও সঠিক উত্তর থাকতে হবে।
            </p>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-slate-800">Required Column Headers:</p>
              <p className="text-slate-500 font-mono text-[11px]">
                Question Number, Question, Option A, Option B, Option C, Option D, Correct Answer, Marks, Negative Marks, Explanation
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100">
            <label className="w-full py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider">
              <FileUp className="w-4 h-4" />
              <span>Upload CSV / Excel File</span>
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .pdf"
                onChange={handleSimulateCsvImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* DEDICATED PDF / CSV IMPORT REVIEW SCREEN */}
      {draftQuestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header of review */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>
                  {importSource === 'pdf' ? 'PDF IMPORT REVIEW' : 'IMPORT PREVIEW & AUDIT'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Review Extracted Questions ({draftQuestions.length} Total)
              </h2>
              <p className="text-xs text-slate-500 font-bangla mt-0.5">
                অনুগ্রহ করে প্রশ্ন, অপশন ও সঠিক উত্তর যাচাই করুন। ত্রুটি থাকলে সম্পাদনা করে নিশ্চিত করুন।
              </p>
            </div>

            <div className="flex items-center gap-3">
              {errorCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterErrorOnly(!filterErrorOnly)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                    filterErrorOnly
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errorCount} Flagged Errors</span>
                </button>
              )}

              {/* Destination Exam Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600 whitespace-nowrap">
                  Target Exam:
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs uppercase tracking-wider whitespace-nowrap"
              >
                CONFIRM IMPORT
              </button>
            </div>
          </div>

          {/* Error Banner if any */}
          {errorCount > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Validation Attention Required ({errorCount} question(s)):</span>
              </div>
              {draftQuestions
                .filter((d) => d.status === 'has_error')
                .map((d) => (
                  <p key={d.id} className="text-[11px] text-amber-800">
                    Question {d.questionNumber}: {d.validationError || 'Missing options or format issue'}
                  </p>
                ))}
            </div>
          )}

          {/* Questions Review List */}
          <div className="space-y-4">
            {filteredDrafts.map((d, idx) => {
              const isEditing = editingDraftId === d.id;
              const hasError = d.status === 'has_error';

              return (
                <div
                  key={d.id}
                  className={`p-5 rounded-xl border text-xs transition-all ${
                    hasError
                      ? 'border-red-300 bg-red-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Editing Mode */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-bold text-slate-800 text-xs font-mono">
                          Editing Question #{d.questionNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveEditDraft(d.id)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Changes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingDraftId(null)}
                            className="px-3 py-1 bg-slate-200 text-slate-700 rounded font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Question Text</label>
                        <textarea
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bangla"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 font-bangla">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600">Option A</label>
                          <input
                            type="text"
                            value={editOptA}
                            onChange={(e) => setEditOptA(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600">Option B</label>
                          <input
                            type="text"
                            value={editOptB}
                            onChange={(e) => setEditOptB(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600">Option C</label>
                          <input
                            type="text"
                            value={editOptC}
                            onChange={(e) => setEditOptC(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600">Option D</label>
                          <input
                            type="text"
                            value={editOptD}
                            onChange={(e) => setEditOptD(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <span className="font-bold text-slate-700">Correct Answer:</span>
                        {(['A', 'B', 'C', 'D'] as OptionKey[]).map((k) => (
                          <label key={k} className="flex items-center gap-1 cursor-pointer font-bold">
                            <input
                              type="radio"
                              name={`editAns-${d.id}`}
                              checked={editAns === k}
                              onChange={() => setEditAns(k)}
                            />
                            <span>Option {k}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Read / Audit Mode */
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 font-bold text-slate-800 rounded font-mono text-[11px]">
                            Q{String(d.questionNumber).padStart(2, '0')}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                            Detected Answer: {d.correctAnswer}
                          </span>
                          {hasError && (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[11px]">
                              {d.validationError || 'Flagged for review'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {hasError && (
                            <button
                              type="button"
                              onClick={() => approveDraft(d.id)}
                              className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 cursor-pointer"
                              title="Approve Question"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => startEditDraft(d)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDraft(d.id)}
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-slate-900 font-bangla mb-3 leading-relaxed">
                        {d.questionText}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-bangla">
                        {(['A', 'B', 'C', 'D'] as OptionKey[]).map((k) => {
                          const optText =
                            k === 'A'
                              ? d.optionA
                              : k === 'B'
                              ? d.optionB
                              : k === 'C'
                              ? d.optionC
                              : d.optionD;

                          const isAns = d.correctAnswer === k;

                          return (
                            <div
                              key={k}
                              className={`p-2 rounded border flex items-center justify-between text-xs ${
                                isAns
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span>
                                <strong className="font-mono mr-1.5">{k}.</strong>
                                {optText || <em className="text-red-500 font-normal">Missing</em>}
                              </span>
                              {isAns && (
                                <span className="text-[10px] uppercase font-bold text-emerald-700 shrink-0 ml-1">
                                  ✓ Key
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDraftQuestions([])}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer font-bold text-xs"
            >
              Cancel Import
            </button>

            <button
              type="button"
              onClick={handleConfirmImport}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs uppercase tracking-wider"
            >
              CONFIRM IMPORT ({draftQuestions.length} Questions)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
