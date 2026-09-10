import { HistoryRecord, CalculationResult, UserSession, DepartmentItem, StaffMember, GradeInfo } from '../types';
import { ConvexHttpClient } from 'convex/browser';

const STORAGE_KEY_HISTORY = 'rit_mark_history_v2';
const STORAGE_KEY_AUTH = 'rit_auth_user_v2';
const STORAGE_KEY_DEPTS = 'rit_depts_v3';
const STORAGE_KEY_STAFF = 'rit_staff_v3';

// Convex Client
const convexUrl = import.meta.env.VITE_CONVEX_URL;
let convexClient: ConvexHttpClient | null = null;

if (convexUrl && convexUrl.startsWith('http')) {
  try {
    convexClient = new ConvexHttpClient(convexUrl);
  } catch (err) {
    console.warn('Convex client initialization skipped:', err);
  }
}

// Initial Departments Seed - All 10 Official RIT Academic Departments
export const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  { id: 'dept_it', code: 'IT', name: 'Information Technology', hodName: 'Mariappan', email: 'mariappan@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_aids', code: 'AI&DS', name: 'Artificial Intelligence and Data Science', hodName: 'Kaliappan', email: 'kaliappan@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_aiml', code: 'AIML', name: 'Artificial Intelligence and Machine Learning', hodName: 'Kesavan', email: 'vtkesavan@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_civil', code: 'CIVIL', name: 'Civil Engineering', hodName: 'Meyyappan', email: 'meyyappan@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_csbs', code: 'CSBS', name: 'Computer Science and Business Systems', hodName: 'Gomathynayagam', email: 'gomathynayagam@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_cse', code: 'CSE', name: 'Computer Science and Engineering', hodName: 'Vijayalakshmi K', email: 'vijayalakshmik@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_eee', code: 'EEE', name: 'Electrical and Electronics Engineering', hodName: 'Kannan', email: 'kannan@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_ece', code: 'ECE', name: 'Electronics and Communication Engineering', hodName: 'Arunachala Perumal C', email: 'arunachalaperumal@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_mech', code: 'MECH', name: 'Mechanical Engineering', hodName: 'Suresh Kumar', email: 'sureshkumar@ritrjpm.ac.in', status: 'Active' },
  { id: 'dept_cyber', code: 'CYBER', name: 'Cyber Security', hodName: 'Pending Appointment', email: 'cyberhod@rit.edu.in', status: 'Active' },
];

// Initial Staff Seed (No staffId, No department)
export const DEFAULT_STAFF: StaffMember[] = [
  { id: 'staff_1', name: 'Kirran S T', email: 'kirranvijay@gmail.com', designation: 'Assistant Professor & Admin', canCalculate: true, createdAt: Date.now() - 86400000 },
  { id: 'staff_2', name: 'Mariappan', email: 'mariappan@ritrjpm.ac.in', designation: 'Professor & Head', canCalculate: true, createdAt: Date.now() - 172800000 },
  { id: 'staff_3', name: 'Vijayalakshmi K', email: 'vijayalakshmik@ritrjpm.ac.in', designation: 'Professor & Head', canCalculate: true, createdAt: Date.now() - 259200000 },
];

// ==================== CALCULATION HISTORY ====================

export async function getCalculationHistory(userEmail: string): Promise<HistoryRecord[]> {
  if (convexClient) {
    try {
      // @ts-ignore
      const records = await convexClient.query('calculations:getHistoryByUser', { userEmail });
      if (Array.isArray(records) && records.length > 0) {
        return records.map((r: any) => ({ ...r, id: r._id || r.id }));
      }
    } catch (err) {
      console.warn('Convex query fallback to localStorage:', err);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const all: HistoryRecord[] = JSON.parse(raw);
    return all
      .filter((rec) => rec.userEmail.toLowerCase() === userEmail.toLowerCase())
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error('Failed to read calculation history from localStorage', e);
    return [];
  }
}

export async function saveCalculationRecord(
  user: UserSession,
  calc: CalculationResult,
  semester: string = 'Mark Calculation'
): Promise<HistoryRecord> {
  const newRecord: HistoryRecord = {
    ...calc,
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userEmail: user.email,
    userName: user.name,
    candidateName: calc.candidateName || user.name,
    semester,
    timestamp: Date.now(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    const all: HistoryRecord[] = raw ? JSON.parse(raw) : [];
    all.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(all));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }

  if (convexClient) {
    try {
      // @ts-ignore
      await convexClient.mutation('calculations:saveCalculation', {
        userEmail: user.email,
        userName: user.name,
        candidateName: calc.candidateName,
        semester,
        subjectCount: calc.subjectCount,
        subjects: calc.subjects,
        totalMarks: calc.totalMarks,
        maxMarks: calc.maxMarks,
        percentage: calc.percentage,
        cgpa: calc.cgpa,
        classification: calc.classification,
      });
    } catch (err) {
      console.warn('Convex save mutation deferred:', err);
    }
  }

  return newRecord;
}

export async function deleteCalculationRecord(recordId: string): Promise<boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      const all: HistoryRecord[] = JSON.parse(raw);
      const filtered = all.filter((r) => r.id !== recordId);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Failed to delete from localStorage', e);
  }

  if (convexClient && recordId.startsWith('k')) {
    try {
      // @ts-ignore
      await convexClient.mutation('calculations:deleteCalculation', { id: recordId });
    } catch (err) {
      console.warn('Convex delete failed:', err);
    }
  }

  return true;
}

export async function clearAllHistory(userEmail: string): Promise<boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      const all: HistoryRecord[] = JSON.parse(raw);
      const filtered = all.filter((r) => r.userEmail.toLowerCase() !== userEmail.toLowerCase());
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(filtered));
    }
  } catch (e) {
    console.error('Failed to clear history', e);
  }

  if (convexClient) {
    try {
      // @ts-ignore
      await convexClient.mutation('calculations:clearHistoryByUser', { userEmail });
    } catch (err) {
      console.warn('Convex clear failed:', err);
    }
  }

  return true;
}

// ==================== AUTH SESSION ====================

export function getSavedSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(user: UserSession): void {
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY_AUTH);
}

/**
 * Authenticate user with Convex database (auth:login)
 * Falls back to offline credentials if Convex is unreachable
 */
export async function authenticateUser(
  email: string,
  password: string,
  role: 'staff' | 'admin'
): Promise<{ success: boolean; user?: UserSession; message?: string }> {
  const inputEmail = email.trim().toLowerCase();

  // 1. Convex Cloud Database Authentication
  if (convexClient) {
    try {
      // @ts-ignore
      const res: any = await convexClient.mutation('auth:login', {
        email: inputEmail,
        password: password.trim(),
        role,
      });

      if (res && res.success && res.user) {
        const sessionUser: UserSession = {
          email: res.user.email,
          name: res.user.name,
          role: res.user.role as 'staff' | 'admin',
          department: res.user.department || 'Information Technology',
        };
        saveSession(sessionUser);
        return { success: true, user: sessionUser };
      } else if (res && !res.success) {
        return { success: false, message: res.message || 'Invalid credentials' };
      }
    } catch (err) {
      console.warn('Convex auth request deferred to offline fallback validator:', err);
    }
  }

  // 2. Offline / Local Fallback Validation
  const isMasterAdmin =
    (inputEmail === 'kirranvijay@gmail.com' || inputEmail === 'ritdeptit@gmail.com') &&
    password === 'Kirranst@14';

  if (role === 'admin') {
    if (isMasterAdmin) {
      const user: UserSession = {
        email: inputEmail,
        name: inputEmail === 'ritdeptit@gmail.com' ? 'RIT IT Department Admin' : 'Kirran S T',
        role: 'admin',
        department: 'Information Technology',
      };
      saveSession(user);
      return { success: true, user };
    }
    return {
      success: false,
      message: 'Invalid admin credentials. Please enter authorized admin email and password.',
    };
  }

  const staffList = getStoredStaff();
  const staffMatch = staffList.find((s) => s.email.toLowerCase() === inputEmail);
  if (staffMatch && (password === 'Kirranst@14' || password === 'staff123' || password.length >= 4)) {
    const user: UserSession = {
      email: staffMatch.email,
      name: staffMatch.name,
      role: 'staff',
      department: staffMatch.department || 'Academic Faculty',
    };
    saveSession(user);
    return { success: true, user };
  }

  if (isMasterAdmin) {
    const user: UserSession = {
      email: inputEmail,
      name: inputEmail === 'ritdeptit@gmail.com' ? 'RIT IT Department Admin' : 'Kirran S T',
      role: 'admin',
      department: 'Information Technology',
    };
    saveSession(user);
    return { success: true, user };
  }

  return {
    success: false,
    message: 'Invalid staff email or password. Please verify your institutional login details.',
  };
}

// ==================== DEPARTMENTS MANAGEMENT ====================

export function getStoredDepartments(): DepartmentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEPTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(DEFAULT_DEPARTMENTS));
      return DEFAULT_DEPARTMENTS;
    }
    const parsed: DepartmentItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 10 || !parsed.some((d) => d.code === 'AIML') || !parsed.some((d) => d.code === 'CYBER')) {
      localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(DEFAULT_DEPARTMENTS));
      return DEFAULT_DEPARTMENTS;
    }
    return parsed;
  } catch {
    return DEFAULT_DEPARTMENTS;
  }
}

/**
 * Fetch latest departments from Convex database and update cache
 */
export async function syncDepartmentsFromConvex(): Promise<DepartmentItem[]> {
  if (convexClient) {
    try {
      // @ts-ignore
      const result: any[] = await convexClient.query('admin:getDepartments');
      if (Array.isArray(result) && result.length > 0) {
        const formatted: DepartmentItem[] = result.map((d: any) => ({
          id: d._id || `dept_${d.code.toLowerCase()}`,
          code: d.code,
          name: d.name,
          hodName: d.hodName,
          email: d.email,
          status: d.status || 'Active',
        }));
        localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn('Convex departments sync deferred:', err);
    }
  }
  return getStoredDepartments();
}

export function resetToDefaultDepartments(): DepartmentItem[] {
  localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(DEFAULT_DEPARTMENTS));
  return DEFAULT_DEPARTMENTS;
}

export function saveNewDepartment(dept: Omit<DepartmentItem, 'id'>): DepartmentItem {
  const all = getStoredDepartments();
  const newItem: DepartmentItem = {
    ...dept,
    id: `dept_${Date.now()}`,
  };
  all.push(newItem);
  localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(all));

  // Sync to Convex storage
  if (convexClient) {
    try {
      // @ts-ignore
      convexClient.mutation('admin:addDepartment', {
        code: dept.code,
        name: dept.name,
        hodName: dept.hodName,
        email: dept.email,
        status: dept.status,
      }).catch((err) => {
        console.warn('Convex addDepartment deferred:', err);
      });
    } catch (err) {
      console.warn('Convex addDepartment error:', err);
    }
  }

  return newItem;
}

export function updateStoredDepartment(id: string, updated: Partial<DepartmentItem>): DepartmentItem[] {
  const all = getStoredDepartments();
  const index = all.findIndex((d) => d.id === id || (updated.code && d.code === updated.code));
  if (index !== -1) {
    all[index] = { ...all[index], ...updated };
    localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(all));

    // Sync updated department name, HOD name, HOD email with Convex storage
    if (convexClient) {
      const target = all[index];
      try {
        // @ts-ignore
        convexClient.mutation('admin:updateDepartment', {
          id: target.id.startsWith('j') ? target.id : undefined,
          code: target.code,
          name: target.name,
          hodName: target.hodName,
          email: target.email,
          status: target.status,
        }).catch((err) => {
          console.warn('Convex department update deferred:', err);
        });
      } catch (err) {
        console.warn('Convex department update error:', err);
      }
    }
  }
  return all;
}

export function deleteStoredDepartment(id: string): DepartmentItem[] {
  const all = getStoredDepartments();
  const target = all.find((d) => d.id === id);
  const filtered = all.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(filtered));

  // Sync deletion with Convex storage
  if (convexClient && target) {
    try {
      // @ts-ignore
      convexClient.mutation('admin:deleteDepartment', {
        id: target.id.startsWith('j') ? target.id : undefined,
        code: target.code,
      }).catch((err) => {
        console.warn('Convex deleteDepartment deferred:', err);
      });
    } catch (err) {
      console.warn('Convex deleteDepartment error:', err);
    }
  }

  return filtered;
}

// ==================== STAFF MANAGEMENT ====================

export function getStoredStaff(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAFF);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(DEFAULT_STAFF));
      return DEFAULT_STAFF;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STAFF;
  }
}

export function saveNewStaff(staff: Omit<StaffMember, 'id' | 'createdAt'>): StaffMember {
  const all = getStoredStaff();
  const newItem: StaffMember = {
    ...staff,
    id: `staff_${Date.now()}`,
    password: staff.password || 'Kirranst@14',
    createdAt: Date.now(),
  };
  all.push(newItem);
  localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(all));

  // Sync with Convex database
  if (convexClient) {
    try {
      // @ts-ignore
      convexClient.mutation('admin:addStaff', {
        name: newItem.name,
        email: newItem.email,
        password: newItem.password,
        department: newItem.department || 'Information Technology',
        designation: newItem.designation,
        canCalculate: newItem.canCalculate,
      }).catch((err) => {
        console.warn('Convex addStaff deferred:', err);
      });
    } catch (err) {
      console.warn('Convex addStaff error:', err);
    }
  }

  return newItem;
}

export function updateStoredStaff(id: string, updated: Partial<StaffMember>): StaffMember[] {
  const all = getStoredStaff();
  const index = all.findIndex((s) => s.id === id || (updated.email && s.email.toLowerCase() === updated.email.toLowerCase()));
  if (index !== -1) {
    all[index] = { ...all[index], ...updated };
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(all));

    // Sync with Convex database
    if (convexClient) {
      const target = all[index];
      try {
        // @ts-ignore
        convexClient.mutation('admin:updateStaff', {
          id: target.id.startsWith('j') ? target.id : undefined,
          email: target.email,
          name: target.name,
          password: target.password,
          designation: target.designation,
          department: target.department,
          canCalculate: target.canCalculate,
        }).catch((err) => {
          console.warn('Convex updateStaff deferred:', err);
        });
      } catch (err) {
        console.warn('Convex updateStaff error:', err);
      }
    }
  }
  return all;
}

export function deleteStoredStaff(id: string): StaffMember[] {
  const all = getStoredStaff();
  const target = all.find((s) => s.id === id);
  const filtered = all.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(filtered));

  if (convexClient && target) {
    try {
      // @ts-ignore
      convexClient.mutation('admin:deleteStaff', {
        id: target.id.startsWith('j') ? target.id : undefined,
        email: target.email,
      }).catch((err) => {
        console.warn('Convex deleteStaff deferred:', err);
      });
    } catch (err) {
      console.warn('Convex deleteStaff error:', err);
    }
  }

  return filtered;
}

// ==================== GRADE & MARK SCHEME MANAGEMENT ====================

const STORAGE_KEY_GRADES = 'rit_grade_config_v3';

export const DEFAULT_GRADES: GradeInfo[] = [
  {
    grade: 'O',
    points: 10,
    marks: 100,
    label: 'Outstanding Performance',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-500',
  },
  {
    grade: 'A+',
    points: 9,
    marks: 90,
    label: 'Excellent Performance',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-500',
  },
  {
    grade: 'A',
    points: 8,
    marks: 80,
    label: 'Very Good Performance',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-500',
  },
  {
    grade: 'B+',
    points: 7,
    marks: 70,
    label: 'Good Performance',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-500',
  },
  {
    grade: 'B',
    points: 6,
    marks: 60,
    label: 'Above Average Performance',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-500',
  },
  {
    grade: 'C',
    points: 5,
    marks: 50,
    label: 'Average / Satisfactory Performance',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-500',
  },
  {
    grade: 'U',
    points: 0,
    marks: 0,
    label: 'Re-appear (Arrear)',
    badgeBg: 'bg-red-100 text-red-800 border-red-300',
    badgeText: 'text-red-700',
    borderColor: 'border-red-500',
  },
];

export function getStoredGrades(): GradeInfo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GRADES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(DEFAULT_GRADES));
      return DEFAULT_GRADES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(DEFAULT_GRADES));
      return DEFAULT_GRADES;
    }
    return parsed;
  } catch {
    return DEFAULT_GRADES;
  }
}

/**
 * Fetch grade system from Convex database and update cache
 */
export async function syncGradesFromConvex(): Promise<GradeInfo[]> {
  if (convexClient) {
    try {
      // @ts-ignore
      const result: any[] = await convexClient.query('grades:getGradeSystem');
      if (Array.isArray(result) && result.length > 0) {
        const formatted: GradeInfo[] = result.map((g: any) => ({
          grade: g.grade,
          points: g.gradePoint,
          marks: g.minMark,
          label: g.description,
          badgeBg:
            g.grade === 'O'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : g.grade === 'A+'
              ? 'bg-blue-100 text-blue-800 border-blue-300'
              : g.grade === 'A'
              ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
              : g.grade === 'B+'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : g.grade === 'B'
              ? 'bg-orange-100 text-orange-800 border-orange-300'
              : g.grade === 'C'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-red-100 text-red-800 border-red-300',
          badgeText:
            g.grade === 'O'
              ? 'text-emerald-700'
              : g.grade === 'A+'
              ? 'text-blue-700'
              : g.grade === 'A'
              ? 'text-indigo-700'
              : g.grade === 'B+'
              ? 'text-amber-700'
              : g.grade === 'B'
              ? 'text-orange-700'
              : g.grade === 'C'
              ? 'text-rose-700'
              : 'text-red-700',
          borderColor:
            g.grade === 'O'
              ? 'border-emerald-500'
              : g.grade === 'A+'
              ? 'border-blue-500'
              : g.grade === 'A'
              ? 'border-indigo-500'
              : g.grade === 'B+'
              ? 'border-amber-500'
              : g.grade === 'B'
              ? 'border-orange-500'
              : g.grade === 'C'
              ? 'border-rose-500'
              : 'border-red-500',
        }));
        localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn('Convex grades sync deferred:', err);
    }
  }
  return getStoredGrades();
}

export function saveStoredGrades(grades: GradeInfo[]): GradeInfo[] {
  localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(grades));

  // Synchronize with Convex database
  if (convexClient) {
    try {
      const payload = grades.map((g, idx) => ({
        grade: g.grade,
        gradePoint: g.points,
        minMark: g.marks,
        maxMark: idx === 0 ? 100 : grades[idx - 1].marks - 1,
        description: g.label,
        order: idx + 1,
      }));
      // @ts-ignore
      convexClient.mutation('grades:saveGradeSystem', { grades: payload }).catch((err) => {
        console.warn('Convex grades update deferred:', err);
      });
    } catch (err) {
      console.warn('Convex saveGradeSystem error:', err);
    }
  }

  return grades;
}

export function updateStoredGrade(oldGradeKey: string, updated: GradeInfo): GradeInfo[] {
  const current = getStoredGrades();
  const index = current.findIndex((g) => g.grade.toLowerCase() === oldGradeKey.toLowerCase());
  if (index !== -1) {
    current[index] = updated;
  } else {
    current.push(updated);
  }
  return saveStoredGrades(current);
}

export function deleteStoredGrade(gradeKey: string): GradeInfo[] {
  const current = getStoredGrades();
  const filtered = current.filter((g) => g.grade.toLowerCase() !== gradeKey.toLowerCase());
  return saveStoredGrades(filtered);
}

export function resetToDefaultGrades(): GradeInfo[] {
  localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(DEFAULT_GRADES));
  return DEFAULT_GRADES;
}

