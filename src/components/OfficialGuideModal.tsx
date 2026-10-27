import React from 'react';
import { BookOpen, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const OfficialGuideModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Panduan Tata Naskah Dinas Sekolah Resmi
              </h2>
              <p className="text-xs text-slate-500">
                Ringkasan format baku administrasi persuratan berdasarkan Permendikbudristek RI.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm px-2 py-1">
            ✕ Tutup
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Bagian 1: Kop Surat */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>1. Ketentuan Kepala Surat (Kop Surat)</span>
            </h3>
            <p>
              Kop surat dinas sekolah negeri mencantumkan nama pemerintah daerah (Provinsi/Kabupaten/Kota),
              Dinas Pendidikan, dan nama satuan pendidikan dengan huruf kapital tebal. Kop surat dilengkapi
              garis ganda (garis tebal di atas dan garis tipis di bawah).
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] space-y-0.5">
              <p className="font-bold text-center">PEMERINTAH DAERAH PROVINSI JAWA BARAT</p>
              <p className="font-bold text-center">DINAS PENDIDIKAN</p>
              <p className="font-bold text-center text-xs">SMA NEGERI 1 KOTA BANDUNG</p>
              <p className="text-center text-slate-500 text-[10px]">
                Jl. Ir. H. Juanda No. 93 · NPSN: 20219876 · Email: surat@sman1bdg.sch.id
              </p>
            </div>
          </section>

          {/* Bagian 2: Dua Jenis Format Surat */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>2. Dua Model Tata Letak Dokumen</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border border-slate-200 rounded-lg bg-white space-y-1">
                <span className="font-bold text-slate-900 block">A. Format Judul Tengah</span>
                <p className="text-slate-500 text-[11px]">
                  Digunakan untuk <strong>Surat Keterangan Aktif, SKKB, Rekomendasi, Surat Tugas, dan Pindah Sekolah</strong>.
                  Judul surat diletakkan di tengah lembar dengan huruf kapital tebal bergaris bawah, diikuti nomor surat tepat di bawahnya.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-white space-y-1">
                <span className="font-bold text-slate-900 block">B. Format Nomor di Kiri</span>
                <p className="text-slate-500 text-[11px]">
                  Digunakan untuk <strong>Surat Undangan Rapat, Surat Panggilan Orang Tua, dan Permohonan Dispensasi</strong>.
                  Mencantumkan kolom Nomor, Lampiran, dan Hal di sisi kiri, serta Tempat & Tanggal di sisi kanan atas.
                </p>
              </div>
            </div>
          </section>

          {/* Bagian 3: Kode Klasifikasi Surat */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>3. Standar Kode Klasifikasi Masalah Dinas</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li><strong className="text-slate-900">421.1</strong> : Urusan Sekolah Dasar (SD)</li>
              <li><strong className="text-slate-900">421.2</strong> : Urusan Sekolah Menengah Pertama (SMP)</li>
              <li><strong className="text-slate-900">421.3</strong> : Urusan SMA / SMK / SLB</li>
              <li><strong className="text-slate-900">800</strong> : Kepegawaian (Surat Perintah Tugas / SPT)</li>
            </ul>
          </section>

          {/* Bagian 4: Tips Cetak & Unduh PDF */}
          <section className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
              <AlertCircle className="w-4 h-4 text-indigo-700" />
              <span>Tips Mencetak & Ekspor PDF Presisi</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-indigo-900 text-[11px]">
              <li>Gunakan tombol <strong>"Unduh PDF"</strong> untuk mendapatkan berkas PDF otomatis tanpa repot.</li>
              <li>Jika menggunakan <strong>"Cetak Langsung" (Ctrl+P)</strong>, pastikan pada dialog printer memilih tujuan <em>"Save as PDF"</em>, margin <em>"None / Default"</em>, dan hapus centang <em>"Headers and Footers"</em> agar tidak ada alamat URL di pinggir kertas.</li>
              <li>Pilih kertas <strong>F4 / Folio</strong> jika kantor sekolah Anda menggunakan map folio panjang.</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
