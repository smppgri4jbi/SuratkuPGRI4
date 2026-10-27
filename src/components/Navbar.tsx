import React from 'react';
import { FileText, School, History, Sparkles, Printer, Download } from 'lucide-react';

interface Props {
  activeTab: 'editor' | 'profile' | 'archive' | 'guide';
  onTabChange: (tab: 'editor' | 'profile' | 'archive' | 'guide') => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  savedCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onPrint,
  onDownloadPdf,
  isDownloadingPdf,
  savedCount,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            SuratKitaPGRI4
          </span>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-500 pl-1 border-l border-slate-300">
            Yayasan Sekolah
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('editor')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'editor' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Editor Surat</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'profile' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Profil Sekolah</span>
          </button>

          <button
            onClick={() => onTabChange('archive')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 relative ${
              activeTab === 'archive' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Arsip Surat</span>
            {savedCount > 0 && (
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full tabular-nums font-semibold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('guide')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'guide' ? 'text-indigo-600 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Panduan Format Dinas</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onPrint}
            title="Cetak langsung menggunakan dialog cetak peramban (Ctrl+P)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Langsung</span>
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-sm whitespace-nowrap disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingPdf ? 'Menyiapkan PDF...' : 'Unduh PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
