import React from 'react';
import { UserSession } from '../types';
import {
  Calculator,
  History,
  Award,
  LogIn,
  LogOut,
  ShieldCheck,
  Home,
  Building2,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'calculator' | 'history' | 'admin' | 'grades';
  setCurrentTab: (tab: 'home' | 'calculator' | 'history' | 'admin' | 'grades') => void;
  user: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenLogin,
  onLogout,
  historyCount,
}) => {
  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';

  const handleLogoClick = () => {
    if (user?.role === 'admin') {
      setCurrentTab('admin');
    } else if (user?.role === 'staff') {
      setCurrentTab('calculator');
    } else {
      setCurrentTab('home');
    }
  };

  const handleGoToDepartments = () => {
    if (currentTab !== 'home') {
      setCurrentTab('home');
    }
    setTimeout(() => {
      const el = document.getElementById('departments');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top accreditation bar */}
      <div className="bg-[#0b192c] text-slate-300 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-amber-400 font-bold tracking-wide">
              <Award className="w-3.5 h-3.5" /> NAAC 'A+' Accredited
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300">Autonomous Institution</span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300">Affiliated to Anna University</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Rajapalayam, Tamil Nadu</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Portal Branding */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <img
              src="/rit-logo.png"
              alt="Ramco Institute of Technology Crest"
              className="w-12 h-12 object-contain rounded-xl p-0.5 bg-white border border-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0b192c] font-['Outfit',sans-serif]">
                  Ramco Institute of Technology
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  RIT
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Academic Mark & Percentage Calculation System
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
            {/* PUBLIC NAVIGATION: 1. Home -> 2. Departments -> 3. Mark Calculator */}
            {!isAdminOrStaff ? (
              <>
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'home'
                      ? 'bg-white text-blue-950 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-blue-800" />
                  Home
                </button>

                <button
                  onClick={handleGoToDepartments}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-800" />
                  Departments
                </button>

                <button
                  onClick={() => setCurrentTab('calculator')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'calculator'
                      ? 'bg-white text-blue-950 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-blue-800" />
                  Mark Calculator
                </button>
              </>
            ) : (
              /* ADMIN & STAFF NAVIGATION: Admin Dashboard (if admin) -> Mark Calculator -> Grade System */
              <>
                {user && user.role === 'admin' && (
                  <button
                    onClick={() => setCurrentTab('admin')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentTab === 'admin'
                        ? 'bg-[#0b192c] text-amber-300 shadow-sm'
                        : 'text-slate-700 hover:text-blue-950 hover:bg-white/60 font-black'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Admin Dashboard
                  </button>
                )}

                <button
                  onClick={() => setCurrentTab('calculator')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'calculator'
                      ? 'bg-white text-blue-950 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-blue-800" />
                  Mark Calculator
                </button>

                <button
                  onClick={() => setCurrentTab('grades')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'grades'
                      ? 'bg-white text-blue-950 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-bold'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  Grade System
                </button>
              </>
            )}

            {/* History Log */}
            {user && (
              <button
                onClick={() => setCurrentTab('history')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'history'
                    ? 'bg-white text-blue-950 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <History className="w-3.5 h-3.5 text-amber-600" />
                History Log
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-500 text-white">
                    {historyCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* User Status / Login Action */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                    {user.email}
                  </span>
                </div>
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-900 font-black text-xs border border-blue-200">
                  {user.name.charAt(0)}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b192c] hover:bg-blue-950 text-white text-xs font-bold shadow transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                Portal Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 text-xs">
          {!isAdminOrStaff ? (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className={`py-1 px-2 font-medium ${
                  currentTab === 'home' ? 'text-blue-950 font-bold' : 'text-slate-500'
                }`}
              >
                Home
              </button>

              <button
                onClick={handleGoToDepartments}
                className="py-1 px-2 font-medium text-slate-600 hover:text-blue-950"
              >
                Departments
              </button>

              <button
                onClick={() => setCurrentTab('calculator')}
                className={`py-1 px-2 font-medium ${
                  currentTab === 'calculator' ? 'text-blue-950 font-bold' : 'text-slate-500'
                }`}
              >
                Calculator
              </button>
            </>
          ) : (
            <>
              {user && user.role === 'admin' && (
                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`py-1 px-2 font-black ${
                    currentTab === 'admin' ? 'text-amber-600 font-extrabold' : 'text-slate-700 font-bold'
                  }`}
                >
                  Admin
                </button>
              )}

              <button
                onClick={() => setCurrentTab('calculator')}
                className={`py-1 px-2 font-medium ${
                  currentTab === 'calculator' ? 'text-blue-950 font-bold' : 'text-slate-500'
                }`}
              >
                Calculator
              </button>

              <button
                onClick={() => setCurrentTab('grades')}
                className={`py-1 px-2 font-bold ${
                  currentTab === 'grades' ? 'text-blue-950 font-black' : 'text-slate-600'
                }`}
              >
                Grade System
              </button>
            </>
          )}

          {user && (
            <button
              onClick={() => setCurrentTab('history')}
              className={`py-1 px-2 font-medium ${
                currentTab === 'history' ? 'text-blue-950 font-bold' : 'text-slate-500'
              }`}
            >
              History ({historyCount})
            </button>
          )}

          {!user && (
            <button onClick={onOpenLogin} className="py-1 px-2 text-blue-900 font-bold">
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
