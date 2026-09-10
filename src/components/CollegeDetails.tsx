import React from 'react';
import { Award, BookOpen, Building2, Compass, CheckCircle2, Users, Target, ShieldCheck } from 'lucide-react';

export const CollegeDetails: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b192c] via-[#11233e] to-[#1e3a8a] text-white p-8 sm:p-12 shadow-xl border border-blue-900/40">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Estd. 2013 • Autonomous Institution
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit',sans-serif] tracking-tight">
            Ramco Institute of Technology
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Ramco Institute of Technology (RIT), founded under the benevolent vision of Shri P. R. Ramasubrahmaneya Rajha, is one of the premier engineering institutions in South Tamil Nadu, dedicated to academic excellence, state-of-the-art technological infrastructure, and human values.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 bg-white/10 rounded-xl border border-white/15 text-amber-300 font-bold">
              NAAC 'A+' Grade
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-xl border border-white/15 text-slate-200 font-bold">
              NBA Accredited
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-xl border border-white/15 text-slate-200 font-bold">
              Affiliated to Anna University
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-xl border border-white/15 text-slate-200 font-bold">
              AICTE Approved
            </span>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Our Aspiration</span>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">Vision of RIT</h3>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            "To evolve into an Institute of Excellence in technical education through high quality learning, state-of-the-art research, and nurturing ethical, competent engineers to meet dynamic global challenges."
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Our Purpose</span>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">Mission of RIT</h3>
            </div>
          </div>
          <ul className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Provide value-based, cutting-edge technical education with modern curricula.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Foster industrial collaborations, innovation centers, and entrepreneurial capabilities.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Inculcate environmental consciousness, professional ethics, and leadership qualities.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Academic Engineering Departments */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            Academic Departments & Programs
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Empowering students with cutting-edge engineering specializations and accredited degree programs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { code: 'IT', name: 'Information Technology', desc: 'Software Engineering, Cloud, & AI' },
            { code: 'AI&DS', name: 'Artificial Intelligence & Data Science', desc: 'Machine Learning & Analytics' },
            { code: 'AIML', name: 'Artificial Intelligence & Machine Learning', desc: 'Deep Learning, Computer Vision & NLP' },
            { code: 'CSE', name: 'Computer Science & Engineering', desc: 'Algorithms, Systems & Data' },
            { code: 'CSBS', name: 'CS & Business Systems', desc: 'Enterprise Systems & Tech Strategy' },
            { code: 'CYBER', name: 'Cyber Security', desc: 'Network Security, Cryptography & Defense' },
            { code: 'ECE', name: 'Electronics & Communication', desc: 'VLSI, IoT & Embedded Systems' },
            { code: 'EEE', name: 'Electrical & Electronics', desc: 'Power Systems, Renewable Energy' },
            { code: 'MECH', name: 'Mechanical Engineering', desc: 'Robotics, Automation & Design' },
            { code: 'CIVIL', name: 'Civil Engineering', desc: 'Smart Infrastructure & Structural' },
          ].map((dept) => (
            <div
              key={dept.code}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all hover:shadow-sm"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-black text-xs mb-2">
                {dept.code}
              </span>
              <h4 className="text-sm font-bold text-slate-800">{dept.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{dept.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
