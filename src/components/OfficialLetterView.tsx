import React from 'react';
import { LetterDocument, SchoolProfile } from '../types/letter';

interface Props {
  document: LetterDocument;
  school: SchoolProfile;
  previewScale?: number;
}

export const OfficialLetterView: React.FC<Props> = ({
  document: doc,
  school,
  previewScale = 1,
}) => {
  // Tentukan apakah format memakai Judul Tengah (Surat Keterangan, SPT, SKKB, Rekomendasi, Mutasi)
  // atau format biasa dengan No/Lamp/Hal di kiri (Undangan, Panggilan, Dispensasi, Kustom)
  const isCenteredTitleFormat = [
    'keterangan_aktif',
    'kelakuan_baik',
    'surat_tugas',
    'rekomendasi',
    'keterangan_pindah',
  ].includes(doc.type);

  // Styling sesuai pengaturan dokumen
  const fontClass = doc.fontFamily === 'serif' ? 'font-document-serif' : 'font-document-sans';

  // Ukuran kertas dalam mm dan px perkiraan
  // A4: 210mm x 297mm (~794px x 1123px @96dpi)
  // F4: 215mm x 330mm (~813px x 1247px @96dpi)
  let minHeightStyle = '297mm';
  let widthStyle = '210mm';

  if (doc.paperSize === 'F4') {
    widthStyle = '215mm';
    minHeightStyle = '330mm';
  } else if (doc.paperSize === 'Letter') {
    widthStyle = '215.9mm';
    minHeightStyle = '279.4mm';
  }

  // Padding margin standar surat resmi
  let marginPadding = 'p-8 md:p-10'; // Kompak & proporsional
  if (doc.marginSize === 'compact') {
    marginPadding = 'p-6 md:p-8';
  } else if (doc.marginSize === 'wide') {
    marginPadding = 'p-10 md:p-12';
  }

  // Font size baku (standar 11-12pt)
  let textSize = 'text-[12.5px] leading-[1.55]';
  if (doc.fontSize === 'sm') textSize = 'text-[11.5px] leading-[1.45]';
  if (doc.fontSize === 'lg') textSize = 'text-[13.5px] leading-[1.65]';

  // Warna stempel
  const stampColorClass =
    school.stampColor === 'blue'
      ? 'border-blue-600 text-blue-700'
      : school.stampColor === 'black'
      ? 'border-slate-800 text-slate-800'
      : 'border-purple-700 text-purple-800';

  return (
    <div
      id="printable-letter"
      className={`bg-white text-slate-900 mx-auto shadow-lg transition-all duration-200 ${fontClass} ${marginPadding} relative flex flex-col justify-between`}
      style={{
        width: widthStyle,
        minHeight: minHeightStyle,
        boxSizing: 'border-box',
        transform: previewScale !== 1 ? `scale(${previewScale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      <div>
        {/* KOP SURAT RESMI */}
        {doc.showKop && (
          <header className="mb-4">
            <div className="flex items-center justify-between gap-3">
              {/* Logo Kiri (Pemda / Kemdikbud) */}
              <div className="w-[68px] h-[68px] flex items-center justify-center shrink-0">
                {school.logoLeft ? (
                  <img
                    src={school.logoLeft}
                    alt="Logo Kiri"
                    className="max-h-[68px] max-w-[68px] object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400">
                    Logo
                  </div>
                )}
              </div>

              {/* Teks Identitas Sekolah */}
              <div className="flex-1 text-center px-1">
                <h3 className="font-bold text-[11.5px] tracking-wide uppercase leading-tight text-slate-900">
                  {school.govHeader}
                </h3>
                {school.subHeader && (
                  <h4 className="font-bold text-[10.5px] tracking-wide uppercase leading-tight text-slate-800 mt-0.5">
                    {school.subHeader}
                  </h4>
                )}
                <h2 className="font-bold text-[15.5px] tracking-wider uppercase leading-snug text-slate-950 mt-0.5">
                  {school.name}
                </h2>
                <p className="text-[10px] leading-tight text-slate-800 mt-0.5 font-medium">
                  NPSN: {school.npsn} {school.akreditasi ? `· ${school.akreditasi}` : ''}
                </p>
                <p className="text-[10px] leading-tight text-slate-700 mt-0.5">
                  {school.address}, {school.city}
                </p>
                <p className="text-[9.5px] leading-tight text-slate-600 mt-0.5">
                  Telepon: {school.phone} · Email: {school.email} · Web: {school.website}
                </p>
              </div>

              {/* Logo Kanan (Logo Sekolah / Tut Wuri) */}
              <div className="w-[68px] h-[68px] flex items-center justify-center shrink-0">
                {school.logoRight ? (
                  <img
                    src={school.logoRight}
                    alt="Logo Kanan"
                    className="max-h-[68px] max-w-[68px] object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-[68px] h-[68px]" />
                )}
              </div>
            </div>

            {/* Garis Ganda Kop Surat Dinas */}
            {doc.showDoubleLine && (
              <div className="mt-2.5 kop-border-double w-full pb-0.5" />
            )}
          </header>
        )}

        {/* FORMAT DOKUMEN: JUDUL TENGAH (SURAT KETERANGAN) ATAU KIRI (SURAT DINAS REGULER) */}
        {isCenteredTitleFormat ? (
          /* Format Judul Tengah */
          <div className="text-center my-5">
            <h1 className="font-bold text-base md:text-lg uppercase tracking-wide underline underline-offset-4 decoration-2">
              {doc.subject || doc.title}
            </h1>
            <p className="text-[13px] mt-1 font-medium text-slate-800">
              Nomor: {doc.letterNumber}
            </p>
          </div>
        ) : (
          /* Format Surat Dinas Biasa (Nomor, Lampiran, Hal di Kiri, Tanggal di Kanan) */
          <div className="my-4">
            <div className="flex justify-between items-start mb-3">
              <table className="text-[13px] border-collapse">
                <tbody>
                  <tr>
                    <td className="pr-4 py-0.5 font-medium w-20">Nomor</td>
                    <td className="pr-2 py-0.5">:</td>
                    <td className="py-0.5 font-medium">{doc.letterNumber}</td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-0.5 font-medium">Lampiran</td>
                    <td className="pr-2 py-0.5">:</td>
                    <td className="py-0.5">{doc.attachmentCount || '-'}</td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-0.5 font-medium">Hal</td>
                    <td className="pr-2 py-0.5">:</td>
                    <td className="py-0.5 font-bold">{doc.subject}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-right text-[13px]">
                <p>
                  {doc.placeCity}, {doc.letterDate}
                </p>
              </div>
            </div>

            {/* Kepada Yth. */}
            <div className="mt-4 mb-4 text-[13px] leading-relaxed">
              <p>Kepada Yth.</p>
              <p className="font-bold">{doc.recipientName}</p>
              <p>{doc.recipientLocation}</p>
            </div>
          </div>
        )}

        {/* BODY TEKS SURAT */}
        <div className={`${textSize} text-slate-900 space-y-3.5`}>
          {/* Paragraf Pembuka */}
          {doc.opening && (
            <p className="text-justify leading-relaxed whitespace-pre-line indent-8">
              {doc.opening}
            </p>
          )}

          {/* TABEL DATA SISWA (Untuk Surat Keterangan / SKKB / Mutasi / Rekomendasi) */}
          {(doc.type === 'keterangan_aktif' ||
            doc.type === 'kelakuan_baik' ||
            doc.type === 'rekomendasi' ||
            doc.type === 'keterangan_pindah') && (
            <div className="my-3 pl-6 pr-2">
              <table className="w-full text-[13.5px] border-collapse leading-normal">
                <tbody>
                  <tr>
                    <td className="py-1 w-44 font-medium">Nama Lengkap</td>
                    <td className="py-1 w-4 text-center">:</td>
                    <td className="py-1 font-bold tracking-wide uppercase">{doc.student.name}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Nomor Induk Siswa (NIS)</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1 tabular-nums">{doc.student.nis}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">NISN</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1 tabular-nums">{doc.student.nisn}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Kelas / Tingkat</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{doc.student.className}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Tempat, Tanggal Lahir</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{doc.student.birthPlaceDate}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Jenis Kelamin</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{doc.student.gender}</td>
                  </tr>
                  {doc.student.parentName && (
                    <tr>
                      <td className="py-1 font-medium">Nama Orang Tua / Wali</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">{doc.student.parentName}</td>
                    </tr>
                  )}
                  {doc.student.parentJob && (
                    <tr>
                      <td className="py-1 font-medium">Pekerjaan Orang Tua</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1">{doc.student.parentJob}</td>
                    </tr>
                  )}
                  {doc.student.address && (
                    <tr>
                      <td className="py-1 font-medium align-top">Alamat Rumah</td>
                      <td className="py-1 text-center align-top">:</td>
                      <td className="py-1">{doc.student.address}</td>
                    </tr>
                  )}
                  {doc.student.purpose && (
                    <tr>
                      <td className="py-1 font-medium align-top">Keperluan</td>
                      <td className="py-1 text-center align-top">:</td>
                      <td className="py-1 italic font-medium">{doc.student.purpose}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TABEL RINCIAN RAPAT / UNDANGAN */}
          {doc.type === 'undangan_ortu' && (
            <div className="my-3 pl-6 pr-2">
              <table className="w-full text-[13.5px] border-collapse leading-normal">
                <tbody>
                  <tr>
                    <td className="py-1 w-36 font-medium">Hari, Tanggal</td>
                    <td className="py-1 w-4 text-center">:</td>
                    <td className="py-1 font-bold">{doc.meeting.dayDate}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Waktu</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1 font-medium">{doc.meeting.time}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Tempat</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{doc.meeting.place}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium align-top">Acara / Agenda</td>
                    <td className="py-1 text-center align-top">:</td>
                    <td className="py-1 font-semibold">{doc.meeting.agenda}</td>
                  </tr>
                  {doc.meeting.notes && (
                    <tr>
                      <td className="py-1 font-medium align-top">Catatan</td>
                      <td className="py-1 text-center align-top">:</td>
                      <td className="py-1 italic text-slate-800">{doc.meeting.notes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TABEL PANGGILAN ORANG TUA */}
          {doc.type === 'panggilan_ortu' && (
            <div className="my-3 pl-6 pr-2">
              <table className="w-full text-[13.5px] border-collapse leading-normal">
                <tbody>
                  <tr>
                    <td className="py-1 w-40 font-medium">Nama Siswa</td>
                    <td className="py-1 w-4 text-center">:</td>
                    <td className="py-1 font-bold uppercase">{doc.parentCall.studentName}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Kelas</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1 font-medium">{doc.parentCall.className}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Hari, Tanggal</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1 font-bold">{doc.parentCall.dayDate}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Waktu / Pukul</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{doc.parentCall.time}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Menghadap Kepada</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1 font-semibold">{doc.parentCall.meetWith}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Bertempat di</td>
                    <td className="py-1 text-center">:</td>
                    <td className="py-1">{doc.parentCall.room}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium align-top">Perihal Konsultasi</td>
                    <td className="py-1 text-center align-top">:</td>
                    <td className="py-1 italic">{doc.parentCall.reason}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* RINCIAN KEGIATAN & TABEL PESERTA (Untuk Dispensasi Lomba atau Surat Tugas) */}
          {(doc.type === 'dispensasi_lomba' || doc.type === 'surat_tugas') && (
            <div className="my-3 space-y-3">
              {/* Info Acara */}
              <div className="pl-6 pr-2">
                <table className="w-full text-[13px] border-collapse leading-normal">
                  <tbody>
                    <tr>
                      <td className="py-0.5 w-36 font-medium">Nama Kegiatan</td>
                      <td className="py-0.5 w-4 text-center">:</td>
                      <td className="py-0.5 font-bold">{doc.activity.activityName}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">Penyelenggara</td>
                      <td className="py-0.5 text-center">:</td>
                      <td className="py-0.5">{doc.activity.organizer}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">Waktu Pelaksanaan</td>
                      <td className="py-0.5 text-center">:</td>
                      <td className="py-0.5 font-medium">{doc.activity.dateRange}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">Tempat Kegiatan</td>
                      <td className="py-0.5 text-center">:</td>
                      <td className="py-0.5">{doc.activity.location}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tabel Peserta */}
              {doc.activity.participants && doc.activity.participants.length > 0 && (
                <div className="my-2">
                  <p className="text-xs font-semibold mb-1.5 uppercase text-slate-800">
                    Daftar Nama yang Ditugaskan / Diberikan Dispensasi:
                  </p>
                  <table className="w-full text-xs border border-slate-700 border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-700 px-2 py-1 text-center w-8">No</th>
                        <th className="border border-slate-700 px-2 py-1 text-left">Nama Lengkap</th>
                        <th className="border border-slate-700 px-2 py-1 text-center w-36">NISN / NIP</th>
                        <th className="border border-slate-700 px-2 py-1 text-center w-28">Kelas / Unit</th>
                        <th className="border border-slate-700 px-2 py-1 text-left">Keterangan / Peran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.activity.participants.map((p, idx) => (
                        <tr key={p.id || idx}>
                          <td className="border border-slate-700 px-2 py-1 text-center tabular-nums">{idx + 1}</td>
                          <td className="border border-slate-700 px-2 py-1 font-semibold">{p.name}</td>
                          <td className="border border-slate-700 px-2 py-1 text-center tabular-nums">{p.idNumber}</td>
                          <td className="border border-slate-700 px-2 py-1 text-center">{p.classOrUnit}</td>
                          <td className="border border-slate-700 px-2 py-1">{p.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Paragraf Utama */}
          {doc.mainParagraph && (
            <p className="text-justify leading-relaxed whitespace-pre-line indent-8">
              {doc.mainParagraph}
            </p>
          )}

          {/* Poin-poin Tambahan jika ada */}
          {doc.customBulletPoints && doc.customBulletPoints.length > 0 && (
            <ol className="list-decimal list-outside pl-10 space-y-1 text-justify">
              {doc.customBulletPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ol>
          )}

          {/* Paragraf Penutup */}
          {doc.closing && (
            <p className="text-justify leading-relaxed whitespace-pre-line indent-8">
              {doc.closing}
            </p>
          )}
        </div>
      </div>

      {/* FOOTER & BLOK TANDA TANGAN RESMI */}
      <div className="mt-8 pt-4">
        <div className="flex justify-between items-end">
          {/* Sisi Kiri: Tembusan & QR Code Keabsahan Dokumen */}
          <div className="text-xs text-slate-700 max-w-xs space-y-2">
            {school.enableQr && (
              <div className="flex items-center gap-2.5 p-1.5 border border-slate-300 rounded bg-slate-50/50 w-fit">
                {/* Visual QR Code Generator */}
                <div className="w-12 h-12 bg-white border border-slate-400 p-0.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 border-2 border-black flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-black" />
                    </div>
                    <div className="w-3.5 h-3.5 border-2 border-black flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-black" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-0.5">
                    <div className="w-1 h-1 bg-black" />
                    <div className="w-1.5 h-1 bg-black" />
                    <div className="w-1 h-1 bg-black" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 border-2 border-black flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-black" />
                    </div>
                    <div className="w-1.5 h-1.5 bg-black" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">
                    DOKUMEN RESMI
                  </p>
                  <p className="text-[9px] text-slate-600 leading-tight">
                    Tervalidasi Digital
                  </p>
                  <p className="text-[8px] font-mono text-slate-500 tabular-nums">
                    {doc.letterNumber.split('/')[1] || 'DOC'}-{Date.now().toString().slice(-4)}
                  </p>
                </div>
              </div>
            )}

            {/* Tembusan Surat */}
            {doc.tembusan && doc.tembusan.length > 0 && (
              <div className="text-[11px] text-slate-800">
                <p className="font-semibold underline">Tembusan:</p>
                <ol className="list-decimal list-outside pl-4 space-y-0.5 text-[10px]">
                  {doc.tembusan.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Tanda Tangan Kepala Sekolah & Stempel */}
          <div className="text-center w-64 relative text-[13px]">
            {/* Tempat dan Tanggal jika format judul tengah */}
            {isCenteredTitleFormat && (
              <p className="mb-1 text-slate-800">
                {doc.placeCity}, {doc.letterDate}
              </p>
            )}
            <p className="font-semibold text-slate-900 leading-snug">
              {school.headmasterRole},
            </p>

            {/* Area Ruang Tanda Tangan dan Stempel */}
            <div className="h-16 my-1 relative flex items-center justify-center">
              {/* Tanda Tangan Digital jika ada */}
              {school.enableSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  {school.signatureUrl ? (
                    <img
                      src={school.signatureUrl}
                      alt="Tanda Tangan"
                      className="max-h-16 max-w-36 object-contain filter contrast-125"
                    />
                  ) : (
                    /* Default Elegant Calligraphy Signature simulation */
                    <svg
                      viewBox="0 0 200 80"
                      className="w-32 h-14 text-blue-950 opacity-90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20,55 C40,20 60,10 75,30 C90,50 85,75 110,40 C135,5 150,60 170,35 C180,20 190,45 160,65 C130,80 80,70 60,65" />
                      <path d="M45,45 C80,48 120,42 165,48" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
              )}

              {/* STEMPEL RESMI SEKOLAH OTOMATIS */}
              {school.enableStamp && (
                <div
                  className={`absolute -left-4 top-0 w-[74px] h-[74px] rounded-full border-[1.8px] ${stampColorClass} flex items-center justify-center pointer-events-none opacity-85 rotate-[-12deg] z-0 select-none shadow-xs`}
                >
                  {/* Lingkaran dalam putus-putus */}
                  <div className="w-[66px] h-[66px] rounded-full border border-dashed border-current flex flex-col items-center justify-between p-0.5 text-center">
                    <span className="text-[5.5px] font-bold uppercase tracking-tight max-w-[56px] truncate leading-tight mt-0.5">
                      {school.name}
                    </span>
                    <div className="flex items-center gap-0.5 my-auto">
                      <span className="text-[7px]">★</span>
                      <span className="text-[6px] font-black uppercase tracking-wider">RESMI</span>
                      <span className="text-[7px]">★</span>
                    </div>
                    <span className="text-[5px] font-bold uppercase tracking-tight max-w-[56px] truncate leading-tight mb-0.5">
                      DINAS PENDIDIKAN
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Nama & NIP Kepala Sekolah */}
            <p className="font-bold underline text-slate-950 underline-offset-2">
              {school.headmasterName}
            </p>
            <p className="text-[12px] text-slate-700 font-medium tabular-nums mt-0.5">
              NIP. {school.headmasterNip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
