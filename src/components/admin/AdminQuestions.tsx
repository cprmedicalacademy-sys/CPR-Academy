import React, { useState, useMemo } from 'react';
import { Question, Exam, OptionKey } from '../../types';
import {
  saveQuestion,
  deleteQuestion,
  getQuestions,
} from '../../services/storage';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  HelpCircle,
  X,
  FileQuestion,
  Filter,
} from 'lucide-react';

interface AdminQuestionsProps {
  exams: Exam[];
  selectedExamId?: string;
  onQuestionsUpdated: () => void;
}

export const AdminQuestions: React.FC<AdminQuestionsProps> = ({
  exams,
  selectedExamId: initialExamId,
  onQuestionsUpdated,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(
    initialExamId || exams[0]?.id || ''
  );

  const questions: Question[] = useMemo(() => {
    if (!selectedExamId) return [];
    return getQuestions(selectedExamId);
  }, [selectedExamId, onQuestionsUpdated]);

  const currentExam = useMemo(
    () => exams.find((e) => e.id === selectedExamId),
    [exams, selectedExamId]
  );

  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form states
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<OptionKey>('A');
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.5);
  const [explanation, setExplanation] = useState('');

  const openCreateModal = () => {
    setEditingQuestion(null);
    setQuestionNumber(questions.length + 1);
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('A');
    setMarks(1);
    setNegativeMarks(currentExam?.negativeMarking ?? 0.5);
    setExplanation('');
    setShowModal(true);
  };

  const openEditModal = (q: Question) => {
    setEditingQuestion(q);
    setQuestionNumber(q.questionNumber);
    setQuestionText(q.questionText);
    setOptionA(q.optionA);
    setOptionB(q.optionB);
    setOptionC(q.optionC);
    setOptionD(q.optionD);
    setCorrectAnswer(q.correctAnswer);
    setMarks(q.marks);
    setNegativeMarks(q.negativeMarks);
    setExplanation(q.explanation || '');
    setShowModal(true);
  };

  const handleDuplicate = (q: Question) => {
    saveQuestion({
      ...q,
      id: `q-${selectedExamId}-${Date.now()}`,
      questionNumber: questions.length + 1,
      questionText: `${q.questionText} (Copy)`,
    });
    onQuestionsUpdated();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(id);
      onQuestionsUpdated();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Question = {
      id: editingQuestion ? editingQuestion.id : `q-${selectedExamId}-${Date.now()}`,
      examId: selectedExamId,
      questionNumber: Number(questionNumber),
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      marks: Number(marks),
      negativeMarks: Number(negativeMarks),
      explanation,
    };

    saveQuestion(payload);
    setShowModal(false);
    onQuestionsUpdated();
  };

  return (
    <div className="space-y-6 font-english">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">QUESTION MANAGEMENT</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            ম্যানুয়াল প্রশ্ন ব্যাংক ব্যবস্থাপনা, অপশন সংযোজন ও সঠিক উত্তর নির্ধারণ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({ex.totalQuestions} Qs)
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!selectedExamId}
            onClick={openCreateModal}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Add MCQ</span>
          </button>
        </div>
      </div>

      {/* Selected Exam Summary Bar */}
      {currentExam && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700">
          <div>
            <span className="font-bold text-slate-900">{currentExam.title}</span>
            <span className="text-slate-500 font-bangla ml-2">টপিক: {currentExam.topic}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total Questions: <strong className="tabular-nums">{questions.length}</strong>
            </span>
            <span>
              Default Negative: <strong className="text-red-600 tabular-nums">-{currentExam.negativeMarking}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
          <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No questions found for this exam.</p>
          <p className="font-bangla mt-1">ম্যানুয়ালি প্রশ্ন যোগ করতে &apos;Add MCQ&apos; বা প্রশ্ন ইমপোর্ট করতে &apos;Import Questions&apos; ব্যবহার করুন।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all text-xs"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-xs font-mono">
                    Q{String(q.questionNumber || idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Marks: {q.marks} | Neg: -{q.negativeMarks}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px] mr-2">
                    Correct: {q.correctAnswer}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditModal(q)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(q)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm sm:text-base font-bold text-slate-900 font-bangla mb-4 leading-relaxed whitespace-pre-line">
                {q.questionText}
              </p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 font-bangla">
                {(['A', 'B', 'C', 'D'] as OptionKey[]).map((key) => {
                  const optText =
                    key === 'A'
                      ? q.optionA
                      : key === 'B'
                      ? q.optionB
                      : key === 'C'
                      ? q.optionC
                      : q.optionD;

                  const isCorrect = q.correctAnswer === key;

                  return (
                    <div
                      key={key}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                        isCorrect
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>
                        <strong className="font-mono mr-1.5">{key}.</strong>
                        {optText}
                      </span>
                      {isCorrect && (
                        <span className="text-[10px] uppercase font-bold text-emerald-700 shrink-0 ml-2">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation if exists */}
              {q.explanation && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-bangla text-xs">
                  <strong className="font-english text-slate-800 block text-[11px] mb-0.5">
                    ব্যাখ্যা (Explanation):
                  </strong>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-base font-bold">
                {editingQuestion ? 'Edit MCQ Question' : 'Add New MCQ Question'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Number</label>
                  <input
                    type="number"
                    required
                    value={questionNumber}
                    onChange={(e) => setQuestionNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    step="0.5"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-red-700 mb-1">Neg. Marks</label>
                  <input
                    type="number"
                    step="0.25"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-xs font-bold text-red-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Question Text (Bangla / English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question text here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bangla focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block font-bold text-slate-800">Four Options (A, B, C, D) *</label>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-700 w-6">A:</span>
                    <input
                      type="text"
                      required
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder="Option A text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bangla"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-700 w-6">B:</span>
                    <input
                      type="text"
                      required
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder="Option B text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bangla"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-700 w-6">C:</span>
                    <input
                      type="text"
                      required
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder="Option C text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bangla"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-700 w-6">D:</span>
                    <input
                      type="text"
                      required
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder="Option D text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bangla"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <label className="block font-bold text-emerald-900 mb-1">
                  Correct Answer (সঠিক উত্তর) *
                </label>
                <div className="flex items-center gap-4">
                  {(['A', 'B', 'C', 'D'] as OptionKey[]).map((key) => (
                    <label key={key} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={key}
                        checked={correctAnswer === key}
                        onChange={() => setCorrectAnswer(key)}
                        className="text-emerald-700"
                      />
                      <span>Option {key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation (Optional)</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Provide step-by-step mathematical or conceptual explanation..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bangla"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg cursor-pointer font-bold text-xs uppercase tracking-wider shadow-xs"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
