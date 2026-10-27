import { LetterDocument, LetterType, SchoolProfile } from '../types/letter';
import { LOGO_PEMDA_PROVINSI, LOGO_TUT_WURI_HANDAYANI } from './defaultLogos';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  govHeader: 'PEMERINTAH DAERAH PROVINSI JAWA BARAT',
  subHeader: 'DINAS PENDIDIKAN - CABANG DINAS PENDIDIKAN WILAYAH VII',
  name: 'SMA NEGERI 1 KOTA BANDUNG',
  npsn: '20219876',
  akreditasi: 'Terakreditasi "A" (Unggul)',
  address: 'Jl. Ir. H. Juanda No. 93, Dago, Kecamatan Coblong',
  city: 'Kota Bandung, Jawa Barat 40135',
  phone: '(022) 2503215',
  email: 'surat@sman1bdg.sch.id',
  website: 'www.sman1bdg.sch.id',
  logoLeft: LOGO_PEMDA_PROVINSI,
  logoRight: LOGO_TUT_WURI_HANDAYANI,
  headmasterName: 'Drs. H. Dedi Suryadi, M.Pd.',
  headmasterNip: '19680315 199403 1 004',
  headmasterRole: 'Kepala Sekolah',
  signatureUrl: '',
  stampColor: 'purple',
  enableStamp: true,
  enableSignature: true,
  enableQr: true,
};

export interface LetterTypeMeta {
  type: LetterType;
  title: string;
  badge: string;
  description: string;
  defaultSubject: string;
  codePrefix: string;
}

export const LETTER_TYPES_META: LetterTypeMeta[] = [
  {
    type: 'keterangan_aktif',
    title: 'Surat Keterangan Aktif Siswa',
    badge: 'Paling Sering',
    description: 'Untuk keperluan beasiswa, tunjangan gaji orang tua, visa, dan bank.',
    defaultSubject: 'SURAT KETERANGAN AKTIF BELAJAR',
    codePrefix: '421.3 / AKT',
  },
  {
    type: 'undangan_ortu',
    title: 'Surat Undangan Orang Tua / Wali',
    badge: 'Rapat & Sosialisasi',
    description: 'Undangan rapat pleno, pembagian rapor, komite, atau sosialisasi ujian.',
    defaultSubject: 'Undangan Rapat Pleno Orang Tua/Wali Murid',
    codePrefix: '421.3 / UND',
  },
  {
    type: 'dispensasi_lomba',
    title: 'Surat Dispensasi / Izin Kegiatan',
    badge: 'Prestasi & Lomba',
    description: 'Permohonan dispensasi siswa mengikuti OSN, O2SN, turnamen olahraga, dsb.',
    defaultSubject: 'Permohonan Dispensasi Mengikuti Kegiatan',
    codePrefix: '421.3 / DISP',
  },
  {
    type: 'kelakuan_baik',
    title: 'Surat Ket. Kelakuan Baik (SKKB)',
    badge: 'Alumni & Siswa',
    description: 'Keterangan tidak pernah melanggar tata tertib untuk melamar / daftar kuliah.',
    defaultSubject: 'SURAT KETERANGAN KELAKUAN BAIK',
    codePrefix: '421.3 / SKKB',
  },
  {
    type: 'panggilan_ortu',
    title: 'Surat Panggilan Orang Tua',
    badge: 'Bimbingan Konseling',
    description: 'Surat resmi memanggil orang tua/wali siswa menghadap Guru BK / Wali Kelas.',
    defaultSubject: 'Panggilan Orang Tua / Wali Siswa',
    codePrefix: '421.3 / BK',
  },
  {
    type: 'surat_tugas',
    title: 'Surat Perintah Tugas Guru / Staf',
    badge: 'Dinas Pegawai',
    description: 'Penugasan guru untuk mengikuti workshop, diklat, juri, atau pengawas ujian.',
    defaultSubject: 'SURAT PERINTAH TUGAS',
    codePrefix: '800 / SPT',
  },
  {
    type: 'rekomendasi',
    title: 'Surat Rekomendasi Siswa',
    badge: 'Beasiswa & Lomba',
    description: 'Rekomendasi kepala sekolah untuk seleksi beasiswa atau perguruan tinggi.',
    defaultSubject: 'SURAT REKOMENDASI',
    codePrefix: '421.3 / REK',
  },
  {
    type: 'keterangan_pindah',
    title: 'Surat Keterangan Pindah Sekolah',
    badge: 'Mutasi Siswa',
    description: 'Surat keterangan kelolosan/pelepasan mutasi siswa ke sekolah tujuan.',
    defaultSubject: 'SURAT KETERANGAN PINDAH SEKOLAH',
    codePrefix: '421.3 / MUT',
  },
  {
    type: 'kustom',
    title: 'Surat Dinas Kustom Bebas',
    badge: 'Fleksibel',
    description: 'Format surat dinas bebas serbaguna dengan susunan paragraf fleksibel.',
    defaultSubject: 'Pemberitahuan Kegiatan Satuan Pendidikan',
    codePrefix: '421.3 / DIN',
  },
];

export function getInitialLetterData(type: LetterType = 'keterangan_aktif'): LetterDocument {
  const today = new Date();
  const monthsIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  
  const formattedDate = `${today.getDate()} ${monthsIndo[today.getMonth()]} ${today.getFullYear()}`;
  const romanMonth = romanMonths[today.getMonth()];
  const year = today.getFullYear();

  const base: LetterDocument = {
    id: `doc_${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: 'Surat Dinas Sekolah',
    type,
    letterNumber: `421.3 / 108 / SMAN1 / ${romanMonth} / ${year}`,
    attachmentCount: '-',
    subject: 'Surat Keterangan',
    letterDate: formattedDate,
    placeCity: 'Bandung',
    recipientName: 'Yth. Pimpinan Instansi / Bapak/Ibu Wali Murid',
    recipientLocation: 'di Tempat',

    opening: 'Yang bertanda tangan di bawah ini, Kepala SMA Negeri 1 Kota Bandung menerangkan bahwa:',
    mainParagraph: 'Adalah benar yang bersangkutan merupakan siswa aktif yang terdaftar secara sah pada Tahun Ajaran 2026/2027.',
    closing: 'Demikian surat keterangan ini kami terbitkan dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.',

    student: {
      name: 'Muhammad Farhan Pratama',
      nis: '232410045',
      nisn: '0087654321',
      className: 'XII MIPA 1',
      birthPlaceDate: 'Bandung, 18 Mei 2008',
      gender: 'Laki-laki',
      parentName: 'H. Bambang Irawan, S.E.',
      parentJob: 'Pegawai Negeri Sipil (PNS)',
      address: 'Jl. Dago Asri No. 12, RT 03/RW 09, Coblong, Kota Bandung',
      purpose: 'Persyaratan Pengajuan Beasiswa Prestasi dan Tunjangan Pendidikan Anak',
    },

    meeting: {
      dayDate: 'Sabtu, 15 November 2026',
      time: '08.30 s.d. 11.30 WIB',
      place: 'Aula Graha Cendekia SMA Negeri 1 Bandung',
      agenda: 'Rapat Pleno Program Pembelajaran Semester Genap & Sosialisasi SNBP',
      speaker: 'Kepala Sekolah & Tim Bimbingan Konseling',
      notes: 'Mengingat pentingnya agenda tersebut, dimohon Bapak/Ibu orang tua/wali hadir tepat waktu tanpa diwakilkan.',
    },

    activity: {
      activityName: 'Olimpiade Sains Nasional (OSN) Tingkat Provinsi Jawa Barat',
      organizer: 'Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek',
      dateRange: '18 s.d. 22 November 2026',
      location: 'Gedung Sasana Budaya Ganesha (Sabuga), Bandung',
      participants: [
        {
          id: '1',
          name: 'Muhammad Farhan Pratama',
          role: 'Peserta Cabang Matematika',
          idNumber: '0087654321',
          classOrUnit: 'XII MIPA 1',
        },
        {
          id: '2',
          name: 'Annisa Rahmadani',
          role: 'Peserta Cabang Biologi',
          idNumber: '0089234112',
          classOrUnit: 'XI MIPA 3',
        },
        {
          id: '3',
          name: 'Dra. Hj. Siti Rohmah, M.Si.',
          role: 'Guru Pendamping / Pembimbing',
          idNumber: '19740812 200003 2 003',
          classOrUnit: 'Guru Biologi',
        },
      ],
    },

    parentCall: {
      studentName: 'Rian Hidayat',
      className: 'XI IPS 2',
      dayDate: 'Kamis, 5 November 2026',
      time: '09.00 WIB',
      meetWith: 'Koordinator Bimbingan dan Konseling (BK)',
      room: 'Ruang Layanan Bimbingan & Konseling Lt. 2',
      reason: 'Konsultasi berkala terkait kehadiran belajar dan penguatan motivasi akademik siswa.',
    },

    customBulletPoints: [
      'Mematuhi seluruh tata tertib dan protokol keselamatan selama kegiatan berlangsung.',
      'Melaporkan hasil pelaksanaan kegiatan kepada Kepala Sekolah selambat-lambatnya 3 hari setelah selesai.',
    ],
    tembusan: [
      'Kepala Cabang Dinas Pendidikan Wilayah VII',
      'Pengawas Pembina Sekolah',
      'Arsip Tata Usaha',
    ],

    paperSize: 'A4',
    fontFamily: 'serif',
    fontSize: 'base',
    lineSpacing: 'normal',
    marginSize: 'standard',
    showKop: true,
    showDoubleLine: true,
  };

  // Sesuaikan data awal berdasarkan tipe
  switch (type) {
    case 'keterangan_aktif':
      base.title = 'Surat Keterangan Aktif Siswa';
      base.subject = 'SURAT KETERANGAN AKTIF BELAJAR';
      base.letterNumber = `421.3 / 098 / SMAN1 / ${romanMonth} / ${year}`;
      base.opening = 'Yang bertanda tangan di bawah ini, Kepala SMA Negeri 1 Kota Bandung menerangkan dengan sebenarnya bahwa:';
      base.mainParagraph = 'Adalah benar nama tersebut di atas terdaftar sebagai siswa aktif pada SMA Negeri 1 Kota Bandung Tahun Ajaran 2026/2027 dan memiliki kelakuan baik.';
      base.closing = 'Demikian surat keterangan ini kami buat dengan sebenarnya untuk dipergunakan sebagai kelengkapan administrasi yang dipersyaratkan.';
      break;

    case 'undangan_ortu':
      base.title = 'Surat Undangan Wali Murid';
      base.subject = 'Undangan Rapat Pleno Orang Tua/Wali Murid';
      base.letterNumber = `421.3 / 142 / SMAN1 / ${romanMonth} / ${year}`;
      base.recipientName = 'Yth. Bapak / Ibu Orang Tua / Wali Siswa Kelas X, XI, dan XII';
      base.recipientLocation = 'di Tempat';
      base.opening = 'Dengan hormat, dalam rangka meningkatkan koordinasi mutu pendidikan dan sosialisasi program sekolah semester berjalan, kami mengundang Bapak/Ibu untuk hadir pada:';
      base.mainParagraph = '';
      base.closing = 'Demikian undangan ini kami sampaikan. Mengingat pentingnya musyawarah ini, kehadiran Bapak/Ibu tepat pada waktunya sangat kami harapkan. Atas perhatian dan kerja samanya diucapkan terima kasih.';
      break;

    case 'dispensasi_lomba':
      base.title = 'Surat Permohonan Dispensasi';
      base.subject = 'Permohonan Dispensasi Mengikuti Lomba';
      base.letterNumber = `421.3 / 215 / SMAN1 / ${romanMonth} / ${year}`;
      base.recipientName = 'Yth. Bapak/Ibu Dewan Guru Pengajar SMA Negeri 1 Bandung';
      base.recipientLocation = 'di Tempat';
      base.opening = 'Dengan hormat, sehubungan dengan keikutsertaan kontingen sekolah dalam ajang bergengsi di tingkat provinsi, dengan ini kami memberikan dispensasi tidak mengikuti proses pembelajaran kepada:';
      base.mainParagraph = 'Untuk mengikuti rangkaian kegiatan yang diselenggarakan pada:';
      base.closing = 'Demikian surat dispensasi ini diberikan agar siswa yang bersangkutan dapat melaksanakan tugas dengan sebaik-baiknya dan para guru dapat memberikan pemakluman serta tugas susulan.';
      break;

    case 'kelakuan_baik':
      base.title = 'Surat Ket. Kelakuan Baik';
      base.subject = 'SURAT KETERANGAN KELAKUAN BAIK';
      base.letterNumber = `421.3 / 112 / SMAN1 / ${romanMonth} / ${year}`;
      base.opening = 'Kepala SMA Negeri 1 Kota Bandung dengan ini menerangkan dengan sesungguhnya bahwa:';
      base.mainParagraph = 'Berdasarkan catatan kesiswaan dan bimbingan konseling kami, selama menjadi peserta didik di sekolah ini yang bersangkutan selalu berkelakuan baik, patuh terhadap tata tertib sekolah, serta tidak pernah terlibat dalam tindakan kriminalitas, penyalahgunaan narkoba, tawuran, maupun tindakan asusila.';
      base.closing = 'Surat keterangan ini diberikan atas permintaan yang bersangkutan sebagai persyaratan pendaftaran seleksi masuk perguruan tinggi / kedinasan.';
      break;

    case 'panggilan_ortu':
      base.title = 'Surat Panggilan Orang Tua';
      base.subject = 'Panggilan Orang Tua / Wali Siswa';
      base.letterNumber = `421.3 / 067 / BK-SMAN1 / ${romanMonth} / ${year}`;
      base.recipientName = 'Yth. Orang Tua / Wali dari Siswa: Rian Hidayat (Kelas XI IPS 2)';
      base.recipientLocation = 'di Tempat';
      base.opening = 'Dengan hormat, salam silaturahmi kami sampaikan semoga Bapak/Ibu senantiasa dalam lindungan Tuhan Yang Maha Esa. Sehubungan dengan perkembangan belajar putra/putri Bapak/Ibu di sekolah, kami mengharapkan kehadiran Bapak/Ibu pada:';
      base.mainParagraph = '';
      base.closing = 'Besar harapan kami atas kehadiran Bapak/Ibu tepat pada waktunya demi kelancaran dan kemajuan proses pendidikan putra/putri kita bersama. Atas kerja samanya kami ucapkan terima kasih.';
      break;

    case 'surat_tugas':
      base.title = 'Surat Perintah Tugas';
      base.subject = 'SURAT PERINTAH TUGAS (SPT)';
      base.letterNumber = `800 / 089 / SMAN1 / SPT / ${romanMonth} / ${year}`;
      base.opening = 'Dasar: Surat Undangan Kepala Dinas Pendidikan Provinsi Jawa Barat Nomor: 420/5541-Disdik tanggal 20 Oktober 2026 perihal Pelatihan Peningkatan Kompetensi Guru.\n\nKEPALA SMA NEGERI 1 KOTA BANDUNG MEMBERIKAN TUGAS KEPADA:';
      base.mainParagraph = 'Untuk melaksanakan tugas kedinasan sebagai peserta pada agenda kegiatan berikut:';
      base.closing = 'Demikian Surat Perintah Tugas ini diberikan kepada yang bersangkutan untuk dilaksanakan dengan penuh rasa tanggung jawab dan membuat laporan tertulis setelah pelaksanaan tugas selesai.';
      break;

    case 'rekomendasi':
      base.title = 'Surat Rekomendasi';
      base.subject = 'SURAT REKOMENDASI KEPALA SEKOLAH';
      base.letterNumber = `421.3 / 221 / SMAN1 / REK / ${romanMonth} / ${year}`;
      base.recipientName = 'Yth. Tim Seleksi Beasiswa Unggulan Pendidikan Tinggi';
      base.recipientLocation = 'di Jakarta';
      base.opening = 'Yang bertanda tangan di bawah ini Kepala SMA Negeri 1 Kota Bandung memberikan rekomendasi penuh kepada:';
      base.mainParagraph = 'Berdasarkan rekam jejak akademik yang konsisten berperingkat 5 besar, dedikasi tinggi dalam organisasi, serta integritas moral yang teruji, kami merekomendasikan siswa tersebut sebagai kandidat yang sangat layak untuk menerima program beasiswa.';
      base.closing = 'Demikian surat rekomendasi ini dibuat dengan sebenar-benarnya tanpa ada paksaan dari pihak mana pun untuk digunakan sebagaimana mestinya.';
      break;

    case 'keterangan_pindah':
      base.title = 'Surat Keterangan Pindah';
      base.subject = 'SURAT KETERANGAN PINDAH SEKOLAH';
      base.letterNumber = `421.3 / 034 / SMAN1 / MUT / ${romanMonth} / ${year}`;
      base.opening = 'Kepala SMA Negeri 1 Kota Bandung menerangkan bahwa atas permohonan tertulis dari orang tua/wali siswa tertanggal 24 Oktober 2026:';
      base.mainParagraph = 'Telah mengajukan pindah sekolah ke: SMA Negeri 3 Surabaya, Provinsi Jawa Timur, dengan alasan mengikuti perpindahan tugas kedinasan orang tua.\n\nBersama ini kami lampirkan buku laporan pendidikan (Rapor Asli) dan berkas administrasi mutasi yang bersangkutan.';
      base.closing = 'Demikian surat keterangan pindah sekolah ini kami berikan untuk dipergunakan sebagaimana mestinya.';
      break;

    case 'kustom':
    default:
      base.title = 'Surat Pemberitahuan';
      base.subject = 'Pemberitahuan Kegiatan Akhir Semester Ganjil';
      base.letterNumber = `421.3 / 312 / SMAN1 / ${romanMonth} / ${year}`;
      base.recipientName = 'Yth. Bapak/Ibu Orang Tua / Wali Siswa';
      base.recipientLocation = 'di Tempat';
      base.opening = 'Dengan hormat, kami beritahukan bahwa dalam rangka mengakhiri kegiatan belajar mengajar Semester Ganjil Tahun Ajaran 2026/2027, pihak sekolah akan menyelenggarakan beberapa agenda penting.';
      base.mainParagraph = 'Sehubungan dengan hal tersebut, seluruh siswa diharapkan mempersiapkan diri secara maksimal dan menyelesaikan seluruh tugas portofolio sebelum tanggal pembagian rapor.';
      base.closing = 'Demikian surat pemberitahuan ini kami sampaikan, atas perhatian dan dukungan Bapak/Ibu kami sampaikan terima kasih.';
      break;
  }

  return base;
}
