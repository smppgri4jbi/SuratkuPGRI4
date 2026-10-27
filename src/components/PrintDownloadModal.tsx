import React, { useState } from 'react';
import { LetterDocument, SchoolProfile, PaperSize } from '../types/letter';
import {
  Printer,
  Download,
  FileCheck,
  Settings2,
  Check,
  AlertCircle,
  Copy,
  FileDown,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { generateLetterPlainText } from '../utils/pdfExport';

interface Props {
  document: LetterDocument;
  school: SchoolProfile;
  onClose: () => void;
  onPrintNow: () => void;
  onDownloadPdfNow: (customFilename?: string) => Promise<boolean>;
  onUpdateDocument: (doc: LetterDocument) => void;
  onUpdateSchool: (school: SchoolProfile) => void;
}

export const PrintDownloadModal: React.FC<Props> = ({
  document: doc,
  school,
  onClose,
  onPrintNow,
  onDownloadPdfNow,
  onUpdateDocument,
  onUpdateSchool,
}) => {
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  
  const recipientOrStudent =
    doc.student.name || doc.parentCall.studentName || doc.recipientName || 'Surat';
  const defaultFilename = `Surat_${doc.type}_${recipientOrStudent.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const [filename, setFilename] = useState(defaultFilename);

  const handleDownload = async () => {
    setIsProcessingPdf(true);
    setDownloadSuccess(false);
    const ok = await onDownloadPdfNow(filename);
    setIsProcessingPdf(false);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handleCopy = async () => {
    const text = generateLetterPlainText(doc, school);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (_e) {
      console.error('Gagal menyalin teks');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pusat Cetak & Unduh Dokumen PDF
              </h2>
              <p className="text-xs text-slate-500">
                Pilih opsi cetak langsung ke printer atau unduh berkas PDF siap edar.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* 2 Tombol Aksi Utama Besar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Opsi 1: Cetak Langsung */}
            <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/80 transition-all flex flex-col justify-between gap-3">
              <div>
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Printer className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-indigo-950">
                  Cetak Langsung ke Printer
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Buka dialog cetak sistem (Ctrl+P). Hasil cetak otomatis bersih tanpa tombol, header, atau footer situs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onPrintNow();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Buka Dialog Cetak (Print)</span>
              </button>
            </div>

            {/* Opsi 2: Unduh PDF Otomatis */}
            <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80 transition-all flex flex-col justify-between gap-3">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Unduh Berkas PDF (.pdf)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Menyimpan file dokumen PDF beresolusi tinggi langsung ke perangkat Anda secara instan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isProcessingPdf}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors disabled:opacity-60"
              >
                {isProcessingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang Menyusun PDF...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>PDF Berhasil Diunduh!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Unduh File PDF Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Konfigurasi Cepat Sebelum Cetak */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Settings2 className="w-4 h-4 text-slate-500" />
              <span>Pengaturan Format Dokumen & Keabsahan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Ukuran Kertas */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ukuran Kertas:
                </label>
                <div className="flex items-center gap-1.5">
                  {(['A4', 'F4', 'Letter'] as PaperSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onUpdateDocument({ ...doc, paperSize: size })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        doc.paperSize === size
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {size === 'F4' ? 'F4 (Folio)' : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Berkas PDF */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama File Dokumen:
                </label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  placeholder="Nama_File_Surat"
                />
              </div>
            </div>

            {/* Toggle Keabsahan Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={school.enableStamp}
                  onChange={(e) => onUpdateSchool({ ...school, enableStamp: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Cap Stempel Sekolah</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={school.enableSignature}
                  onChange={(e) => onUpdateSchool({ ...school, enableSignature: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Tanda Tangan Digital</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={school.enableQr}
                  onChange={(e) => onUpdateSchool({ ...school, enableQr: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>QR Code Validasi</span>
              </label>
            </div>
          </div>

          {/* Tips Cetak Sempurna */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Petunjuk untuk Hasil Cetak Maksimal di Browser:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
              <li>Pilih tujuan cetak <strong>"Save as PDF"</strong> atau printer fisik Anda.</li>
              <li>Pada opsi <em>Margin</em>, pilih <strong>"Default"</strong> atau <strong>"None"</strong>.</li>
              <li>Hapus centang pada <strong>"Headers and footers"</strong> agar tanggal atau link web browser tidak tercetak di margin kertas.</li>
              <li>Centang <strong>"Background graphics"</strong> agar warna stempel dan logo tampil cerah sempurna.</li>
            </ul>
          </div>

          {/* Opsi Alternatif Salin / Txt */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-500">Alternatif Ekspor Lainnya:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Teks Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salin Seluruh Teks</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            {doc.letterNumber}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
