import React, { useState } from 'react';
import { Batch } from '../../types';
import { createBatch, updateBatch, deleteBatch } from '../../services/storage';
import { Layers, Plus, Edit2, Trash2, X, CheckCircle } from 'lucide-react';

interface AdminBatchesProps {
  batches: Batch[];
  onBatchesUpdated: () => void;
}

export const AdminBatches: React.FC<AdminBatchesProps> = ({ batches, onBatchesUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [batchName, setBatchName] = useState('');
  const [course, setCourse] = useState('');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  const openCreateModal = () => {
    setEditingBatch(null);
    setBatchName('');
    setCourse('Medical & BCS Preparation');
    setStartDate('2026-01-01');
    setEndDate('2026-12-31');
    setStatus('active');
    setShowModal(true);
  };

  const openEditModal = (b: Batch) => {
    setEditingBatch(b);
    setBatchName(b.batchName);
    setCourse(b.course);
    setStartDate(b.startDate);
    setEndDate(b.endDate);
    setStatus(b.status);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      deleteBatch(id);
      onBatchesUpdated();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBatch) {
      updateBatch(editingBatch.id, {
        batchName,
        course,
        startDate,
        endDate,
        status,
      });
    } else {
      createBatch({
        batchName,
        course,
        startDate,
        endDate,
        status,
        studentCount: 0,
      });
    }
    setShowModal(false);
    onBatchesUpdated();
  };

  return (
    <div className="space-y-6 font-english">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ACADEMIC BATCHES</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            ব্যাচ ব্যবস্থাপনা ও শিক্ষার্থী বরাদ্দকরণ
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 px-2 py-0.5 rounded bg-sky-50 border border-sky-200">
                  {batch.status}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(batch)}
                    className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(batch.id)}
                    className="p-1 text-slate-400 hover:text-red-700 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">{batch.batchName}</h3>
              <p className="text-xs text-slate-600 mt-1">{batch.course}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-semibold text-slate-700">{batch.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <span className="font-semibold text-slate-700">{batch.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enrolled Students:</span>
                  <span className="font-bold text-sky-800 tabular-nums">
                    {batch.studentCount || 0} Students
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g. SPECIAL BCS CRYSTAL BATCH"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Curriculum</label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Medical Entrance & BCS Preliminary"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'archived')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold uppercase tracking-wider"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
