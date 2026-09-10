export type GradeKey = string;

export interface GradeInfo {
  grade: GradeKey;
  points: number;
  marks: number;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export interface SubjectInput {
  id: number;
  code?: string;
  name: string;
  grade: GradeKey;
  gradePoint: number;
  mark: number;
  credits: number;
}

export interface CalculationResult {
  candidateName?: string;
  subjectCount: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  cgpa: number;
  classification: string;
  subjects: SubjectInput[];
}

export interface HistoryRecord extends CalculationResult {
  id: string;
  userEmail: string;
  userName?: string;
  semester?: string;
  timestamp: number;
  notes?: string;
}

export interface UserSession {
  email: string;
  name: string;
  role: 'student' | 'staff' | 'admin';
  department?: string;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  hodName: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface StaffMember {
  id: string;
  staffId?: string;
  name: string;
  email: string;
  password?: string;
  department?: string;
  designation: string;
  canCalculate: boolean;
  createdAt: number;
}
