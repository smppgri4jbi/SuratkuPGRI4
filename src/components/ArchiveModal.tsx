import React, { useState } from 'react';
import { SavedLetterRecord, LetterDocument } from '../types/letter';
import { History, Search, Trash2, ArrowRight, Printer, Calendar, FileText } from 'lucide-react';

interface Props {
  records: SavedLetterRecord[];
  onLoadRecord: (doc: LetterDocument) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const ArchiveModal: React.FC<Props> = ({
  records,
  onLoadRecord,
  onDeleteRecord,
  onClearAll,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.letterNumber.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.targetName.toLowerCase().includes(q) ||
      r.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Arsip & Riwayat Surat Keluar</h2>
              <p className="text-xs text-slate-500">
                Surat yang pernah Anda buat tersimpan otomatis di memori lokal peramban.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm px-2 py-1">
            ✕ Tutup
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nomor surat, nama siswa, atau perihal..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {records.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Yakin ingin menghapus seluruh riwayat arsip surat?')) {
                  onClearAll();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 shrink-0"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {/* Record List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-sm font-medium text-slate-600">Belum Ada Riwayat Surat</p>
              <p className="text-xs">
                Surat yang Anda cetak atau simpan akan otomatis tercatat rapi di sini.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Tidak ada surat yang cocok dengan kata kunci "{search}"
            </div>
          ) : (
            filtered.map((record) => (
              <div
                key={record.id}
                className="p-4 border border-slate-200 hover:border-indigo-300 rounded-lg bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {record.letterNumber}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {record.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {record.subject}
                  </h3>

                  <p className="text-xs text-slate-600">
                    Penerima / Sasaran: <span className="font-medium text-slate-800">{record.targetName || '-'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onLoadRecord(record.document);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    <span>Buka & Sunting</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    title="Hapus dari arsip"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Total {records.length} surat dalam arsip lokal</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
