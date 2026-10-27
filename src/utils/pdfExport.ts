import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { LetterDocument, SchoolProfile } from '../types/letter';

export async function downloadLetterAsPdf(
  elementId: string,
  filename: string,
  paperSize: 'A4' | 'F4' | 'Letter' = 'A4'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemen dengan id ${elementId} tidak ditemukan`);
    return false;
  }

  // Simpan style transform & shadow sebelum render
  const originalTransform = element.style.transform;
  const originalBoxShadow = element.style.boxShadow;
  const originalTransition = element.style.transition;

  try {
    // Nonaktifkan animasi, zoom transform, dan bayangan agar capture 100% presisi ukuran kertas asli
    element.style.transition = 'none';
    element.style.transform = 'none';
    element.style.boxShadow = 'none';

    // Beri waktu browser menyelesaikan reflow DOM
    await new Promise((r) => setTimeout(r, 60));

    // Dimensi kertas dalam mm
    let widthMm = 210;
    let heightMm = 297;

    if (paperSize === 'F4') {
      widthMm = 215;
      heightMm = 330;
    } else if (paperSize === 'Letter') {
      widthMm = 215.9;
      heightMm = 279.4;
    }

    // Capture resolusi optimal & tajam tanpa membuat file berukuran raksasa
    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolusi standar (~200 DPI), sangat tajam dan ukuran file ramah (hanya ~300KB)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.margin = '0 auto';
        }
      },
    });

    // Kualitas 88% mempertahankan kejernihan teks dengan ukuran file jauh lebih ringkas
    const imgData = canvas.toDataURL('image/jpeg', 0.88);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: paperSize === 'F4' ? [215, 330] : (paperSize.toLowerCase() as any),
      compress: true,
    });

    // Hitung dimensi proporsional agar surat tidak terdistorsi atau membesar berlebihan
    const imgWidth = widthMm;
    const imgHeight = (canvas.height * widthMm) / canvas.width;

    if (imgHeight > heightMm) {
      // Skalakan proporsional agar seluruh surat pas 1 lembar utuh tanpa membesar
      const scaleFactor = heightMm / imgHeight;
      const fitW = widthMm * scaleFactor;
      const fitH = heightMm;
      const offsetX = (widthMm - fitW) / 2;
      pdf.addImage(imgData, 'JPEG', offsetX, 0, fitW, fitH, undefined, 'FAST');
    } else {
      // Letakkan proporsional alami dari atas lembar kertas
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    }

    const safeName = (filename || 'Surat_Sekolah').replace(/[^a-zA-Z0-9_\-]/g, '_');
    pdf.save(`${safeName}.pdf`);

    return true;
  } catch (error) {
    console.error('Gagal mengunduh PDF:', error);
    // Fallback: jalankan cetak native
    window.print();
    return false;
  } finally {
    // Kembalikan style semula
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
    element.style.transition = originalTransition;
  }
}

export function printLetterNative(): void {
  window.print();
}

export function generateLetterPlainText(doc: LetterDocument, school: SchoolProfile): string {
  const lines: string[] = [];

  // Kop Surat
  lines.push('====================================================');
  lines.push(school.govHeader.toUpperCase());
  if (school.subHeader) lines.push(school.subHeader.toUpperCase());
  lines.push(school.name.toUpperCase());
  lines.push(`NPSN: ${school.npsn} | ${school.akreditasi}`);
  lines.push(`Alamat: ${school.address}, ${school.city}`);
  lines.push(`Telp: ${school.phone} | Email: ${school.email}`);
  lines.push('====================================================');
  lines.push('');

  // Tanggal & Nomor
  lines.push(`${doc.placeCity}, ${doc.letterDate}`);
  lines.push(`Nomor     : ${doc.letterNumber}`);
  lines.push(`Lampiran  : ${doc.attachmentCount}`);
  lines.push(`Perihal   : ${doc.subject}`);
  lines.push('');
  lines.push(`Kepada Yth.`);
  lines.push(doc.recipientName);
  lines.push(doc.recipientLocation);
  lines.push('');

  // Pembuka
  lines.push(doc.opening);
  lines.push('');

  // Data Siswa jika ada
  if (doc.type === 'keterangan_aktif' || doc.type === 'kelakuan_baik' || doc.type === 'rekomendasi' || doc.type === 'keterangan_pindah') {
    lines.push(`Nama Lengkap   : ${doc.student.name}`);
    lines.push(`NIS / NISN     : ${doc.student.nis} / ${doc.student.nisn}`);
    lines.push(`Kelas          : ${doc.student.className}`);
    lines.push(`TTL            : ${doc.student.birthPlaceDate}`);
    lines.push(`Jenis Kelamin  : ${doc.student.gender}`);
    lines.push(`Nama Orang Tua : ${doc.student.parentName}`);
    lines.push(`Alamat         : ${doc.student.address}`);
    lines.push(`Keperluan      : ${doc.student.purpose}`);
    lines.push('');
  }

  // Acara / Undangan jika ada
  if (doc.type === 'undangan_ortu') {
    lines.push(`Hari, Tanggal : ${doc.meeting.dayDate}`);
    lines.push(`Waktu         : ${doc.meeting.time}`);
    lines.push(`Tempat        : ${doc.meeting.place}`);
    lines.push(`Acara         : ${doc.meeting.agenda}`);
    lines.push('');
  }

  // Paragraf Utama
  if (doc.mainParagraph) {
    lines.push(doc.mainParagraph);
    lines.push('');
  }

  // Penutup
  lines.push(doc.closing);
  lines.push('');

  // Tanda Tangan
  lines.push(`${school.headmasterRole},`);
  lines.push('');
  lines.push('');
  lines.push(school.headmasterName);
  lines.push(`NIP. ${school.headmasterNip}`);

  return lines.join('\n');
}

export function downloadAsWordDoc(doc: LetterDocument, school: SchoolProfile, filename: string): void {
  const content = generateLetterPlainText(doc, school);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
