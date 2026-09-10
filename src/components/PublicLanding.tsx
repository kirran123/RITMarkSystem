import React from 'react';
import { UserSession, DepartmentItem, GradeInfo } from '../types';
import { GRADE_MAP, GRADE_KEYS } from '../utils/gradeData';
import {
  Sparkles,
  Calculator,
  Award,
  BookOpen,
  FileText,
  ShieldCheck,
  GraduationCap,
  Layers,
  ArrowRight,
  Mail,
  User,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Building2
} from 'lucide-react';

interface PublicLandingProps {
  user: UserSession | null;
  departments: DepartmentItem[];
  grades?: GradeInfo[];
  onOpenLogin: () => void;
  onEnterCalculator: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  user,
  departments,
  grades,
  onOpenLogin,
  onEnterCalculator,
}) => {
  return (
    <div className="space-y-20 text-slate-800 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Ramco Institute of Technology — Mark Calculation Portal</span>
          </div>

          {/* Heading with exact sky blue color (#0384c7) from user reference image */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6 font-['Outfit',sans-serif] text-[#0384c7]">
            Academic Mark &<br />
            Percentage System
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            A verified institutional academic portal for semester mark evaluation, dynamic course calculations, regulation-wise subject scoring, and certified PDF statements.
          </p>

          {/* Single primary CTA - removed "Sign In for History" button */}
          <div className="flex justify-center items-center mb-16">
            <button
              onClick={onEnterCalculator}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#0b192c] hover:bg-blue-950 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-sm cursor-pointer"
            >
              <Calculator className="h-4 w-4 text-amber-400" />
              <span>Enter Mark Calculation Portal</span>
              <ArrowRight className="h-4 w-4 text-slate-300" />
            </button>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: `${departments.length}+`, label: 'Academic Departments' },
              { value: '8', label: 'Semester Curriculums' },
              { value: '100%', label: 'Autonomous Accuracy' },
              { value: 'PDF', label: 'Certified Statements' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm hover:shadow transition-all"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#0b192c] font-['Outfit',sans-serif] mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Departments Section ("Our Academic Ecosystem" in place of public calculator) */}
      <section id="departments" className="scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-widest mb-3">
              <Building2 className="h-3.5 w-3.5 text-blue-800" />
              <span>Academic Departments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 font-['Outfit',sans-serif]">
              Our Academic Ecosystem
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
              Explore departments, official engineering programs, and Head of Department contacts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {departments.map((dept) => (
              <div
                key={dept.id || dept.code}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-black border border-blue-200">
                      {dept.code}
                    </span>
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1 font-['Outfit',sans-serif]">
                    {dept.name}
                  </h3>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">
                      HOD: <span className="text-slate-800 font-semibold">{dept.hodName}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-blue-800 hover:underline truncate"
                    >
                      {dept.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mark System Regulations Section */}
      <section id="standards" className="scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-widest mb-3">
              <BookOpen className="h-3.5 w-3.5 text-blue-800" />
              <span>Autonomous Grade Scale</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 font-['Outfit',sans-serif]">
              Mark System & Grade Value Standards
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
              Ramco Institute of Technology standard conversion mapping letter grades to exact mark values.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0b192c] text-white text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Letter Grade</th>
                    <th className="py-3.5 px-6">Performance Level</th>
                    <th className="py-3.5 px-6 text-center">Mark Value Awarded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(grades || GRADE_KEYS.map((gk) => GRADE_MAP[gk])).map((info) => {
                    return (
                      <tr key={info.grade} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-6 font-extrabold text-slate-900">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold border ${info.badgeBg}`}>
                            {info.grade}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-700 font-medium">{info.label}</td>
                        <td className="py-3.5 px-6 text-center font-extrabold text-amber-600 text-base">
                          {info.marks} Marks
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Staff & Admin Access Banner */}
      <section className="pb-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-[#0b192c] to-[#1e3a8a] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900/40">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 px-4 py-1.5 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
              <Lock className="h-3.5 w-3.5" />
              <span>Authorized and Staff Access</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 font-['Outfit',sans-serif]">
              Access Mark Calculator & Department Tools
            </h2>

            <p className="text-slate-300 max-w-lg mx-auto mb-8 text-xs sm:text-sm leading-relaxed">
              Sign in with your authorized account to calculate marks, store logs to history, manage faculty permissions, and download certified PDFs.
            </p>

            <button
              onClick={user ? onEnterCalculator : onOpenLogin}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm cursor-pointer"
            >
              <span>{user ? 'Open Calculator Workspace' : 'Sign In with Authorized Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
