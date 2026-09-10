import React from 'react';
import { GRADE_MAP, GRADE_KEYS } from '../utils/gradeData';
import { Award, BookOpen, CheckCircle, Calculator, Info } from 'lucide-react';

export const GradingScheme: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Official Academic Scale
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Ramco Institute of Technology Grading System
            </h2>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          The calculation system operates in strict accordance with Ramco Institute of Technology (Autonomous) academic regulations, mapping letter grades directly to official grade points and percentage equivalents.
        </p>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-800" />
            Letter Grade to Mark & Grade Point (GP) Conversion Table
          </h3>
          <span className="text-xs font-semibold text-slate-500">Scale: 10.0 Base</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0b192c] text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Letter Grade</th>
                <th className="py-3.5 px-6">Performance Level</th>
                <th className="py-3.5 px-6 text-center">Grade Point (GP)</th>
                <th className="py-3.5 px-6 text-center">Equivalent Mark Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GRADE_KEYS.map((gk) => {
                const info = GRADE_MAP[gk];
                return (
                  <tr key={gk} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold border ${info.badgeBg}`}>
                        {gk}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">{info.label}</td>
                    <td className="py-4 px-6 text-center font-bold text-blue-900">{info.points}</td>
                    <td className="py-4 px-6 text-center font-extrabold text-amber-600">{info.marks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold">
            <Calculator className="w-5 h-5" />
            <h4>Percentage Calculation Formula</h4>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
            <p>Total Marks = Sum of grade assigned marks of all subjects</p>
            <p>Total Subjects = Number of evaluated subjects</p>
            <p className="font-bold text-amber-700 pt-1">
              Percentage (%) = Total Marks / Number of Subjects
            </p>
          </div>
          <p className="text-xs text-slate-500">
            For example, with 8 subjects and all 'A+' grades (90 marks each): Total Marks = 720. Percentage = 720 / 8 = 90.00%.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h4>Mark Calculation & Grade Point Formula</h4>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
            <p>Total Grade Points = Sum of Grade Points (GP)</p>
            <p className="font-bold text-emerald-700 pt-1">
              Mark Calculation Average = Total Grade Points / Number of Subjects
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Calculated according to the RIT Autonomous syllabus benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
};
