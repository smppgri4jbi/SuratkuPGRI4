export type LetterType =
  | 'keterangan_aktif'
  | 'undangan_ortu'
  | 'dispensasi_lomba'
  | 'kelakuan_baik'
  | 'panggilan_ortu'
  | 'surat_tugas'
  | 'rekomendasi'
  | 'keterangan_pindah'
  | 'kustom';

export type PaperSize = 'A4' | 'F4' | 'Letter';
export type FontFamily = 'serif' | 'sans';
export type FontSize = 'sm' | 'base' | 'lg';
export type LineSpacing = 'tight' | 'normal' | 'relaxed';
export type MarginSize = 'standard' | 'compact' | 'wide';

export interface SchoolProfile {
  govHeader: string; // contoh: PEMERINTAH PROVINSI JAWA BARAT / DINAS PENDIDIKAN
  subHeader: string; // contoh: CABANG DINAS PENDIDIKAN WILAYAH VII
  name: string; // contoh: SMA NEGERI 1 KOTA BANDUNG
  npsn: string; // contoh: 20219876
  akreditasi: string; // contoh: Terakreditasi "A" (Unggul)
  address: string; // contoh: Jl. Ir. H. Juanda No. 93, Dago, Kecamatan Coblong
  city: string; // contoh: Kota Bandung, Jawa Barat 40135
  phone: string; // contoh: (022) 2503215
  email: string; // contoh: info@sman1bdg.sch.id
  website: string; // contoh: www.sman1bdg.sch.id
  logoLeft: string; // SVG or base64 data URL
  logoRight: string; // SVG or base64 data URL (optional, e.g. logo sekolah)
  headmasterName: string; // contoh: Drs. H. Dedi Suryadi, M.Pd.
  headmasterNip: string; // contoh: 19680315 199403 1 004
  headmasterRole: string; // contoh: Kepala SMA Negeri 1 Bandung
  signatureUrl: string; // base64 or empty
  stampColor: 'purple' | 'blue' | 'black';
  enableStamp: boolean;
  enableSignature: boolean;
  enableQr: boolean;
}

export interface StudentData {
  name: string;
  nis: string;
  nisn: string;
  className: string;
  birthPlaceDate: string; // contoh: Bandung, 14 Mei 2008
  gender: 'Laki-laki' | 'Perempuan';
  parentName: string;
  parentJob: string;
  address: string;
  purpose: string; // keperluan surat
}

export interface MeetingEventData {
  dayDate: string; // contoh: Sabtu, 15 November 2026
  time: string; // contoh: 08.30 WIB s.d. selesai
  place: string; // contoh: Aula Graha Bakti SMA Negeri 1 Bandung
  agenda: string; // contoh: Rapat Pleno Sosialisasi Asesmen Nasional & Program Akhir Tahun
  speaker: string; // contoh: Kepala Sekolah & Tim Komite
  notes: string; // contoh: Mengingat pentingnya kegiatan ini, dimohon hadir tepat waktu.
}

export interface ParticipantItem {
  id: string;
  name: string;
  role: string;
  idNumber: string; // NISN or NIP
  classOrUnit: string;
}

export interface ActivityData {
  activityName: string; // contoh: Olimpiade Sains Nasional (OSN) Tingkat Provinsi
  organizer: string; // contoh: Balai Pengembangan Talenta Indonesia (BPTI)
  dateRange: string; // contoh: 20 - 24 November 2026
  location: string; // contoh: Kampus Institut Teknologi Bandung
  participants: ParticipantItem[];
}

export interface ParentCallData {
  studentName: string;
  className: string;
  dayDate: string;
  time: string;
  meetWith: string; // contoh: Koordinator Guru Bimbingan dan Konseling (BK)
  room: string; // contoh: Ruang Bimbingan & Konseling
  reason: string; // contoh: Pembinaan perkembangan kedisiplinan belajar dan absensi siswa
}

export interface LetterDocument {
  id: string;
  createdAt: string;
  title: string;
  type: LetterType;
  letterNumber: string; // contoh: 421.3 / 184 / SMAN1 / X / 2026
  attachmentCount: string; // contoh: - atau 1 (Satu) Berkas
  subject: string; // contoh: Surat Keterangan Siswa Aktif
  letterDate: string; // contoh: 27 Oktober 2026
  placeCity: string; // contoh: Bandung
  recipientName: string; // contoh: Yth. Bapak/Ibu Pimpinan Bank BRI Cabang Bandung
  recipientLocation: string; // contoh: di Tempat

  // Isi surat terstruktur
  opening: string;
  mainParagraph: string;
  closing: string;

  // Data dinamis sesuai tipe
  student: StudentData;
  meeting: MeetingEventData;
  activity: ActivityData;
  parentCall: ParentCallData;

  // Kustom / Poin-poin tambahan
  customBulletPoints: string[];
  tembusan: string[];

  // Pengaturan Layout Dokumen
  paperSize: PaperSize;
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  marginSize: MarginSize;
  showKop: boolean;
  showDoubleLine: boolean;
}

export interface SavedLetterRecord {
  id: string;
  letterNumber: string;
  subject: string;
  type: LetterType;
  targetName: string;
  date: string;
  createdAt: string;
  document: LetterDocument;
}
