import React, { useState } from 'react';
import { Exam, Batch, ExamStatus } from '../../types';
import {
  createExam,
  updateExam,
  deleteExam,
} from '../../services/storage';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  Calendar,
  Clock,
  Send,
  X,
} from 'lucide-react';

interface AdminExamsProps {
  exams: Exam[];
  batches: Batch[];
  onExamsUpdated: () => void;
  onManageQuestions: (examId: string) => void;
}

export const AdminExams: React.FC<AdminExamsProps> = ({
  exams,
  batches,
  onExamsUpdated,
  onManageQuestions,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [batchId, setBatchId] = useState(batches[0]?.id || 'batch-special-bcs');
  const [totalQuestions, setTotalQuestions] = useState(40);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [totalMarks, setTotalMarks] = useState(40);
  const [negativeMarking, setNegativeMarking] = useState(0.5);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [endTime, setEndTime] = useState('23:59');
  const [status, setStatus] = useState<ExamStatus>('draft');
  const [resultVisibility, setResultVisibility] = useState(true);
  const [leaderboardVisibility, setLeaderboardVisibility] = useState(true);
  const [answerReview, setAnswerReview] = useState(true);
  const [questionRandomization, setQuestionRandomization] = useState(false);
  const [optionRandomization, setOptionRandomization] = useState(false);

  const resetForm = () => {
    setEditingExamId(null);
    setTitle('');
    setSubject('');
    setTopic('');
    setDescription('');
    setBatchId(batches[0]?.id || '');
    setTotalQuestions(40);
    setDurationMinutes(40);
    setTotalMarks(40);
    setNegativeMarking(0.5);
    setStartDate('2026-01-01');
    setStartTime('09:00');
    setEndDate('2026-12-31');
    setEndTime('23:59');
    setStatus('draft');
    setResultVisibility(true);
    setLeaderboardVisibility(true);
    setAnswerReview(true);
    setQuestionRandomization(false);
    setOptionRandomization(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExamId(exam.id);
    setTitle(exam.title);
    setSubject(exam.subject);
    setTopic(exam.topic);
    setDescription(exam.description);
    setBatchId(exam.batchId);
    setTotalQuestions(exam.totalQuestions);
    setDurationMinutes(exam.durationMinutes);
    setTotalMarks(exam.totalMarks);
    setNegativeMarking(exam.negativeMarking);
    setStartDate(exam.startDate);
    setStartTime(exam.startTime);
    setEndDate(exam.endDate);
    setEndTime(exam.endTime);
    setStatus(exam.status);
    setResultVisibility(exam.resultVisibility);
    setLeaderboardVisibility(exam.leaderboardVisibility);
    setAnswerReview(exam.answerReview);
    setQuestionRandomization(exam.questionRandomization);
    setOptionRandomization(exam.optionRandomization);
    setShowModal(true);
  };

  const handleDuplicate = (exam: Exam) => {
    const selectedBatch = batches.find((b) => b.id === exam.batchId);
    createExam({
      ...exam,
      title: `${exam.title} (Copy)`,
      status: 'draft',
      batchName: selectedBatch?.batchName || exam.batchName,
    });
    onExamsUpdated();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam and its questions?')) {
      deleteExam(id);
      onExamsUpdated();
    }
  };

  const handleTogglePublish = (exam: Exam) => {
    const nextStatus: ExamStatus = exam.status === 'published' ? 'draft' : 'published';
    updateExam(exam.id, { status: nextStatus });
    onExamsUpdated();
  };

  const handleSubmit = (e: React.FormEvent, publishImmediately = false) => {
    e.preventDefault();
    const selectedBatch = batches.find((b) => b.id === batchId);
    const chosenStatus: ExamStatus = publishImmediately ? 'published' : status;

    const payload = {
      title,
      subject,
      topic,
      description,
      batchId,
      batchName: selectedBatch?.batchName || 'General Batch',
      totalQuestions: Number(totalQuestions),
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      negativeMarking: Number(negativeMarking),
      startDate,
      startTime,
      endDate,
      endTime,
      status: chosenStatus,
      resultVisibility,
      leaderboardVisibility,
      answerReview,
      questionRandomization,
      optionRandomization,
    };

    if (editingExamId) {
      updateExam(editingExamId, payload);
    } else {
      createExam(payload);
    }

    setShowModal(false);
    onExamsUpdated();
  };

  return (
    <div className="space-y-6 font-english">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">EXAM MANAGEMENT</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            অনলাইন পরীক্ষা তৈরি, সম্পাদনা, সময়সূচী নির্ধারণ ও প্রকাশনা
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Exam</span>
        </button>
      </div>

      {/* Exam List Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Exam Title</th>
                <th className="py-3 px-4">Topic / Subject</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4 text-center">Questions</th>
                <th className="py-3 px-4 text-center">Duration</th>
                <th className="py-3 px-4 text-center">Neg. Mark</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {exam.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="font-semibold block">{exam.subject}</span>
                    <span className="text-[11px] text-slate-500 font-bangla">{exam.topic}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{exam.batchName}</td>
                  <td className="py-3.5 px-4 text-center tabular-nums font-medium text-slate-800">
                    {exam.totalQuestions}
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums text-slate-700">
                    {exam.durationMinutes}m
                  </td>
                  <td className="py-3.5 px-4 text-center tabular-nums font-bold text-red-600">
                    -{exam.negativeMarking}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm border uppercase tracking-wider ${
                        exam.status === 'published' || exam.status === 'live'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onManageQuestions(exam.id)}
                        className="px-2 py-1 text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 rounded cursor-pointer"
                        title="Manage Questions"
                      >
                        Questions
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTogglePublish(exam)}
                        className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
                          exam.status === 'published'
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        title="Toggle Publish Status"
                      >
                        {exam.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(exam)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        title="Edit Exam"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(exam)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        title="Duplicate Exam"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(exam.id)}
                        className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete Exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-base font-bold">
                {editingExamId ? 'Edit Exam Details' : 'Create New Examination'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SPECIAL BCS CRYSTAL BATCH"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematical Reasoning"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Mathematical Logic (গাণিতিক যুক্তি)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide exam details, instructions or syllabus..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Batch</label>
                  <select
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ExamStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Numerical Config */}
              <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total MCQ</label>
                  <input
                    type="number"
                    min="1"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    min="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-red-700 mb-1">Neg. Marking</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={negativeMarking}
                    onChange={(e) => setNegativeMarking(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-red-300 rounded text-xs bg-white font-bold text-red-700"
                  />
                </div>
              </div>

              {/* Start & End Window */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Start Date & Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-2 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">End Date & Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-2 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Exam Settings Toggles */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block font-bold text-slate-800 mb-2">Examination Settings</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resultVisibility}
                      onChange={(e) => setResultVisibility(e.target.checked)}
                      className="rounded border-slate-300 text-sky-700"
                    />
                    <span>Result Visibility to Students</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leaderboardVisibility}
                      onChange={(e) => setLeaderboardVisibility(e.target.checked)}
                      className="rounded border-slate-300 text-sky-700"
                    />
                    <span>Leaderboard Visibility</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={answerReview}
                      onChange={(e) => setAnswerReview(e.target.checked)}
                      className="rounded border-slate-300 text-sky-700"
                    />
                    <span>Allow Answer & Explanation Review</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={questionRandomization}
                      onChange={(e) => setQuestionRandomization(e.target.checked)}
                      className="rounded border-slate-300 text-sky-700"
                    />
                    <span>Question Randomization</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg cursor-pointer font-bold text-xs"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg cursor-pointer font-bold text-xs shadow-xs uppercase tracking-wider"
                >
                  Publish Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
