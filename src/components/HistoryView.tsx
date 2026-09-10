import React, { useState } from 'react';
import { HistoryRecord, UserSession } from '../types';
import { generateGradeSheetPdf } from '../utils/pdfGenerator';
import {
  History,
  Trash2,
  Download,
  RotateCcw,
  Calendar,
  Layers,
  LogIn,
  FileSpreadsheet,
  User,
  RefreshCw,
  Cloud
} from 'lucide-react';

interface HistoryViewProps {
  user: UserSession | null;
  history: HistoryRecord[];
  onOpenLogin: () => void;
  onDeleteRecord: (id: string) => Promise<void>;
  onClearAll: () => Promise<void>;
  onReloadToCalculator: (record: HistoryRecord) => void;
  onSyncCloud?: () => Promise<void>;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  user,
  history,
  onOpenLogin,
  onDeleteRecord,
  onClearAll,
  onReloadToCalculator,
  onSyncCloud,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = async () => {
    if (onSyncCloud) {
      setIsSyncing(true);
      try {
        await onSyncCloud();
      } finally {
        setIsSyncing(false);
      }
    }
  };
  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-md border border-slate-200 animate-fade-in my-12">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
          Authorized Staff Login Required
        </h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Please sign in with your authorized staff account to view and synchronize your saved calculation history.
        </p>
        <button
          onClick={onOpenLogin}
          className="mt-6 px-6 py-3 bg-[#0b192c] hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-amber-400" />
          Sign In to Access History
        </button>
      </div>
    );
  }

  const handleDownloadPdf = (rec: HistoryRecord) => {
    generateGradeSheetPdf({
      calculation: rec,
      userEmail: rec.userEmail,
      userName: rec.candidateName || rec.userName || user.name,
      department: user.department || 'Information Technology',
      semester: rec.semester || 'Academic Mark Statement',
      generatedDate: new Date(rec.timestamp).toLocaleString('en-IN'),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Mark Calculation History Log
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-900 rounded-full border border-blue-200">
                {history.length} Saved Records
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Convex Cloud Synced</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Account: <span className="font-semibold text-slate-800">{user.email}</span> (Ramco Institute of Technology)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onSyncCloud && (
            <button
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync with Convex Cloud'}</span>
            </button>
          )}

          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear All History
            </button>
          )}
        </div>
      </div>

      {/* History Records List */}
      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">No Calculation Records Saved Yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Use the Mark Calculator to evaluate your semester marks, then click "Save to My Account History" to keep records here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.candidateName && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-950 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      <User className="w-3 h-3 text-blue-700" />
                      {item.candidateName}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(item.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {item.subjectCount} Subjects
                  </span>
                </div>

                {/* Subject Grade Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {item.subjects.map((sub, i) => (
                    <span
                      key={i}
                      title={`${sub.name}: ${sub.grade} (${sub.mark} Marks)`}
                      className="px-2 py-0.5 text-[11px] font-bold bg-slate-50 text-slate-700 rounded-md border border-slate-200"
                    >
                      S{i + 1}: <span className="text-blue-900">{sub.grade} ({sub.mark}m)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics & Actions */}
              <div className="flex items-center gap-6 self-end md:self-center">
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marks</span>
                    <span className="text-sm font-black text-slate-900">
                      {item.totalMarks} <span className="text-xs text-slate-500 font-medium">(÷{item.subjectCount})</span>
                    </span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Percentage</span>
                    <span className="text-base font-black text-amber-600">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  <button
                    onClick={() => onReloadToCalculator(item)}
                    title="Load back into calculator"
                    className="p-2 text-blue-900 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(item)}
                    title="Download Mark Statement PDF"
                    className="p-2 text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteRecord(item.id)}
                    title="Delete record"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
