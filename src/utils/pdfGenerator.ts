import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult, GradeKey, GradeInfo } from '../types';
import { GRADE_MAP, GRADE_KEYS } from './gradeData';

export interface GeneratePdfOptions {
  calculation: CalculationResult;
  userEmail?: string;
  userName?: string;
  department?: string;
  semester?: string;
  generatedDate?: string;
  gradeMap?: Record<string, GradeInfo>;
  grades?: GradeInfo[];
}

export function generateGradeSheetPdf(options: GeneratePdfOptions): void {
  const {
    calculation,
    userEmail,
    department = 'General Academic',
    semester = 'Mark Calculation',
    gradeMap,
    grades,
    generatedDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  } = options;

  const activeGradeMap = gradeMap || GRADE_MAP;

  // Handle student name: If given, use it; if no name provided, default to "Anonymous"
  const rawName = calculation.candidateName?.trim() || options.userName?.trim() || '';
  const isAnonymous = rawName.length === 0;
  const displayName = isAnonymous ? 'Anonymous' : rawName;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Top header banner background (#0b192c - RIT Navy)
  doc.setFillColor(11, 25, 44);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent line under header (#d97706 - RIT Gold / Amber)
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // College Name & Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RAMCO INSTITUTE OF TECHNOLOGY', pageWidth / 2, 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text(
    'Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai',
    pageWidth / 2,
    19,
    { align: 'center' }
  );
  doc.text(
    'An Autonomous Institution | Accredited with "A+" Grade by NAAC | NBA Accredited',
    pageWidth / 2,
    25,
    { align: 'center' }
  );
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(
    'North Venganallur Village, Rajapalayam – 626 117, Virudhunagar District, Tamil Nadu',
    pageWidth / 2,
    31,
    { align: 'center' }
  );

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(11, 25, 44);
  doc.text('OFFICIAL MARK & PERCENTAGE STATEMENT', pageWidth / 2, 48, {
    align: 'center',
  });

  doc.setDrawColor(203, 213, 225);
  doc.line(15, 51, pageWidth - 15, 51);

  // Student Information Box (Only Name and Date)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 54, pageWidth - 30, 14, 2.5, 2.5, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Candidate / Student Name:', 20, 62.5);

  doc.setFont('helvetica', isAnonymous ? 'italic' : 'bold');
  doc.setTextColor(isAnonymous ? 100 : 15, isAnonymous ? 116 : 23, isAnonymous ? 139 : 42);
  doc.text(displayName, 68, 62.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Statement Date:', pageWidth / 2 + 10, 62.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(generatedDate.split(',')[0], pageWidth / 2 + 42, 62.5);

  // Table 1: Evaluated Subjects Table
  const tableRows = calculation.subjects.map((sub, idx) => {
    const info = activeGradeMap[sub.grade as GradeKey] || GRADE_MAP[sub.grade as GradeKey] || {
      grade: sub.grade,
      marks: sub.mark || 0,
      points: sub.gradePoint || 0,
    };
    return [
      (idx + 1).toString(),
      sub.code || (idx + 1).toString(),
      sub.name || `Subject ${idx + 1}`,
      info.grade,
      info.marks.toString(),
    ];
  });

  autoTable(doc, {
    startY: 73,
    margin: { left: 15, right: 15 },
    head: [
      [
        'S.No',
        'Subject Code',
        'Subject Description',
        'Grade',
        'Assigned Marks',
      ],
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [11, 25, 44],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 2.2,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      1: { halign: 'center', cellWidth: 32, fontStyle: 'bold' },
      2: { halign: 'left', cellWidth: 80 },
      3: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 26, fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // @ts-ignore
  const finalY = (doc as any).lastAutoTable?.finalY || 145;

  // Performance Summary Box (Only Total Subjects and Total Percentage)
  const summaryBoxY = finalY + 6;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, summaryBoxY, pageWidth - 30, 18, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('PERFORMANCE EVALUATION SUMMARY', 20, summaryBoxY + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Total Subjects:', 20, summaryBoxY + 13.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(11, 25, 44);
  doc.text(`${calculation.subjectCount}`, 48, summaryBoxY + 13.5);

  // Large Total Percentage Display
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL PERCENTAGE', pageWidth - 45, summaryBoxY + 7.5, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(217, 119, 6);
  doc.text(`${calculation.percentage.toFixed(2)} %`, pageWidth - 45, summaryBoxY + 14.5, { align: 'center' });


  // Document Footer Banner (Rendered on all pages)
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(11, 25, 44);
    doc.rect(0, 287, pageWidth, 10, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.text(
      '© 2026 Ramco Institute of Technology, Rajapalayam. Certified Academic Mark Statement.',
      pageWidth / 2,
      293,
      { align: 'center' }
    );
  }

  // Filename generation
  const sanitizedName = displayName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `RIT_Mark_Statement_${sanitizedName}_${calculation.percentage}Pct.pdf`;
  doc.save(filename);
}
