import React, { useState, useEffect } from 'react';
import { SubjectInput, GradeKey, CalculationResult, UserSession, GradeInfo } from '../types';
import { GRADE_MAP, GRADE_KEYS, calculateAcademicMetrics, generateDefaultSubjects } from '../utils/gradeData';
import { generateGradeSheetPdf } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import {
  Calculator as CalcIcon,
  Download,
  BookmarkPlus,
  Sparkles,
  CheckCircle,
  Sliders,
  TrendingUp,
  User,
  Check,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  X,
  Save,
  RotateCcw
} from 'lucide-react';

interface CalculatorProps {
  user: UserSession | null;
  onOpenLogin: () => void;
  onSaveRecord?: (calc: CalculationResult, semester: string) => Promise<void>;
  initialCalculation?: CalculationResult | null;
  isPublicMode?: boolean;
  grades?: GradeInfo[];
  gradeMap?: Record<string, GradeInfo>;
}

export const Calculator: React.FC<CalculatorProps> = ({
  user,
  onOpenLogin,
  onSaveRecord,
  initialCalculation,
  isPublicMode = false,
  grades,
  gradeMap,
}) => {
  const activeKeys: string[] = grades && grades.length > 0 ? grades.map((g) => g.grade) : GRADE_KEYS;
  const activeMap: Record<string, GradeInfo> = gradeMap || GRADE_MAP;

  const defaultGradeKey = activeKeys[1] || activeKeys[0] || 'A+';

  const [candidateName, setCandidateName] = useState<string>(user?.name || '');
  const [subjectCount, setSubjectCount] = useState<number>(8);
  const [subjects, setSubjects] = useState<SubjectInput[]>(() =>
    generateDefaultSubjects(8, defaultGradeKey)
  );
  const [semester, setSemester] = useState<string>('Mark Calculation');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Edit Subject Modal State
  const [editingSubject, setEditingSubject] = useState<SubjectInput | null>(null);
  const [editForm, setEditForm] = useState({ code: '', name: '' });

  // Sync user name if available
  useEffect(() => {
    if (user?.name && !candidateName) {
      setCandidateName(user.name);
    }
  }, [user]);

  // Sync initial calculation (e.g. from history reload)
  useEffect(() => {
    if (initialCalculation) {
      setCandidateName(initialCalculation.candidateName || user?.name || '');
      setSubjectCount(initialCalculation.subjectCount);
      setSubjects(initialCalculation.subjects);
      setResult(initialCalculation);
      setIsCalculated(true);
    }
  }, [initialCalculation]);

  // Handle subject count change
  const handleSubjectCountChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(25, newCount));
    setSubjectCount(validCount);

    setSubjects((prev) => {
      const updated: SubjectInput[] = [];
      const defaultList = generateDefaultSubjects(validCount, defaultGradeKey);
      for (let i = 0; i < validCount; i++) {
        if (prev[i]) {
          updated.push({ ...prev[i], id: i + 1 });
        } else {
          const fallbackInfo = activeMap[defaultGradeKey] || { marks: 90, points: 9 };
          updated.push(
            defaultList[i] || {
              id: i + 1,
              code: `${i + 1}`,
              name: `Subject ${i + 1}`,
              grade: defaultGradeKey,
              gradePoint: fallbackInfo.points,
              mark: fallbackInfo.marks,
              credits: 0,
            }
          );
        }
      }
      return updated;
    });

    setIsCalculated(false);
    setSaveSuccess(false);
  };

  // Change individual subject grade
  const handleGradeChange = (subjectIndex: number, newGrade: GradeKey) => {
    const info = activeMap[newGrade] || GRADE_MAP[newGrade] || { marks: 80, points: 8 };
    setSubjects((prev) => {
      const copy = [...prev];
      copy[subjectIndex] = {
        ...copy[subjectIndex],
        grade: newGrade,
        gradePoint: info.points,
        mark: info.marks,
      };
      return copy;
    });
    setSaveSuccess(false);
  };

  // Add new subject row
  const handleAddSubject = () => {
    const newId = subjects.length + 1;
    const defaultInfo = activeMap[defaultGradeKey] || GRADE_MAP['A+'] || { marks: 90, points: 9 };
    const newSub: SubjectInput = {
      id: newId,
      code: `${newId}`,
      name: `Subject ${newId}`,
      grade: defaultGradeKey,
      gradePoint: defaultInfo.points,
      mark: defaultInfo.marks,
      credits: 0,
    };
    setSubjects([...subjects, newSub]);
    setSubjectCount(subjects.length + 1);
    setIsCalculated(false);
    setSaveSuccess(false);
  };

  // Delete subject row
  const handleDeleteSubject = (index: number) => {
    if (subjects.length <= 1) {
      alert('At least 1 subject is required for mark calculation.');
      return;
    }
    const filtered = subjects.filter((_, i) => i !== index).map((sub, i) => ({
      ...sub,
      id: i + 1,
    }));
    setSubjects(filtered);
    setSubjectCount(filtered.length);
    setIsCalculated(false);
    setSaveSuccess(false);
  };

  // Open Edit Subject modal
  const handleOpenEdit = (sub: SubjectInput) => {
    setEditingSubject(sub);
    setEditForm({
      code: sub.code || `${sub.id}`,
      name: sub.name,
    });
  };

  // Save Edit Subject
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === editingSubject.id
          ? { ...sub, code: editForm.code, name: editForm.name }
          : sub
      )
    );
    setEditingSubject(null);
  };

  // Batch grade setter
  const handleSetAllGrades = (grade: GradeKey) => {
    const info = activeMap[grade] || GRADE_MAP[grade] || { marks: 80, points: 8 };
    setSubjects((prev) =>
      prev.map((sub) => ({
        ...sub,
        grade,
        gradePoint: info.points,
        mark: info.marks,
      }))
    );
    setSaveSuccess(false);
  };

  const liveCalc = calculateAcademicMetrics(subjects, candidateName.trim(), activeMap);

  // Calculate
  const handleCalculate = () => {
    const calcResult = calculateAcademicMetrics(subjects, candidateName.trim(), activeMap);
    setResult(calcResult);
    setIsCalculated(true);
    setSaveSuccess(false);

    if (calcResult.percentage >= 80) {
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#0b192c', '#1e3a8a', '#d97706', '#10b981'],
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Save to history
  const handleSave = async () => {
    if (!user) {
      onOpenLogin();
      return;
    }

    const baseCalc = result || liveCalc;
    const calc: CalculationResult = {
      ...baseCalc,
      candidateName: candidateName.trim() || user?.name || 'Anonymous',
    };

    if (onSaveRecord) {
      setIsSaving(true);
      try {
        await onSaveRecord(calc, semester);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 5000);
      } catch (err) {
        console.error('Failed to save record to Convex:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Download PDF
  const handleDownloadPdf = () => {
    const baseCalc = result || liveCalc;
    const calc: CalculationResult = {
      ...baseCalc,
      candidateName: candidateName.trim() || user?.name || 'Anonymous',
    };

    generateGradeSheetPdf({
      calculation: calc,
      userEmail: user?.email,
      userName: candidateName.trim() || user?.name || 'Anonymous',
      department: user?.department || 'Information Technology',
      semester,
      gradeMap: activeMap,
      grades,
    });

    // Automatically store in Convex cloud history when downloaded by authorized user
    if (user && onSaveRecord) {
      onSaveRecord(calc, semester)
        .then(() => {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 5000);
        })
        .catch(console.error);
    }
  };

  // Reset Grades to default
  const handleResetGrades = () => {
    setSubjects(generateDefaultSubjects(subjectCount, defaultGradeKey));
    setIsCalculated(false);
    setResult(null);
    setSaveSuccess(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* 2-Column Responsive Layout matching reference format */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          {/* 1. SELECT NUMBER OF SUBJECTS ("keep the num of subjects option on left") */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-900" />
                Select Number of Subjects
              </label>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-lg font-black text-xs border border-blue-200">
                {subjectCount} Subs
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSubjectCountChange(num)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    subjectCount === num
                      ? 'bg-[#0b192c] text-amber-400 shadow-sm scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {num} {num === 8 && <span className="text-amber-400">★</span>}
                </button>
              ))}
            </div>

            <input
              type="range"
              min="1"
              max="15"
              value={subjectCount}
              onChange={(e) => handleSubjectCountChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
            />
          </div>

          {/* 2. BIG RESULT SCORE CARD (Percentage concept: Marks Sum ÷ Total Subjects) */}
          <div className="bg-gradient-to-b from-sky-50 to-blue-50/50 rounded-3xl p-6 border border-sky-200 shadow-sm text-center space-y-2.5">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">
              YOUR PERCENTAGE
            </span>
            <div className="text-5xl font-black text-[#0b192c] font-['Outfit',sans-serif] tracking-tight">
              {liveCalc.percentage}%
            </div>
            <div className="text-xs font-bold text-slate-600">
              Total Marks: <span className="text-blue-950 font-black">{liveCalc.totalMarks}</span> (÷ {liveCalc.subjectCount} Subjects)
            </div>
          </div>

          {/* 3. ACTION BUTTONS (Download PDF & Reset Grades matching screenshot) */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>

            <button
              type="button"
              onClick={handleResetGrades}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-2xl shadow-2xs hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Grades</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-2.5 px-4 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved to History!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isSaving ? 'Saving...' : user ? 'Save to History' : 'Sign In to Save'}</span>
                </>
              )}
            </button>
          </div>

          {/* 4. STUDENT DETAILS (OPTIONAL) (Default: Anonymous if empty) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                STUDENT DETAILS (OPTIONAL)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Default: Anonymous
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                STUDENT NAME
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Abinesh S (or leave blank for Anonymous)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-slate-400 italic leading-snug">
              If left blank, statement PDF is generated as <strong>Anonymous</strong>.
            </p>
          </div>
        </div>

        {/* ================= RIGHT MAIN AREA ================= */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-4">
          {/* Top Bar: Add Subject Row + Quick Batch Selection */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs rounded-full shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Add Subject Row</span>
            </button>

            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 font-bold hidden sm:inline mr-1 text-[11px] uppercase">
                Quick Grades:
              </span>
              {activeKeys.map((gk) => (
                <button
                  key={gk}
                  onClick={() => handleSetAllGrades(gk)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer text-xs"
                >
                  All {gk}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Rows Container (Exact pill format from screenshot) */}
          <div className="space-y-2.5">
            {subjects.map((sub, idx) => (
              <div
                key={sub.id}
                className="rounded-2xl border border-sky-100/90 bg-white p-2 sm:p-2.5 shadow-2xs hover:border-sky-300 transition-all flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5"
              >
                {/* 1. Code Pill Box */}
                <div className="px-3 py-2 rounded-xl bg-sky-100/70 border border-sky-200 text-slate-800 font-bold text-xs text-center min-w-[65px] flex-shrink-0 shadow-2xs">
                  {sub.code || `${idx + 1}`}
                </div>

                {/* 2. Subject Name Pill Box */}
                <div
                  title={sub.name}
                  className="px-3.5 py-2 rounded-xl bg-sky-50/70 border border-sky-200 text-slate-800 font-semibold text-xs flex-1 truncate shadow-2xs"
                >
                  {sub.name}
                </div>

                {/* 3. Grade Dropdown Pill */}
                <div className="relative min-w-[130px] sm:min-w-[145px] flex-shrink-0">
                  <select
                    value={sub.grade}
                    onChange={(e) => handleGradeChange(idx, e.target.value as GradeKey)}
                    className="w-full appearance-none px-3.5 py-2 pr-7 rounded-xl bg-sky-50/70 border border-sky-200 text-slate-800 font-bold text-xs shadow-2xs hover:bg-sky-100/70 focus:outline-none focus:ring-2 focus:ring-blue-900/20 cursor-pointer transition-colors"
                  >
                    {activeKeys.map((gk) => {
                      const info = activeMap[gk] || GRADE_MAP[gk];
                      return (
                        <option key={gk} value={gk}>
                          {gk} Grade ({info ? info.marks : ''})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 4. Edit Pill Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(sub)}
                  className="px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-blue-800 hover:bg-sky-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-700" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                {/* 5. Delete Pill Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteSubject(idx)}
                  className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Subject Modal (No Credits input) */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0b192c] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Course Customization
                </span>
                <h4 className="text-lg font-bold font-['Outfit',sans-serif]">Edit Subject Details</h4>
              </div>
              <button
                onClick={() => setEditingSubject(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.code}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  placeholder="e.g. 1"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g. Subject 1"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0b192c] hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
