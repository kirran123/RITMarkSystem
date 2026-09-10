import React, { useState } from 'react';
import { DepartmentItem, StaffMember, UserSession, HistoryRecord } from '../types';
import { HistoryView } from './HistoryView';
import {
  Building2,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Mail,
  UserCheck,
  UserX,
  X,
  Save,
  Search,
  Check,
  Sliders,
  RotateCcw,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  user: UserSession | null;
  departments: DepartmentItem[];
  staffMembers: StaffMember[];
  history?: HistoryRecord[];
  onOpenLogin?: () => void;
  onDeleteRecord?: (id: string) => Promise<void>;
  onClearAll?: () => Promise<void>;
  onReloadToCalculator?: (record: HistoryRecord) => void;
  onAddDepartment: (dept: Omit<DepartmentItem, 'id'>) => void;
  onUpdateDepartment: (id: string, updated: Partial<DepartmentItem>) => void;
  onDeleteDepartment: (id: string) => void;
  onResetDepartments?: () => void;
  onAddStaff: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  onUpdateStaff: (id: string, updated: Partial<StaffMember>) => void;
  onDeleteStaff: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  departments,
  staffMembers,
  history = [],
  onOpenLogin = () => {},
  onDeleteRecord = async () => {},
  onClearAll = async () => {},
  onReloadToCalculator = () => {},
  onAddDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
  onResetDepartments,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
}) => {
  const [activeTab, setActiveTab] = useState<'departments' | 'staff'>('departments');

  // Department Modal State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [deptForm, setDeptForm] = useState({
    code: '',
    name: '',
    hodName: '',
    email: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Staff Modal State (No Staff ID, No Department)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    designation: 'Assistant Professor',
    password: '',
    canCalculate: true,
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Open Add Dept
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptForm({ code: '', name: '', hodName: '', email: '', status: 'Active' });
    setIsDeptModalOpen(true);
  };

  // Open Edit Dept
  const handleOpenEditDept = (dept: DepartmentItem) => {
    setEditingDept(dept);
    setDeptForm({
      code: dept.code,
      name: dept.name,
      hodName: dept.hodName,
      email: dept.email,
      status: dept.status,
    });
    setIsDeptModalOpen(true);
  };

  // Submit Dept
  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      onUpdateDepartment(editingDept.id, deptForm);
    } else {
      onAddDepartment(deptForm);
    }
    setIsDeptModalOpen(false);
  };

  // Open Add Staff (No Staff ID, No Department)
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({
      name: '',
      email: '',
      designation: 'Assistant Professor',
      password: '',
      canCalculate: true,
    });
    setShowStaffPassword(false);
    setIsStaffModalOpen(true);
  };

  // Open Edit Staff
  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffForm({
      name: staff.name,
      email: staff.email,
      designation: staff.designation,
      password: staff.password || '',
      canCalculate: staff.canCalculate,
    });
    setShowStaffPassword(false);
    setIsStaffModalOpen(true);
  };

  // Submit Staff
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      onUpdateStaff(editingStaff.id, staffForm);
    } else {
      onAddStaff(staffForm);
    }
    setIsStaffModalOpen(false);
  };

  // Toggle staff calculation permission
  const handleToggleStaffCalculation = (staff: StaffMember) => {
    onUpdateStaff(staff.id, { canCalculate: !staff.canCalculate });
  };

  const filteredDepartments = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaff = staffMembers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
                  Administrator Portal
                </span>
                <span className="text-xs text-slate-500 font-medium">Ramco Institute of Technology</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] mt-0.5">
                Academic Management & Coordination
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage academic departments, update HOD profiles, and authorize staff for mark calculations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('departments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-[#0b192c] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              Departments ({departments.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-[#0b192c] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-sky-400" />
              Staff Management ({staffMembers.length})
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-black">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {departments.length}
            </span>
            <p className="text-xs text-slate-500 font-medium">Academic Departments</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {staffMembers.length}
            </span>
            <p className="text-xs text-slate-500 font-medium">Total Faculty / Staff</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {staffMembers.filter((s) => s.canCalculate).length}
            </span>
            <p className="text-xs text-slate-500 font-medium">Authorized Calculators</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 font-['Outfit',sans-serif] block">
              Autonomous
            </span>
            <p className="text-xs text-slate-500 font-medium">NAAC 'A+' Accredited</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'departments'
                ? 'Search departments, code, or HOD...'
                : 'Search staff by name, email, or designation...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'departments' ? (
            <button
              onClick={handleOpenAddDept}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0b192c] hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Add New Department
            </button>
          ) : (
            <button
              onClick={handleOpenAddStaff}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0b192c] hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              Add Staff for Calculating
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: DEPARTMENTS ================= */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-900" />
              Academic Departments Registry
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredDepartments.length} Departments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Code</th>
                  <th className="py-3.5 px-6">Department Name</th>
                  <th className="py-3.5 px-6">Head of Department (HOD)</th>
                  <th className="py-3.5 px-6">HOD Official Email</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-black text-xs border border-blue-200">
                        {dept.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">{dept.name}</td>
                    <td className="py-4 px-6 font-medium text-slate-700">{dept.hodName}</td>
                    <td className="py-4 px-6 text-slate-600">
                      <a
                        href={`mailto:${dept.email}`}
                        className="inline-flex items-center gap-1.5 text-blue-800 hover:underline text-xs"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {dept.email}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Check className="w-3 h-3" /> {dept.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditDept(dept)}
                          title="Edit department and HOD"
                          className="p-1.5 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete department ${dept.name}?`)) {
                              onDeleteDepartment(dept.id);
                            }
                          }}
                          title="Delete department"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
      )}

      {/* ================= TAB 2: STAFF ================= */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-900" />
              Faculty & Calculation Staff Registry
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredStaff.length} Faculty Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Faculty Full Name</th>
                  <th className="py-3.5 px-6">Designation</th>
                  <th className="py-3.5 px-6">Official Email</th>
                  <th className="py-3.5 px-6 text-center">Calculation Access</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center border border-blue-200">
                          {staff.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{staff.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600 text-xs">
                      {staff.designation}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <a
                        href={`mailto:${staff.email}`}
                        className="inline-flex items-center gap-1.5 text-blue-800 hover:underline text-xs"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {staff.email}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStaffCalculation(staff)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          staff.canCalculate
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {staff.canCalculate ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Authorized</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5 text-slate-400" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditStaff(staff)}
                          title="Edit staff member"
                          className="p-1.5 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete staff member ${staff.name}?`)) {
                              onDeleteStaff(staff.id);
                            }
                          }}
                          title="Delete staff member"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
      )}

      {/* ================= MODAL: ADD / EDIT DEPARTMENT ================= */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0b192c] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Academic Configuration
                </span>
                <h3 className="text-xl font-bold font-['Outfit',sans-serif]">
                  {editingDept ? 'Edit Academic Department' : 'Add New Department'}
                </h3>
              </div>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeptSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. IT"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    placeholder="e.g. Information Technology"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Head of Department (HOD) Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={deptForm.hodName}
                  onChange={(e) => setDeptForm({ ...deptForm, hodName: e.target.value })}
                  placeholder="e.g. Dr. K. Vijayalakshmi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  HOD Official Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={deptForm.email}
                  onChange={(e) => setDeptForm({ ...deptForm, email: e.target.value })}
                  placeholder="e.g. it@ritrjpm.ac.in"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0b192c] hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  {editingDept ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT STAFF ================= */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0b192c] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  Faculty Authorization
                </span>
                <h3 className="text-xl font-bold font-['Outfit',sans-serif]">
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff for Calculating'}
                </h3>
              </div>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Faculty Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="e.g. Prof. R. Balaji"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  value={staffForm.designation}
                  onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                  placeholder="e.g. Assistant Professor"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Official Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="e.g. balaji@ritrjpm.ac.in"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Portal Login Password {editingStaff ? '(Leave blank to keep unchanged)' : '*'}
                </label>
                <div className="relative">
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    required={!editingStaff}
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    placeholder={editingStaff ? '•••••••• (Enter new to change)' : 'Set password (e.g. Kirranst@14)'}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                    title={showStaffPassword ? 'Hide password' : 'Show password'}
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  The staff member will use this password along with their email to log into the portal.
                </p>
              </div>

              {/* Calculation Authorization Checkbox */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <input
                  type="checkbox"
                  id="canCalculateCheck"
                  checked={staffForm.canCalculate}
                  onChange={(e) => setStaffForm({ ...staffForm, canCalculate: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="canCalculateCheck" className="text-xs font-bold text-emerald-950 cursor-pointer">
                  Authorize this staff member for Mark Calculations & Reports
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0b192c] hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-sky-400" />
                  {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CALCULATION HISTORY (ABOVE FOOTER) ================= */}
      <section className="pt-8 border-t-2 border-slate-200/80">
        <HistoryView
          user={user}
          history={history}
          onOpenLogin={onOpenLogin}
          onDeleteRecord={onDeleteRecord}
          onClearAll={onClearAll}
          onReloadToCalculator={onReloadToCalculator}
        />
      </section>
    </div>
  );
};
