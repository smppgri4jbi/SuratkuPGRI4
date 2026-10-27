import React, { useRef } from 'react';
import { SchoolProfile } from '../types/letter';
import {
  LOGO_TUT_WURI_HANDAYANI,
  LOGO_PEMDA_PROVINSI,
  LOGO_IKON_SEKOLAH,
  LOGO_KEMENAG,
} from '../data/defaultLogos';
import { Check, Upload, RotateCcw, Building2, User, Award, Stamp } from 'lucide-react';
import { DEFAULT_SCHOOL_PROFILE } from '../data/letterTemplates';

interface Props {
  profile: SchoolProfile;
  onChange: (profile: SchoolProfile) => void;
  onClose: () => void;
}

export const SchoolProfileModal: React.FC<Props> = ({ profile, onChange, onClose }) => {
  const leftLogoInputRef = useRef<HTMLInputElement>(null);
  const rightLogoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoLeft' | 'logoRight' | 'signatureUrl'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange({ ...profile, [field]: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan data profil sekolah ke contoh bawaan SMA Negeri 1 Bandung?')) {
      onChange(DEFAULT_SCHOOL_PROFILE);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pengaturan Profil Satuan Pendidikan & Kop Surat
              </h2>
              <p className="text-xs text-slate-500">
                Data ini akan otomatis tercantum pada kop surat, tanda tangan, dan cap stempel.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm px-2 py-1 rounded-md"
          >
            ✕ Tutup
          </button>
        </div>

        {/* Isi Formulir Profil */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identitas Instansi & Sekolah */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>1. Identitas Lembaga & Kop Surat</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instansi Induk / Pemerintah (Baris 1 Kop)
                </label>
                <input
                  type="text"
                  value={profile.govHeader}
                  onChange={(e) => onChange({ ...profile, govHeader: e.target.value })}
                  placeholder="contoh: PEMERINTAH DAERAH PROVINSI JAWA BARAT"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dinas / Yayasan / Cabang Dinas (Baris 2 Kop)
                </label>
                <input
                  type="text"
                  value={profile.subHeader}
                  onChange={(e) => onChange({ ...profile, subHeader: e.target.value })}
                  placeholder="contoh: DINAS PENDIDIKAN - CABANG WILAYAH VII"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Satuan Pendidikan (Baris Utama Kop) *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => onChange({ ...profile, name: e.target.value })}
                  placeholder="contoh: SMA NEGERI 1 KOTA BANDUNG"
                  className="w-full text-xs px-3 py-2 font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NPSN
                  </label>
                  <input
                    type="text"
                    value={profile.npsn}
                    onChange={(e) => onChange({ ...profile, npsn: e.target.value })}
                    placeholder="20219876"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Akreditasi
                  </label>
                  <input
                    type="text"
                    value={profile.akreditasi}
                    onChange={(e) => onChange({ ...profile, akreditasi: e.target.value })}
                    placeholder='Terakreditasi "A"'
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Jalan & Lingkungan
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => onChange({ ...profile, address: e.target.value })}
                  placeholder="Jl. Ir. H. Juanda No. 93, Dago"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kota / Kabupaten & Kode Pos
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => onChange({ ...profile, city: e.target.value })}
                  placeholder="Kota Bandung, Jawa Barat 40135"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Telepon / Fax
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => onChange({ ...profile, phone: e.target.value })}
                  placeholder="(022) 2503215"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => onChange({ ...profile, email: e.target.value })}
                    placeholder="info@sekolah.sch.id"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Website Resmi
                  </label>
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) => onChange({ ...profile, website: e.target.value })}
                    placeholder="www.sekolah.sch.id"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Kop Surat */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-500" />
              <span>2. Pengaturan Logo Kop Surat</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Kiri */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Logo Kiri (Pemda / Kemdikbud / Kemenag)
                  </span>
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-1">
                    {profile.logoLeft ? (
                      <img src={profile.logoLeft} alt="Preview" className="max-h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400">Kosong</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onChange({ ...profile, logoLeft: LOGO_PEMDA_PROVINSI })}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50"
                  >
                    Logo Pemda
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...profile, logoLeft: LOGO_TUT_WURI_HANDAYANI })}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50"
                  >
                    Tut Wuri Handayani
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...profile, logoLeft: LOGO_KEMENAG })}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50"
                  >
                    Kemenag
                  </button>
                  <button
                    type="button"
                    onClick={() => leftLogoInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Logo Sendiri</span>
                  </button>
                  <input
                    ref={leftLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logoLeft')}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Logo Kanan */}
              <div className="p-4 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Logo Kanan (Tut Wuri / Lambang Sekolah)
                  </span>
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-1">
                    {profile.logoRight ? (
                      <img src={profile.logoRight} alt="Preview" className="max-h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-slate-400">Tidak ada</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onChange({ ...profile, logoRight: LOGO_TUT_WURI_HANDAYANI })}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50"
                  >
                    Tut Wuri Handayani
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...profile, logoRight: LOGO_IKON_SEKOLAH })}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50"
                  >
                    Lambang Sekolah
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...profile, logoRight: '' })}
                    className="px-2.5 py-1 text-xs text-rose-600 border border-rose-200 rounded hover:bg-rose-50"
                  >
                    Hapus Logo Kanan
                  </button>
                  <button
                    type="button"
                    onClick={() => rightLogoInputRef.current?.click()}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Logo Sendiri</span>
                  </button>
                  <input
                    ref={rightLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logoRight')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pejabat Penandatangan & Stempel */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>3. Pejabat Penandatangan & Keabsahan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pejabat (Beserta Gelar Lengkap) *
                </label>
                <input
                  type="text"
                  value={profile.headmasterName}
                  onChange={(e) => onChange({ ...profile, headmasterName: e.target.value })}
                  placeholder="Drs. H. Dedi Suryadi, M.Pd."
                  className="w-full text-xs px-3 py-2 font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP / NUPTK / NIP PPPK
                </label>
                <input
                  type="text"
                  value={profile.headmasterNip}
                  onChange={(e) => onChange({ ...profile, headmasterNip: e.target.value })}
                  placeholder="19680315 199403 1 004"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan Penandatangan
                </label>
                <input
                  type="text"
                  value={profile.headmasterRole}
                  onChange={(e) => onChange({ ...profile, headmasterRole: e.target.value })}
                  placeholder="Kepala Sekolah / Plt. Kepala Sekolah"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Opsi Stempel & Fitur Keabsahan */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Stamp className="w-4 h-4 text-indigo-600" />
                <span>Opsi Stempel & Tanda Tangan Digital</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.enableStamp}
                    onChange={(e) => onChange({ ...profile, enableStamp: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Tampilkan Stempel Sekolah</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.enableSignature}
                    onChange={(e) => onChange({ ...profile, enableSignature: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Tampilkan Tanda Tangan</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.enableQr}
                    onChange={(e) => onChange({ ...profile, enableQr: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>Tampilkan QR Verifikasi Dokumen</span>
                </label>
              </div>

              {profile.enableStamp && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-600">Warna Tinta Stempel:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onChange({ ...profile, stampColor: 'purple' })}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        profile.stampColor === 'purple'
                          ? 'bg-purple-100 text-purple-900 border-purple-400 font-semibold'
                          : 'border-slate-300 text-slate-700'
                      }`}
                    >
                      Ungu Dinas (Standar)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ ...profile, stampColor: 'blue' })}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        profile.stampColor === 'blue'
                          ? 'bg-blue-100 text-blue-900 border-blue-400 font-semibold'
                          : 'border-slate-300 text-slate-700'
                      }`}
                    >
                      Biru Instansi
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ ...profile, stampColor: 'black' })}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        profile.stampColor === 'black'
                          ? 'bg-slate-200 text-slate-900 border-slate-400 font-semibold'
                          : 'border-slate-300 text-slate-700'
                      }`}
                    >
                      Hitam Netral
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Gambar Tanda Tangan Khusus */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => signatureInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded hover:bg-slate-50"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  <span>
                    {profile.signatureUrl
                      ? 'Ganti Gambar Tanda Tangan'
                      : 'Upload PNG Tanda Tangan Transparan'}
                  </span>
                </button>
                {profile.signatureUrl && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...profile, signatureUrl: '' })}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Gunakan Simulasi Tanda Tangan Bawaan
                  </button>
                )}
                <input
                  ref={signatureInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => handleFileUpload(e, 'signatureUrl')}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Profil Bawaan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Selesai & Terapkan Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
