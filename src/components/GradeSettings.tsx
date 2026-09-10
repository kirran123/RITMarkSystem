import React, { useState } from 'react';
import { GradeInfo, UserSession } from '../types';
import {
  Award,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  BookOpen
} from 'lucide-react';

interface GradeSettingsProps {
  user: UserSession | null;
  grades: GradeInfo[];
  onUpdateGrade: (oldGradeKey: string, updated: GradeInfo) => void;
  onAddGrade: (grade: GradeInfo) => void;
  onDeleteGrade: (gradeKey: string) => void;
  onResetGrades: () => void;
}

export const GradeSettings: React.FC<GradeSettingsProps> = ({
  user,
  grades,
  onUpdateGrade,
  onAddGrade,
  onDeleteGrade,
  onResetGrades,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeInfo | null>(null);
  const [form, setForm] = useState<GradeInfo>({
    grade: '',
    points: 10,
    marks: 100,
    label: '',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-500',
  });

  const handleOpenAdd = () => {
    setEditingGrade(null);
    setForm({
      grade: '',
      points: 8,
      marks: 80,
      label: 'Performance Level',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      badgeText: 'text-blue-700',
      borderColor: 'border-blue-500',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (grade: GradeInfo) => {
    setEditingGrade(grade);
    setForm({ ...grade });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGrade = form.grade.trim().toUpperCase();
    if (!cleanGrade) {
      alert('Letter Grade is required.');
      return;
    }

    const updatedInfo: GradeInfo = {
      ...form,
      grade: cleanGrade,
      points: Number(form.points),
      marks: Math.max(0, Math.min(100, Number(form.marks))),
    };

    if (editingGrade) {
      onUpdateGrade(editingGrade.grade, updatedInfo);
    } else {
      onAddGrade(updatedInfo);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (gradeKey: string) => {
    if (grades.length <= 1) {
      alert('At least one grade must remain configured in the system.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove Grade "${gradeKey}"?`)) {
      onDeleteGrade(gradeKey);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all letter grades and marks to official RIT Autonomous standards?'
      )
    ) {
      onResetGrades();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0b192c] text-amber-400 flex items-center justify-center shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  Academic Configuration
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                  {user?.role === 'admin' ? 'Admin Access' : 'Staff Access'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
                Letter Grade & Marks Scheme Editor
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Configure letter grades, assigned percentage marks, and grade points (GP). Modifications dynamically propagate to the <strong>Public Landing Page</strong>, the <strong>Mark Calculator</strong>, and <strong>Certified PDF statements</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset to Standard
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#0b192c] hover:bg-blue-950 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            Add Grade Row
          </button>
        </div>
      </div>

      {/* Sync Notification Card */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 shadow-2xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <div>
          <span className="font-bold">Real-time Public Synchronization: </span>
          <span>
            Any changes saved here will immediately update the official grade table on the Public Landing page and recalculate mark totals for students and faculty.
          </span>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-900" />
            Configured Letter Grades ({grades.length} Total)
          </h3>
          <span className="text-xs font-medium text-slate-500">
            Base: 100 Marks System
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0b192c] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Letter Grade</th>
                <th className="py-3.5 px-6">Performance Level Description</th>
                <th className="py-3.5 px-6 text-center">Grade Point (GP)</th>
                <th className="py-3.5 px-6 text-center">Assigned Mark Value</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((grade) => (
                <tr key={grade.grade} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border shadow-2xs ${grade.badgeBg}`}
                    >
                      {grade.grade}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">{grade.label}</td>
                  <td className="py-4 px-6 text-center font-black text-blue-950 text-sm">
                    {grade.points}
                  </td>
                  <td className="py-4 px-6 text-center font-black text-amber-600 text-sm">
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                      {grade.marks} Marks
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(grade)}
                        className="px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(grade.grade)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Grade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Grade Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#0b192c] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Grade Configuration
                </span>
                <h4 className="text-lg font-bold font-['Outfit',sans-serif]">
                  {editingGrade ? `Edit Grade "${editingGrade.grade}"` : 'Add New Letter Grade'}
                </h4>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Letter Grade *
                </label>
                <input
                  type="text"
                  required
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  placeholder="e.g. A+, O, B"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Performance Level Description *
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Outstanding Performance"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Assigned Marks (0 - 100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={form.marks}
                    onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
                    placeholder="e.g. 90"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Grade Point (GP 0 - 10) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    required
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    placeholder="e.g. 9"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0b192c] hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
