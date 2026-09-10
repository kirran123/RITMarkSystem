import { GradeKey, GradeInfo, SubjectInput, CalculationResult } from '../types';

export const GRADE_MAP: Record<GradeKey, GradeInfo> = {
  'O': {
    grade: 'O',
    points: 10,
    marks: 100,
    label: 'Outstanding Performance',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-500',
  },
  'A+': {
    grade: 'A+',
    points: 9,
    marks: 90,
    label: 'Excellent Performance',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-500',
  },
  'A': {
    grade: 'A',
    points: 8,
    marks: 80,
    label: 'Very Good Performance',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-500',
  },
  'B+': {
    grade: 'B+',
    points: 7,
    marks: 70,
    label: 'Good Performance',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-500',
  },
  'B': {
    grade: 'B',
    points: 6,
    marks: 60,
    label: 'Above Average Performance',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    badgeText: 'text-orange-700',
    borderColor: 'border-orange-500',
  },
  'C': {
    grade: 'C',
    points: 5,
    marks: 50,
    label: 'Average / Satisfactory Performance',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-500',
  },
  'U': {
    grade: 'U',
    points: 0,
    marks: 0,
    label: 'Re-appear (Arrear)',
    badgeBg: 'bg-red-100 text-red-800 border-red-300',
    badgeText: 'text-red-700',
    borderColor: 'border-red-500',
  },
};

export const GRADE_KEYS: GradeKey[] = ['O', 'A+', 'A', 'B+', 'B', 'C', 'U'];

/**
 * Determine academic classification from percentage
 */
export function getClassification(percentage: number, hasArrear: boolean = false): string {
  if (hasArrear) {
    return 'Re-appear (Arrear)';
  } else if (percentage >= 85) {
    return 'First Class with Distinction';
  } else if (percentage >= 65) {
    return 'First Class';
  } else if (percentage >= 50) {
    return 'Second Class';
  } else {
    return 'Pass Category';
  }
}

export function buildGradeMap(grades: GradeInfo[]): Record<string, GradeInfo> {
  const map: Record<string, GradeInfo> = {};
  grades.forEach((g) => {
    map[g.grade] = g;
  });
  return map;
}

/**
 * Calculate total marks, maximum marks, and percentage based on percentage concept:
 * Sum of grade assigned marks divided by total subjects
 */
export function calculateAcademicMetrics(
  subjects: SubjectInput[],
  candidateName?: string,
  customGradeMap?: Record<string, GradeInfo>
): CalculationResult {
  const count = subjects.length;
  if (count === 0) {
    return {
      candidateName,
      subjectCount: 0,
      totalMarks: 0,
      maxMarks: 0,
      percentage: 0,
      cgpa: 0,
      classification: 'N/A',
      subjects: [],
    };
  }

  const mapToUse = customGradeMap || GRADE_MAP;
  let totalMarks = 0;
  let totalPoints = 0;
  let hasArrear = false;
  const maxMarks = count * 100;

  subjects.forEach((sub) => {
    const info = mapToUse[sub.grade] || GRADE_MAP[sub.grade] || {
      grade: sub.grade,
      points: sub.gradePoint || 0,
      marks: sub.mark || 0,
      label: 'Evaluated Grade',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      badgeText: 'text-slate-700',
      borderColor: 'border-slate-500',
    };
    totalMarks += info.marks;
    totalPoints += info.points;
    if (sub.grade.toUpperCase() === 'U' || info.marks < 45) {
      hasArrear = true;
    }
  });

  // Percentage calculation: Sum of assigned marks divided by total subjects
  const percentage = Number((totalMarks / count).toFixed(2));
  const cgpa = Number((totalPoints / count).toFixed(2));
  const classification = getClassification(percentage, hasArrear);

  return {
    candidateName,
    subjectCount: count,
    totalMarks,
    maxMarks,
    percentage,
    cgpa,
    classification,
    subjects: [...subjects],
  };
}

/**
 * Generate default subject entries: code = 1, 2, ... and name = Subject 1, Subject 2, ...
 * Credits are omitted as requested.
 */
export function generateDefaultSubjects(count: number, defaultGrade: GradeKey = 'A+'): SubjectInput[] {
  const validCount = Math.max(1, Math.min(25, count));
  const list: SubjectInput[] = [];
  const info = GRADE_MAP[defaultGrade];

  for (let i = 1; i <= validCount; i++) {
    list.push({
      id: i,
      code: `${i}`,
      name: `Subject ${i}`,
      grade: defaultGrade,
      gradePoint: info.points,
      mark: info.marks,
      credits: 0,
    });
  }

  return list;
}
