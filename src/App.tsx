import React, { useState, useEffect } from 'react';
import { UserSession, HistoryRecord, CalculationResult, DepartmentItem, StaffMember, GradeInfo } from './types';
import { Navbar } from './components/Navbar';
import { PublicLanding } from './components/PublicLanding';
import { Calculator } from './components/Calculator';
import { HistoryView } from './components/HistoryView';
import { AdminDashboard } from './components/AdminDashboard';
import { GradeSettings } from './components/GradeSettings';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import {
  getSavedSession,
  saveSession,
  clearSession,
  getCalculationHistory,
  saveCalculationRecord,
  deleteCalculationRecord,
  clearAllHistory,
  getStoredDepartments,
  syncDepartmentsFromConvex,
  resetToDefaultDepartments,
  saveNewDepartment,
  updateStoredDepartment,
  deleteStoredDepartment,
  getStoredStaff,
  saveNewStaff,
  updateStoredStaff,
  deleteStoredStaff,
  getStoredGrades,
  saveStoredGrades,
  syncGradesFromConvex,
  updateStoredGrade,
  deleteStoredGrade,
  resetToDefaultGrades,
} from './services/storage';
import { buildGradeMap } from './utils/gradeData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(() => getSavedSession());
  const [currentTab, setCurrentTab] = useState<'home' | 'calculator' | 'history' | 'admin' | 'grades'>(() => {
    const saved = getSavedSession();
    if (saved?.role === 'admin') return 'admin';
    if (saved?.role === 'staff') return 'calculator';
    return 'home';
  });
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [activeReloadCalc, setActiveReloadCalc] = useState<CalculationResult | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Departments, Staff, and Grades state
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => getStoredDepartments());
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => getStoredStaff());
  const [grades, setGrades] = useState<GradeInfo[]>(() => getStoredGrades());
  const gradeMap = buildGradeMap(grades);

  // Show toast notification
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load history whenever user changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.email) {
        const records = await getCalculationHistory(user.email);
        setHistory(records);
      } else {
        setHistory([]);
      }
    };
    fetchHistory();
  }, [user]);

  // Sync latest grade scale & departments from Convex database on mount
  useEffect(() => {
    syncGradesFromConvex().then((liveGrades) => {
      if (liveGrades && liveGrades.length > 0) {
        setGrades(liveGrades);
      }
    });
    syncDepartmentsFromConvex().then((liveDepts) => {
      if (liveDepts && liveDepts.length > 0) {
        setDepartments(liveDepts);
      }
    });
  }, []);

  // Login handler
  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setUser(loggedInUser);
    saveSession(loggedInUser);
    if (loggedInUser.role === 'admin') {
      setCurrentTab('admin');
    } else if (loggedInUser.role === 'staff') {
      setCurrentTab('calculator');
    } else {
      setCurrentTab('calculator');
    }
    showToast(`Welcome, ${loggedInUser.name}! Account connected.`, 'success');
  };

  // Logout handler
  const handleLogout = () => {
    clearSession();
    setUser(null);
    setHistory([]);
    setCurrentTab('home');
    showToast('You have been signed out.', 'info');
  };

  // Save calculation handler
  const handleSaveRecord = async (calc: CalculationResult, semester: string) => {
    if (!user) return;
    const record = await saveCalculationRecord(user, calc, semester);
    setHistory((prev) => [record, ...prev]);
    showToast('Calculation saved to your account history!', 'success');
  };

  // Delete single record handler
  const handleDeleteRecord = async (recordId: string) => {
    await deleteCalculationRecord(recordId);
    setHistory((prev) => prev.filter((r) => r.id !== recordId));
    showToast('Record removed from history.', 'info');
  };

  // Clear all history handler
  const handleClearAll = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to clear all your calculation history?')) {
      await clearAllHistory(user.email);
      setHistory([]);
      showToast('All history records cleared.', 'info');
    }
  };

  // Reload past record into the calculator
  const handleReloadToCalculator = (record: HistoryRecord) => {
    setActiveReloadCalc(record);
    setCurrentTab('calculator');
    showToast(`Loaded calculation from ${new Date(record.timestamp).toLocaleDateString()}`, 'info');
  };

  // Department CRUD handlers
  const handleAddDepartment = (dept: Omit<DepartmentItem, 'id'>) => {
    const created = saveNewDepartment(dept);
    setDepartments([...getStoredDepartments()]);
    showToast(`Department ${created.name} (${created.code}) created.`, 'success');
  };

  const handleUpdateDepartment = (id: string, updated: Partial<DepartmentItem>) => {
    const nextList = updateStoredDepartment(id, updated);
    setDepartments([...nextList]);
    showToast('Department details updated.', 'success');
  };

  const handleDeleteDepartment = (id: string) => {
    const nextList = deleteStoredDepartment(id);
    setDepartments([...nextList]);
    showToast('Department removed.', 'info');
  };

  const handleResetDepartments = () => {
    const restored = resetToDefaultDepartments();
    setDepartments([...restored]);
    showToast('Restored all 10 official RIT Academic Departments.', 'success');
  };

  // Staff CRUD handlers
  const handleAddStaff = (staff: Omit<StaffMember, 'id' | 'createdAt'>) => {
    const created = saveNewStaff(staff);
    setStaffMembers([...getStoredStaff()]);
    showToast(`Staff member ${created.name} added for calculations.`, 'success');
  };

  const handleUpdateStaff = (id: string, updated: Partial<StaffMember>) => {
    const nextStaff = updateStoredStaff(id, updated);
    setStaffMembers([...nextStaff]);
    showToast('Staff permissions updated.', 'success');
  };

  const handleDeleteStaff = (id: string) => {
    const nextStaff = deleteStoredStaff(id);
    setStaffMembers([...nextStaff]);
    showToast('Staff member removed.', 'info');
  };

  // Grade CRUD handlers
  const handleUpdateGrade = (oldGradeKey: string, updated: GradeInfo) => {
    const nextGrades = updateStoredGrade(oldGradeKey, updated);
    setGrades([...nextGrades]);
    showToast(`Grade ${updated.grade} updated to ${updated.marks} Marks.`, 'success');
  };

  const handleAddGrade = (newGrade: GradeInfo) => {
    const nextGrades = updateStoredGrade(newGrade.grade, newGrade);
    setGrades([...nextGrades]);
    showToast(`New Grade ${newGrade.grade} added (${newGrade.marks} Marks).`, 'success');
  };

  const handleDeleteGrade = (gradeKey: string) => {
    const nextGrades = deleteStoredGrade(gradeKey);
    setGrades([...nextGrades]);
    showToast(`Grade ${gradeKey} removed.`, 'info');
  };

  const handleResetGrades = () => {
    const reset = resetToDefaultGrades();
    setGrades([...reset]);
    showToast('Reset all grades to RIT Autonomous standards.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-amber-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 animate-slide-up flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl bg-slate-900 text-white text-xs font-semibold border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        historyCount={history.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <PublicLanding
            user={user}
            departments={departments}
            grades={grades}
            onOpenLogin={() => setIsLoginOpen(true)}
            onEnterCalculator={() => setCurrentTab('calculator')}
          />
        )}

        {currentTab === 'calculator' && (
          <Calculator
            user={user}
            onOpenLogin={() => setIsLoginOpen(true)}
            onSaveRecord={handleSaveRecord}
            initialCalculation={activeReloadCalc}
            grades={grades}
            gradeMap={gradeMap}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            user={user}
            history={history}
            onOpenLogin={() => setIsLoginOpen(true)}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAll}
            onReloadToCalculator={handleReloadToCalculator}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            user={user}
            departments={departments}
            staffMembers={staffMembers}
            history={history}
            onOpenLogin={() => setIsLoginOpen(true)}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAll}
            onReloadToCalculator={handleReloadToCalculator}
            onAddDepartment={handleAddDepartment}
            onUpdateDepartment={handleUpdateDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onResetDepartments={handleResetDepartments}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        )}

        {currentTab === 'grades' && (
          <GradeSettings
            user={user}
            grades={grades}
            onUpdateGrade={handleUpdateGrade}
            onAddGrade={handleAddGrade}
            onDeleteGrade={handleDeleteGrade}
            onResetGrades={handleResetGrades}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Authentication Dialog */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
