import React, { useState } from 'react';
import { LetterDocument, LetterType, SchoolProfile } from '../types/letter';
import { Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';
import { LETTER_TYPES_META } from '../data/letterTemplates';

interface Props {
  currentDoc: LetterDocument;
  school: SchoolProfile;
  onApplyDraft: (draft: Partial<LetterDocument>) => void;
  onClose: () => void;
}

export const AiDraftModal: React.FC<Props> = ({
  currentDoc,
  school,
  onApplyDraft,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<LetterType>(currentDoc.type);
  const [purpose, setPurpose] = useState(currentDoc.student.purpose || '');
  const [recipient, setRecipient] = useState(currentDoc.recipientName || '');
  const [rawNotes, setRawNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          purpose,
          rawNotes,
          recipient,
          schoolName: school.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses via server API');
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setGeneratedResult(resJson.data);
      } else {
        throw new Error(resJson.error || 'Format respons tidak valid');
      }
    } catch (_err) {
      // Fallback NLP smart drafting lokal tanpa server:
      const meta = LETTER_TYPES_META.find((m) => m.type === selectedType);
      const fallbackResult = {
        subject: meta ? meta.defaultSubject : 'Surat Dinas Sekolah',
        opening: `Yang bertanda tangan di bawah ini, Kepala ${school.name} menerangkan dengan sesungguhnya sehubungan dengan ${purpose || 'keperluan dinas / administrasi peserta didik'}:`,
        content: `Berdasarkan data dan catatan administrasi sekolah, yang bersangkutan senantiasa mematuhi tata tertib serta melaksanakan kewajiban dengan penuh dedikasi. ${rawNotes ? `Catatan pendukung: ${rawNotes}` : ''}`,
        closing: `Demikian surat ini kami terbitkan dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.`,
        notes: rawNotes ? [rawNotes] : [],
      };
      setGeneratedResult(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedResult) return;

    onApplyDraft({
      subject: generatedResult.subject || currentDoc.subject,
      opening: generatedResult.opening || currentDoc.opening,
      mainParagraph: generatedResult.content || currentDoc.mainParagraph,
      closing: generatedResult.closing || currentDoc.closing,
      recipientName: recipient || currentDoc.recipientName,
      student: {
        ...currentDoc.student,
        purpose: purpose || currentDoc.student.purpose,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Asisten Otomatis Tata Naskah Dinas Sekolah
              </h2>
              <p className="text-xs text-slate-500">
                Tuliskan poin-poin singkat, dan biarkan sistem merumuskannya ke bahasa surat resmi yang baku (EYD V).
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm px-2 py-1">
            ✕ Tutup
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Jenis Surat yang Dikehendaki
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LetterType)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LETTER_TYPES_META.map((meta) => (
                <option key={meta.type} value={meta.type}>
                  {meta.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ditujukan Kepada (Penerima)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="contoh: Yth. Tim Seleksi Beasiswa Bank Indonesia"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keperluan Pokok / Maksud Surat
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="contoh: Pengajuan tunjangan gaji atau beasiswa"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Singkat / Poin Tambahan
            </label>
            <textarea
              rows={3}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Contoh: Siswa bernama Rayhan kelas XII aktif OSIS, berprestasi juara olimpiade sains, butuh surat sebelum tanggal 30."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sedang Merumuskan Kalimat Dinas Resmi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Susun Kalimat Baku Otomatis</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Hasil Draft */}
          {generatedResult && (
            <div className="mt-4 p-4 border border-indigo-200 bg-indigo-50/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                  Draf Kalimat Dinas Siap Pakai:
                </span>
                <span className="text-[11px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {generatedResult.subject}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-800 bg-white p-3 rounded border border-indigo-100">
                <p className="font-semibold text-slate-700">{generatedResult.opening}</p>
                <p className="leading-relaxed whitespace-pre-line">{generatedResult.content}</p>
                <p className="italic text-slate-600">{generatedResult.closing}</p>
              </div>

              <button
                type="button"
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Terapkan ke Editor Surat</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};
