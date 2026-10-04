import React, { useState, useMemo } from 'react';
import { Profile, ExamResult, Batch } from '../../types';
import { updateProfile, getResultsByStudentId, createStudent, deleteProfile, clearAllStudents } from '../../services/storage';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  History,
  X,
  Phone,
  Mail,
  Plus,
  Trash2,
} from 'lucide-react';

interface AdminStudentsProps {
  students: Profile[];
  batches: Batch[];
  onStudentsUpdated: () => void;
}

export const AdminStudents: React.FC<AdminStudentsProps> = ({
  students,
  batches,
  onStudentsUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<Profile | null>(null);

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newMobileNumber, setNewMobileNumber] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBatchId, setNewBatchId] = useState(batches[0]?.id || '');
  const [formError, setFormError] = useState('');

  const studentList = useMemo(
    () => students.filter((s) => s.role === 'student'),
    [students]
  );

  const filteredStudents = useMemo(() => {
    return studentList.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mobileNumber.includes(searchQuery) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBatch =
        selectedBatchFilter === 'all' || s.batchId === selectedBatchFilter;

      return matchesSearch && matchesBatch;
    });
  }, [studentList, searchQuery, selectedBatchFilter]);

  const handleToggleActive = (student: Profile) => {
    updateProfile({
      id: student.id,
      isActive: !student.isActive,
    });
    onStudentsUpdated();
  };

  const handleDeleteStudent = (student: Profile) => {
    if (window.confirm(`Are you sure you want to remove student "${student.fullName}"?`)) {
      deleteProfile(student.id);
      onStudentsUpdated();
    }
  };

  const handleClearAllStudents = () => {
    if (window.confirm('Are you sure you want to clear all registered students? Only admin account will be kept.')) {
      clearAllStudents();
      onStudentsUpdated();
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newFullName.trim()) {
      setFormError('Student full name is required.');
      return;
    }

    try {
      createStudent({
        fullName: newFullName.trim(),
        studentId: newStudentId.trim() || undefined,
        mobileNumber: newMobileNumber.trim() || undefined,
        email: newEmail.trim() || undefined,
        batchId: newBatchId,
      });

      setNewFullName('');
      setNewStudentId('');
      setNewMobileNumber('');
      setNewEmail('');
      setShowAddModal(false);
      onStudentsUpdated();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add student.');
    }
  };

  const studentHistoryResults: ExamResult[] = useMemo(() => {
    if (!selectedStudentHistory) return [];
    return getResultsByStudentId(selectedStudentHistory.id);
  }, [selectedStudentHistory]);

  return (
    <div className="space-y-6 font-english pb-12">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">STUDENT MANAGEMENT</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            শিক্ষার্থীদের তালিকা, নতুন শিক্ষার্থী যোগ ও সক্রিয়করণ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, ID, Mobile..."
              className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-52 focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
            />
          </div>

          {/* Batch Filter */}
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-600 focus:outline-hidden"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batchName}
              </option>
            ))}
          </select>

          {studentList.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllStudents}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Remove all registered students"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Clear All</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setFormError('');
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student ID / Reg</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Assigned Batch</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600 mb-1">No students registered yet</p>
                    <p className="text-xs text-slate-400 font-bangla">
                      শিক্ষার্থী যোগ করতে ওপরের &apos;Add Student&apos; বাটন ক্লিক করুন অথবা শিক্ষার্থী লগইন পেইজ থেকে শিক্ষার্থীরা সরাসরি প্রবেশ করতে পারবে।
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-900">
                      {st.studentId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {st.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      {st.mobileNumber && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{st.mobileNumber}</span>
                        </div>
                      )}
                      {st.email && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3" />
                          <span>{st.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {st.batchName || 'General'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-sm border uppercase tracking-wider ${
                          st.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-red-50 text-red-700 border-red-300'
                        }`}
                      >
                        {st.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentHistory(st)}
                          className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 rounded cursor-pointer flex items-center gap-1"
                        >
                          <History className="w-3 h-3" />
                          <span>History</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(st)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                            st.isActive
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {st.isActive ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(st)}
                          className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900">Add New Student (শিক্ষার্থী যোগ করুন)</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name <span className="font-bangla font-normal text-slate-500">(শিক্ষার্থীর নাম)</span> *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Dr. Mohammad Tanvir"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Registration No / Student ID <span className="font-bangla font-normal text-slate-400">(ঐচ্ছিক - না দিলে অটো জেনারেট হবে)</span>
                </label>
                <input
                  type="text"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  placeholder="e.g. CPR-BCS-01 (ঐচ্ছিক)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={newMobileNumber}
                    onChange={(e) => setNewMobileNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Batch</label>
                <select
                  value={newBatchId}
                  onChange={(e) => setNewBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Result History Modal */}
      {selectedStudentHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-english">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-bold">Exam History for {selectedStudentHistory.fullName}</h3>
                <p className="text-[11px] text-sky-400 font-mono">
                  {selectedStudentHistory.studentId} • {selectedStudentHistory.batchName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentHistory(null)}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {studentHistoryResults.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  This student has not attempted any exams yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {studentHistoryResults.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">{r.examTitle}</h4>
                        <span className="text-[11px] text-slate-400">
                          Submitted: {new Date(r.submittedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                          <span className="text-emerald-700">Correct: {r.correctCount}</span>
                          <span>•</span>
                          <span className="text-red-600">Wrong: {r.wrongCount}</span>
                          <span>•</span>
                          <span>Unanswered: {r.unansweredCount}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-sky-900 tabular-nums block">
                          {r.finalScore} / {r.totalMarks}
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 tabular-nums">
                          {r.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
