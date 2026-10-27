import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  LetterDocument,
  SchoolProfile,
  SavedLetterRecord,
} from './types/letter';
import {
  DEFAULT_SCHOOL_PROFILE,
  getInitialLetterData,
  LETTER_TYPES_META,
} from './data/letterTemplates';
import {
  downloadLetterAsPdf,
  printLetterNative,
  generateLetterPlainText,
  downloadAsWordDoc,
} from './utils/pdfExport';
import { Navbar } from './components/Navbar';
import { OfficialLetterView } from './components/OfficialLetterView';
import { LetterEditorTabs } from './components/LetterEditorTabs';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { ArchiveModal } from './components/ArchiveModal';
import { AiDraftModal } from './components/AiDraftModal';
import { OfficialGuideModal } from './components/OfficialGuideModal';
import { PrintDownloadModal } from './components/PrintDownloadModal';
import {
  Printer,
  Download,
  Copy,
  Check,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileDown,
  Sparkles,
  School,
  History,
} from 'lucide-react';

export default function App() {
  // 1. Data Dokumen Aktif
  const [documentData, setDocumentData] = useState<LetterDocument>(() => {
    const saved = localStorage.getItem('suratkita_current_doc');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_e) {
        // fallback
      }
    }
    return getInitialLetterData('keterangan_aktif');
  });

  // 2. Data Profil Sekolah
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('suratkita_school_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_e) {
        // fallback
      }
    }
    return DEFAULT_SCHOOL_PROFILE;
  });

  // 3. Arsip Surat
  const [archives, setArchives] = useState<SavedLetterRecord[]>(() => {
    const saved = localStorage.getItem('suratkita_archives');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_e) {
        // fallback
      }
    }
    return [];
  });

  // UI States
  const [activeNavTab, setActiveNavTab] = useState<'editor' | 'profile' | 'archive' | 'guide'>('editor');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // Simpan autosave ke localStorage saat dokumen atau profil berubah
  useEffect(() => {
    localStorage.setItem('suratkita_current_doc', JSON.stringify(documentData));
  }, [documentData]);

  useEffect(() => {
    localStorage.setItem('suratkita_school_profile', JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem('suratkita_archives', JSON.stringify(archives));
  }, [archives]);

  // Handler Nav Tab
  const handleNavTabChange = (tab: 'editor' | 'profile' | 'archive' | 'guide') => {
    if (tab === 'profile') setShowProfileModal(true);
    else if (tab === 'archive') setShowArchiveModal(true);
    else if (tab === 'guide') setShowGuideModal(true);
    else setActiveNavTab('editor');
  };

  // Handler Simpan Dokumen ke Arsip
  const handleSaveToArchive = () => {
    const newRecord: SavedLetterRecord = {
      id: `arc_${Date.now()}`,
      letterNumber: documentData.letterNumber,
      subject: documentData.subject,
      type: documentData.type,
      targetName:
        documentData.student.name ||
        documentData.parentCall.studentName ||
        documentData.recipientName ||
        'Surat Keluar',
      date: documentData.letterDate,
      createdAt: new Date().toISOString(),
      document: { ...documentData },
    };

    // Cegah duplikat nomor surat yang sama jika baru disimpan
    const updated = [newRecord, ...archives.filter((a) => a.letterNumber !== documentData.letterNumber)];
    setArchives(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Handler Salin Teks Surat ke Clipboard
  const handleCopyText = async () => {
    const text = generateLetterPlainText(documentData, schoolProfile);
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch (_err) {
      console.error('Gagal menyalin teks');
    }
  };

  // Handler Ekspor Word/Txt
  const handleDownloadWord = () => {
    const filename = `Surat_${documentData.subject.replace(/[^a-zA-Z0-9]/g, '_')}`;
    downloadAsWordDoc(documentData, schoolProfile, filename);
  };

  // Handler Cetak Langsung (window.print)
  const handlePrint = () => {
    handleSaveToArchive();
    printLetterNative();
  };

  // Handler Unduh PDF Langsung (jspdf + html2canvas)
  const handleDownloadPdf = async (customFilename?: string): Promise<boolean> => {
    setIsDownloadingPdf(true);
    handleSaveToArchive();

    const recipientOrStudent =
      documentData.student.name ||
      documentData.recipientName ||
      documentData.type;
    const finalFilename =
      customFilename ||
      `Surat_${documentData.type}_${recipientOrStudent.slice(0, 20)}_${Date.now().toString().slice(-4)}`;

    const success = await downloadLetterAsPdf(
      'printable-letter',
      finalFilename,
      documentData.paperSize
    );

    setIsDownloadingPdf(false);

    if (success) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    return success;
  };

  // Handler Load dari Arsip
  const handleLoadArchiveRecord = (doc: LetterDocument) => {
    setDocumentData(doc);
    setActiveNavTab('editor');
  };

  const currentTypeMeta = LETTER_TYPES_META.find((m) => m.type === documentData.type);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeNavTab}
        onTabChange={handleNavTabChange}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloadingPdf}
        savedCount={archives.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 md:p-6 flex flex-col gap-4">
        {/* Subheader Toolbar & Status (No-Print) */}
        <div className="no-print bg-white border border-slate-200 rounded-xl p-3 md:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {currentTypeMeta?.title || documentData.title}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">
                {documentData.letterNumber}
              </span>
              <span className="text-slate-300 hidden md:inline">·</span>
              <span className="text-xs text-slate-500 hidden md:inline">
                Ukuran: <strong className="text-slate-700 font-semibold">{documentData.paperSize}</strong>
              </span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Mobile View Toggle */}
            <div className="lg:hidden flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setMobileView('editor')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  mobileView === 'editor' ? 'bg-white shadow-xs text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Formulir
              </button>
              <button
                type="button"
                onClick={() => setMobileView('preview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  mobileView === 'preview' ? 'bg-white shadow-xs text-indigo-700 font-semibold' : 'text-slate-600'
                }`}
              >
                Kertas Surat
              </button>
            </div>

            {/* Quick Draft with AI */}
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Asisten AI</span>
            </button>

            {/* Profile Setting Quick Access */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <School className="w-3.5 h-3.5 text-slate-500" />
              <span>Kop Sekolah</span>
            </button>

            {/* Save Archive */}
            <button
              onClick={handleSaveToArchive}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>{saveToast ? 'Tersimpan!' : 'Simpan Arsip'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
          {/* Sisi Kiri: Form Editor Interaktif (5 Kolom pada Desktop) */}
          <section
            className={`no-print lg:col-span-5 h-[calc(100vh-185px)] min-h-[580px] ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <LetterEditorTabs
              document={documentData}
              onChange={setDocumentData}
              onOpenAiDraft={() => setShowAiModal(true)}
              onPrintDirect={handlePrint}
              onDownloadPdfDirect={() => handleDownloadPdf()}
              onOpenPrintModal={() => setShowPrintModal(true)}
              isDownloadingPdf={isDownloadingPdf}
            />
          </section>

          {/* Sisi Kanan: Pratinjau Kertas Nyata (7 Kolom pada Desktop) */}
          <section
            className={`lg:col-span-7 flex flex-col h-[calc(100vh-185px)] min-h-[580px] bg-slate-200/60 rounded-xl border border-slate-300/80 overflow-hidden relative ${
              mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Toolbar Atas Pratinjau (No-Print) */}
            <div className="no-print bg-slate-100/90 backdrop-blur-xs border-b border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-700 z-10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">
                  Pratinjau Kertas ({documentData.paperSize})
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">
                  {documentData.paperSize === 'F4' ? 'Folio (215 × 330 mm)' : 'A4 (210 × 297 mm)'}
                </span>
              </div>

              {/* Kontrol Zoom & Export Cepat */}
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewScale((s) => Math.max(0.6, Number((s - 0.1).toFixed(1))))}
                    title="Perkecil"
                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-[11px] font-mono tabular-nums text-slate-700">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    onClick={() => setPreviewScale((s) => Math.min(1.4, Number((s + 0.1).toFixed(1))))}
                    title="Perbesar"
                    className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewScale(1)}
                    title="Ukuran 100%"
                    className="p-1 hover:bg-slate-100 rounded text-slate-600 border-l border-slate-200"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Salin Teks */}
                <button
                  onClick={handleCopyText}
                  title="Salin isi teks surat ke clipboard"
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
                >
                  {copyToast ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>

                {/* Ekspor Txt/Word */}
                <button
                  onClick={handleDownloadWord}
                  title="Unduh draf teks untuk Ms. Word"
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Ekspor Teks</span>
                </button>

                {/* Cetak Langsung */}
                <button
                  onClick={handlePrint}
                  title="Cetak langsung ke printer (Ctrl+P)"
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-semibold transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Cetak Langsung</span>
                </button>

                {/* Unduh PDF */}
                <button
                  onClick={() => handleDownloadPdf()}
                  disabled={isDownloadingPdf}
                  title="Unduh file PDF resmi siap cetak"
                  className="flex items-center gap-1.5 px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-xs disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloadingPdf ? 'Menyiapkan...' : 'Unduh PDF'}</span>
                </button>

                {/* Pengaturan Cetak & PDF Lanjutan */}
                <button
                  onClick={() => setShowPrintModal(true)}
                  title="Opsi & Pusat Cetak Lengkap"
                  className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Area Pratinjau Kertas Dokumen */}
            <div
              id="printable-letter-wrapper"
              ref={previewWrapperRef}
              className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-300/60 pb-16 lg:pb-8"
            >
              <OfficialLetterView
                document={documentData}
                school={schoolProfile}
                previewScale={previewScale}
              />
            </div>

            {/* Mobile Fixed Action Bar (Hanya tampil di mobile pada tab Kertas Surat) */}
            <div className="lg:hidden no-print fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center justify-between gap-2 shadow-lg z-30">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>Cetak Langsung</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPdf()}
                disabled={isDownloadingPdf}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloadingPdf ? 'Menyiapkan...' : 'Unduh PDF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* MODAL WINDOWS */}
      {showPrintModal && (
        <PrintDownloadModal
          document={documentData}
          school={schoolProfile}
          onClose={() => setShowPrintModal(false)}
          onPrintNow={handlePrint}
          onDownloadPdfNow={handleDownloadPdf}
          onUpdateDocument={setDocumentData}
          onUpdateSchool={setSchoolProfile}
        />
      )}

      {showProfileModal && (
        <SchoolProfileModal
          profile={schoolProfile}
          onChange={setSchoolProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showArchiveModal && (
        <ArchiveModal
          records={archives}
          onLoadRecord={handleLoadArchiveRecord}
          onDeleteRecord={(id) => setArchives(archives.filter((a) => a.id !== id))}
          onClearAll={() => setArchives([])}
          onClose={() => setShowArchiveModal(false)}
        />
      )}

      {showAiModal && (
        <AiDraftModal
          currentDoc={documentData}
          school={schoolProfile}
          onApplyDraft={(draft) => setDocumentData((prev) => ({ ...prev, ...draft }))}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {showGuideModal && <OfficialGuideModal onClose={() => setShowGuideModal(false)} />}
    </div>
  );
}
